import { Module } from '@nestjs/common'
import { AIService } from './ai.service'
import { OpenAIService } from './openai.service'
import { AnthropicService } from './anthropic.service'
import { MistralService } from './mistral.service'
import { GeminiService } from './gemini.service'
import { AIConsolidationService } from './ai-consolidation.service'
import { AITestController } from './ai-test.controller'
import { AISecurityService } from './ai-security.service'
import { RateLimitService } from './rate-limit.service'

@Module({
  controllers: [AITestController],
  providers: [
    AIService,
    OpenAIService,
    AnthropicService,
    MistralService,
    GeminiService,
    AIConsolidationService,
    AISecurityService,
    RateLimitService,
  ],
  exports: [AIService, AISecurityService, RateLimitService],
})
export class AIModule { }
