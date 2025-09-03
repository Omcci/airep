import { Module } from '@nestjs/common'
import { GEOController } from './presentation/controllers/geo.controller'
import { AnalyzeContentUseCase } from './application/use-cases/analyze-content.use-case'
import { GetRecommendationsUseCase } from './application/use-cases/get-recommendations.use-case'
import { GEODomainService } from './domain/services/geo-domain.service'
import { AIProviderAdapter } from './infrastructure/adapters/ai-provider.adapter'
import { ContentExtractorAdapter } from './infrastructure/adapters/content-extractor.adapter'
import { AIModule } from '../ai/ai.module'
import { ProxyModule } from '../proxy/proxy.module'
import { AI_ANALYSIS_PORT, CONTENT_EXTRACTION_PORT, CONTENT_FACTORY } from './geo.tokens'

@Module({
    imports: [AIModule, ProxyModule],
    controllers: [GEOController],
    providers: [
        // Use Cases
        AnalyzeContentUseCase,
        GetRecommendationsUseCase,

        // Domain Services
        GEODomainService,

        // Infrastructure Adapters
        {
            provide: AI_ANALYSIS_PORT,
            useClass: AIProviderAdapter
        },
        {
            provide: CONTENT_EXTRACTION_PORT,
            useClass: ContentExtractorAdapter
        },
        {
            provide: CONTENT_FACTORY,
            useClass: ContentExtractorAdapter
        }
    ],
    exports: [
        AnalyzeContentUseCase,
        GetRecommendationsUseCase,
        GEODomainService
    ]
})
export class GEOModule { }
