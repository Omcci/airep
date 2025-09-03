import { Injectable, Inject } from '@nestjs/common'
import { GEODomainService } from '../../domain/services/geo-domain.service'
import type { ContentFactory } from '../../domain/ports/content-extraction.port'
import { ContentType } from '../../domain/entities/content.entity'
import { AnalyzeContentRequestDto } from '../dto/geo-analysis.dto'
import { CONTENT_FACTORY } from '../../geo.tokens'

export interface RecommendationsResponseDto {
    topPriority: string[]
    contentOptimization: string[]
    authorityEnhancement: string[]
    citationImprovement: string[]
    contentMaturity: string
    primaryInsights: string[]
}

@Injectable()
export class GetRecommendationsUseCase {
    constructor(
        private readonly geoDomainService: GEODomainService,
        @Inject(CONTENT_FACTORY) private readonly contentFactory: ContentFactory
    ) { }

    async execute(request: AnalyzeContentRequestDto): Promise<RecommendationsResponseDto> {
        // Create content entity
        const content = request.url
            ? await this.contentFactory.createFromUrl(request.url, request.contentType as ContentType)
            : this.contentFactory.createFromText(request.content, request.contentType as ContentType)

        // Perform analysis
        const analysisResult = await this.geoDomainService.analyzeContent(content)

        // Calculate content maturity using domain logic
        const contentMaturity = this.geoDomainService.calculateContentMaturity(
            analysisResult.citationAnalysis.metrics
        )

        return {
            topPriority: analysisResult.geoRecommendations.getTopPriority(),
            contentOptimization: analysisResult.geoRecommendations.contentOptimization,
            authorityEnhancement: analysisResult.geoRecommendations.authorityEnhancement,
            citationImprovement: analysisResult.geoRecommendations.citationImprovement,
            contentMaturity,
            primaryInsights: analysisResult.getPrimaryInsights()
        }
    }
}
