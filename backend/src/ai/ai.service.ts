import { Injectable, Logger, OnModuleInit, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { OpenAIService } from './openai.service'
import { AnthropicService } from './anthropic.service'
import { MistralService } from './mistral.service'
import { GeminiService } from './gemini.service'
import { AIConsolidationService } from './ai-consolidation.service'
import { AISecurityService, SecurityCheckResult } from './ai-security.service'
import { RateLimitService, RateLimitResult } from './rate-limit.service'
import type { AIAnalysisRequest, AIConsolidatedResponse } from './ai.interface'
import { AIAnalysisRequestDto, Platform, ContentType } from './dto/ai-analysis.dto'

@Injectable()
export class AIService implements OnModuleInit {
  private readonly logger = new Logger(AIService.name)
  private providers: any[] = []

  constructor(
    private readonly openaiService: OpenAIService,
    private readonly anthropicService: AnthropicService,
    private readonly mistralService: MistralService,
    private readonly geminiService: GeminiService,
    private readonly aiConsolidationService: AIConsolidationService,
    private readonly aiSecurityService: AISecurityService,
    private readonly rateLimitService: RateLimitService,
  ) { }

  async onModuleInit() {
    // Initialize providers
    if (await this.openaiService.isHealthy()) {
      this.providers.push(this.openaiService)
      this.logger.log('OpenAI service initialized successfully')
    } else {
      this.logger.warn('OpenAI service not available')
    }

    if (await this.anthropicService.isHealthy()) {
      this.providers.push(this.anthropicService)
      this.logger.log('Anthropic Claude service initialized successfully')
    } else {
      this.logger.warn('Anthropic Claude service not available')
    }

    if (await this.mistralService.isHealthy()) {
      this.providers.push(this.mistralService)
      this.logger.log('Mistral AI service initialized successfully')
    } else {
      this.logger.warn('Mistral AI service not available')
    }

    if (await this.geminiService.isHealthy()) {
      this.providers.push(this.geminiService)
      this.logger.log('Google Gemini service initialized successfully')
    } else {
      this.logger.warn('Google Gemini service not available')
    }

    this.logger.log(`AI Service initialized with ${this.providers.length} providers`)
  }

  /**
   * Analyze content using AI with complete security pipeline
   */
  async analyzeContent(request: AIAnalysisRequestDto, userId: string = 'anonymous'): Promise<AIConsolidatedResponse> {
    const { content, platform, contentType } = request

    try {
      // 1. Input Validation (already done by DTO decorators)
      this.logger.log(`Starting AI analysis for ${platform} platform`)

      // 2. Rate Limiting Check
      const estimatedCost = await this.getEstimatedCost(content, platform)
      const estimatedTokens = Math.ceil(content.length / 4) + 500 // Rough token estimation

      const rateLimitResult = await this.rateLimitService.checkRateLimit(
        userId,
        platform,
        'analyze',
        estimatedCost.estimatedCost,
        estimatedTokens
      )

      if (!rateLimitResult.allowed) {
        throw new HttpException({
          message: 'Rate limit exceeded',
          reason: rateLimitResult.reason,
          resetTime: rateLimitResult.resetTime,
          costRemaining: rateLimitResult.costRemaining
        }, HttpStatus.TOO_MANY_REQUESTS)
      }

      // 3. Security Check
      const securityResult = await this.aiSecurityService.checkInputSecurity(content, platform)

      if (securityResult.blocked) {
        // Release the rate limit slot since we're not proceeding
        await this.rateLimitService.releaseConcurrentSlot(userId)

        this.logger.warn(`Content blocked by security service: ${securityResult.reason}`)
        throw new BadRequestException({
          message: 'Content blocked for security reasons',
          reason: securityResult.reason,
          warnings: securityResult.warnings,
          recommendations: this.aiSecurityService.getSecurityRecommendations(securityResult)
        })
      }

      if (securityResult.riskLevel === 'high') {
        this.logger.warn(`High security risk detected: ${securityResult.warnings.join(', ')}`)
      }

      // 4. Sanitize content
      const sanitizedContent = this.aiSecurityService.sanitizeContent(content)

      try {
        // 5. Proceed with AI analysis
        const result = await this.aiConsolidationService.consolidateAnalysis(
          this.providers,
          {
            content: sanitizedContent,
            platform,
            contentType
          }
        )

        this.logger.log(`AI analysis completed successfully for user ${userId}`)
        return result

      } finally {
        // Always release the concurrent slot
        await this.rateLimitService.releaseConcurrentSlot(userId)
      }

    } catch (error) {
      // Release the concurrent slot on any error
      await this.rateLimitService.releaseConcurrentSlot(userId)

      if (error instanceof HttpException || error instanceof BadRequestException) {
        throw error
      }

      this.logger.error(`AI analysis failed for user ${userId}:`, error.message)
      throw new HttpException({
        message: 'AI analysis failed',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Check security for content without AI analysis
   */
  async checkContentSecurity(content: string, platform: string, userId: string = 'anonymous'): Promise<SecurityCheckResult> {
    // Rate limiting for security checks
    const rateLimitResult = await this.rateLimitService.checkRateLimit(
      userId,
      platform,
      'security-check',
      0, // No cost for security checks
      0
    )

    if (!rateLimitResult.allowed) {
      throw new HttpException({
        message: 'Rate limit exceeded',
        reason: rateLimitResult.reason,
        resetTime: rateLimitResult.resetTime
      }, HttpStatus.TOO_MANY_REQUESTS)
    }

    try {
      const securityResult = await this.aiSecurityService.checkInputSecurity(content, platform)
      return securityResult
    } finally {
      await this.rateLimitService.releaseConcurrentSlot(userId)
    }
  }

  /**
   * Get provider status
   */
  getProviderStatus(): Array<{ name: string; healthy: boolean; costPerToken: number; maxTokens: number }> {
    return this.providers.map(provider => ({
      name: provider.constructor.name,
      healthy: provider.isHealthy(),
      costPerToken: provider.getCostPerToken(),
      maxTokens: provider.getMaxTokens(),
    }))
  }

  /**
   * Get estimated cost for analysis
   */
  async getEstimatedCost(content: string, platform: string): Promise<{ estimatedCost: number; currency: string }> {
    const totalCost = this.providers.reduce((sum, provider) => {
      if (provider.isHealthy()) {
        return sum + provider.getCostPerToken() * content.length
      }
      return sum
    }, 0)

    return {
      estimatedCost: totalCost,
      currency: 'USD'
    }
  }

  /**
   * Get rate limit information for a user
   */
  async getRateLimitInfo(userId: string, platform: string): Promise<{
    currentUsage: any
    platformConfig: any
    remaining: RateLimitResult
  }> {
    const currentUsage = this.rateLimitService.getCurrentUsage(userId)
    const platformConfig = this.rateLimitService.getPlatformConfig(platform)

    // Check current rate limit status
    const remaining = await this.rateLimitService.checkRateLimit(
      userId,
      platform,
      'analyze',
      0,
      0
    )

    return {
      currentUsage,
      platformConfig,
      remaining
    }
  }

  /**
   * Refresh providers (useful for dynamic configuration)
   */
  async refreshProviders(): Promise<void> {
    this.providers = []
    await this.onModuleInit()
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): string[] {
    return this.providers
      .filter(provider => provider.isHealthy())
      .map(provider => provider.constructor.name)
  }

  /**
   * Get total number of providers
   */
  getTotalProviders(): number {
    return this.providers.length
  }

  /**
   * Get security recommendations for content
   */
  async getSecurityRecommendations(content: string, platform: string): Promise<string[]> {
    const securityResult = await this.aiSecurityService.checkInputSecurity(content, platform)
    return this.aiSecurityService.getSecurityRecommendations(securityResult)
  }
}
