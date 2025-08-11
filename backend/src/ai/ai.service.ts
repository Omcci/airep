import { Injectable, Logger, OnModuleInit, BadRequestException } from '@nestjs/common'
import { OpenAIService } from './openai.service'
import { AIConsolidationService } from './ai-consolidation.service'
import { AISecurityService, SecurityCheckResult } from './ai-security.service'
import type { AIAnalysisRequest, AIConsolidatedResponse } from './ai.interface'

@Injectable()
export class AIService implements OnModuleInit {
  private readonly logger = new Logger(AIService.name)
  private providers: any[] = []

  constructor(
    private readonly openaiService: OpenAIService,
    private readonly aiConsolidationService: AIConsolidationService,
    private readonly aiSecurityService: AISecurityService,
  ) {}

  async onModuleInit() {
    // Initialize providers
    if (this.openaiService.isHealthy()) {
      this.providers.push(this.openaiService)
      this.logger.log('OpenAI service initialized successfully')
    } else {
      this.logger.warn('OpenAI service not available')
    }

    this.logger.log(`AI Service initialized with ${this.providers.length} providers`)
  }

  /**
   * Analyze content using AI with security checks
   */
  async analyzeContent(request: AIAnalysisRequest): Promise<AIConsolidatedResponse> {
    const { content, platform, contentType } = request

    // 1. Security Check
    this.logger.log(`Starting AI analysis for ${platform} platform`)
    const securityResult = await this.aiSecurityService.checkInputSecurity(content, platform)
    
    if (securityResult.blocked) {
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

    // 2. Sanitize content
    const sanitizedContent = this.aiSecurityService.sanitizeContent(content)
    
    // 3. Proceed with AI analysis
    return this.aiConsolidationService.consolidateAnalysis({
      content: sanitizedContent,
      platform,
      contentType
    })
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
