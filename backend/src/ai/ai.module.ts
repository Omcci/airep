import { Module } from '@nestjs/common'
import { AIService } from './ai.service'
import { OpenAIService } from './openai.service'
import { AIConsolidationService } from './ai-consolidation.service'
import { AITestController } from './ai-test.controller'
import { AISecurityService } from './ai-security.service'

@Module({
  controllers: [AITestController],
  providers: [
    AIService,
    OpenAIService,
    AIConsolidationService,
    AISecurityService,
  ],
  exports: [AIService, AISecurityService],
})
export class AIModule {}
