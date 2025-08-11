import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common'

export interface RateLimitConfig {
  requestsPerMinute: number
  requestsPerHour: number
  requestsPerDay: number
  maxCostPerDay: number
  maxTokensPerRequest: number
  concurrentRequests: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  costRemaining: number
  reason?: string
}

export interface UserUsage {
  requests: {
    minute: { count: number; resetTime: number }
    hour: { count: number; resetTime: number }
    day: { count: number; resetTime: number }
  }
  cost: { total: number; resetTime: number }
  concurrent: { count: number; resetTime: number }
}

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name)
  
  // In-memory storage (in production, use Redis)
  private userUsage = new Map<string, UserUsage>()
  
  // Default rate limits
  private readonly defaultConfig: RateLimitConfig = {
    requestsPerMinute: 10,
    requestsPerHour: 100,
    requestsPerDay: 500,
    maxCostPerDay: 5.0, // $5 per day
    maxTokensPerRequest: 10000,
    concurrentRequests: 3
  }

  // Platform-specific limits
  private readonly platformConfigs: Record<string, RateLimitConfig> = {
    linkedin: {
      ...this.defaultConfig,
      requestsPerMinute: 15, // LinkedIn posts are common
      requestsPerHour: 150,
      requestsPerDay: 750
    },
    twitter: {
      ...this.defaultConfig,
      requestsPerMinute: 20, // Twitter is very active
      requestsPerHour: 200,
      requestsPerDay: 1000
    },
    blog: {
      ...this.defaultConfig,
      requestsPerMinute: 5, // Blog posts are less frequent
      requestsPerHour: 50,
      requestsPerDay: 200
    },
    email: {
      ...this.defaultConfig,
      requestsPerMinute: 8, // Email campaigns are moderate
      requestsPerHour: 80,
      requestsPerDay: 400
    }
  }

  /**
   * Check if a request is allowed based on rate limits
   */
  async checkRateLimit(
    userId: string,
    platform: string,
    requestType: string,
    estimatedCost: number = 0,
    estimatedTokens: number = 0,
    ipAddress?: string
  ): Promise<RateLimitResult> {
    const config = this.platformConfigs[platform] || this.defaultConfig
    
    try {
      // Get or create user usage tracking
      const userUsage = this.getOrCreateUserUsage(userId)
      
      // Check concurrent requests
      if (userUsage.concurrent.count >= config.concurrentRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: userUsage.concurrent.resetTime,
          costRemaining: userUsage.cost.total,
          reason: 'Too many concurrent requests'
        }
      }

      // Check token limits
      if (estimatedTokens > config.maxTokensPerRequest) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: Date.now() + 60000, // 1 minute
          costRemaining: userUsage.cost.total,
          reason: `Request exceeds token limit of ${config.maxTokensPerRequest}`
        }
      }

      // Check cost limits
      if (userUsage.cost.total + estimatedCost > config.maxCostPerDay) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: userUsage.cost.resetTime,
          costRemaining: config.maxCostPerDay - userUsage.cost.total,
          reason: 'Daily cost limit exceeded'
        }
      }

      // Check request frequency limits
      const now = Date.now()
      
      // Minute limit
      if (userUsage.requests.minute.count >= config.requestsPerMinute) {
        if (now < userUsage.requests.minute.resetTime) {
          return {
            allowed: false,
            remaining: 0,
            resetTime: userUsage.requests.minute.resetTime,
            costRemaining: userUsage.cost.total,
            reason: 'Minute rate limit exceeded'
          }
        } else {
          // Reset minute counter
          userUsage.requests.minute.count = 0
          userUsage.requests.minute.resetTime = now + 60000
        }
      }

      // Hour limit
      if (userUsage.requests.hour.count >= config.requestsPerHour) {
        if (now < userUsage.requests.hour.resetTime) {
          return {
            allowed: false,
            remaining: 0,
            resetTime: userUsage.requests.hour.resetTime,
            costRemaining: userUsage.cost.total,
            reason: 'Hour rate limit exceeded'
          }
        } else {
          // Reset hour counter
          userUsage.requests.hour.count = 0
          userUsage.requests.hour.resetTime = now + 3600000
        }
      }

      // Day limit
      if (userUsage.requests.day.count >= config.requestsPerDay) {
        if (now < userUsage.requests.day.resetTime) {
          return {
            allowed: false,
            remaining: 0,
            resetTime: userUsage.requests.day.resetTime,
            costRemaining: userUsage.cost.total,
            reason: 'Daily rate limit exceeded'
          }
        } else {
          // Reset day counter
          userUsage.requests.day.count = 0
          userUsage.requests.day.resetTime = now + 86400000
        }
      }

      // All checks passed - increment counters
      userUsage.requests.minute.count++
      userUsage.requests.hour.count++
      userUsage.requests.day.count++
      userUsage.concurrent.count++
      userUsage.cost.total += estimatedCost

      // Set reset times if not already set
      if (userUsage.requests.minute.resetTime === 0) {
        userUsage.requests.minute.resetTime = now + 60000
      }
      if (userUsage.requests.hour.resetTime === 0) {
        userUsage.requests.hour.resetTime = now + 3600000
      }
      if (userUsage.requests.day.resetTime === 0) {
        userUsage.requests.day.resetTime = now + 86400000
      }
      if (userUsage.cost.resetTime === 0) {
        userUsage.cost.resetTime = now + 86400000
      }

      // Calculate remaining requests
      const remaining = Math.min(
        config.requestsPerMinute - userUsage.requests.minute.count,
        config.requestsPerHour - userUsage.requests.hour.count,
        config.requestsPerDay - userUsage.requests.day.count
      )

      return {
        allowed: true,
        remaining: Math.max(0, remaining),
        resetTime: Math.min(
          userUsage.requests.minute.resetTime,
          userUsage.requests.hour.resetTime,
          userUsage.requests.day.resetTime
        ),
        costRemaining: config.maxCostPerDay - userUsage.cost.total
      }

    } catch (error) {
      this.logger.error(`Rate limit check failed for user ${userId}:`, error)
      // On error, allow the request but log it
      return {
        allowed: true,
        remaining: 0,
        resetTime: Date.now() + 60000,
        costRemaining: 0,
        reason: 'Rate limit check failed, allowing request'
      }
    }
  }

  /**
   * Release a concurrent request slot
   */
  async releaseConcurrentSlot(userId: string): Promise<void> {
    const userUsage = this.userUsage.get(userId)
    if (userUsage && userUsage.concurrent.count > 0) {
      userUsage.concurrent.count--
      this.logger.debug(`Released concurrent slot for user ${userId}`)
    }
  }

  /**
   * Get current usage for a user
   */
  getCurrentUsage(userId: string): UserUsage | null {
    return this.userUsage.get(userId) || null
  }

  /**
   * Reset usage for a user (admin function)
   */
  resetUserUsage(userId: string): void {
    this.userUsage.delete(userId)
    this.logger.log(`Reset usage for user ${userId}`)
  }

  /**
   * Get rate limit configuration for a platform
   */
  getPlatformConfig(platform: string): RateLimitConfig {
    return this.platformConfigs[platform] || this.defaultConfig
  }

  /**
   * Update rate limit configuration for a platform
   */
  updatePlatformConfig(platform: string, config: Partial<RateLimitConfig>): void {
    if (this.platformConfigs[platform]) {
      this.platformConfigs[platform] = { ...this.platformConfigs[platform], ...config }
      this.logger.log(`Updated rate limit config for ${platform}`)
    }
  }

  /**
   * Clean up expired usage data
   */
  cleanupExpiredUsage(): void {
    const now = Date.now()
    let cleanedCount = 0

    for (const [userId, usage] of this.userUsage.entries()) {
      // Clean up if all reset times are in the past
      if (
        usage.requests.minute.resetTime < now &&
        usage.requests.hour.resetTime < now &&
        usage.requests.day.resetTime < now &&
        usage.cost.resetTime < now
      ) {
        this.userUsage.delete(userId)
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} expired user usage records`)
    }
  }

  /**
   * Get or create user usage tracking
   */
  private getOrCreateUserUsage(userId: string): UserUsage {
    if (!this.userUsage.has(userId)) {
      this.userUsage.set(userId, {
        requests: {
          minute: { count: 0, resetTime: 0 },
          hour: { count: 0, resetTime: 0 },
          day: { count: 0, resetTime: 0 }
        },
        cost: { total: 0, resetTime: 0 },
        concurrent: { count: 0, resetTime: 0 }
      })
    }
    return this.userUsage.get(userId)!
  }

  /**
   * Schedule cleanup task
   */
  onModuleInit() {
    // Clean up expired usage every 5 minutes
    setInterval(() => {
      this.cleanupExpiredUsage()
    }, 5 * 60 * 1000)
  }
}
