import { Injectable, BadRequestException, Inject } from '@nestjs/common'
import { GEODomainService } from '../../domain/services/geo-domain.service'
import type { ContentFactory } from '../../domain/ports/content-extraction.port'
import { Content, ContentType } from '../../domain/entities/content.entity'
import { GEOAnalysisResult } from '../../domain/entities/geo-analysis.entity'
import { AnalyzeContentRequestDto, GEOAnalysisResponseDto } from '../dto/geo-analysis.dto'
import { CONTENT_FACTORY } from '../../geo.tokens'

@Injectable()
export class AnalyzeContentUseCase {
    constructor(
        private readonly geoDomainService: GEODomainService,
        @Inject(CONTENT_FACTORY) private readonly contentFactory: ContentFactory
    ) { }

    async execute(request: AnalyzeContentRequestDto): Promise<GEOAnalysisResponseDto> {
        // Create content entity
        const content = await this.createContent(request)

        // Validate content using domain rules
        const validationErrors = this.geoDomainService.validateContentForAnalysis(content)
        if (validationErrors.length > 0) {
            throw new BadRequestException(`Content validation failed: ${validationErrors.join(', ')}`)
        }

        // Perform analysis
        const analysisResult = await this.geoDomainService.analyzeContent(content)

        // Transform to response DTO
        return this.transformToResponseDto(analysisResult)
    }

    private async createContent(request: AnalyzeContentRequestDto): Promise<Content> {
        const contentType = request.contentType as ContentType

        if (request.url) {
            return await this.contentFactory.createFromUrl(request.url, contentType)
        } else {
            return this.contentFactory.createFromText(request.content, contentType)
        }
    }

    private transformToResponseDto(result: GEOAnalysisResult): GEOAnalysisResponseDto {
        const metrics = result.citationAnalysis.metrics

        return {
            citationAnalysis: {
                likelihood: result.citationAnalysis.likelihood.getValue(),
                quotableElements: result.citationAnalysis.quotableElements.map(el => el.text),
                citationContexts: result.citationAnalysis.citationContexts.map(ctx => ctx.name),
                metrics: {
                    citationLikelihood: metrics.citationLikelihood,
                    knowledgeIntegration: metrics.knowledgeIntegration,
                    authorityScore: metrics.authorityScore,
                    uniquenessValue: metrics.uniquenessValue,
                    referenceQuality: metrics.referenceQuality
                }
            },
            knowledgeSynthesis: {
                integrationScore: metrics.knowledgeIntegration,
                uniqueValue: result.citationAnalysis.quotableElements.map(el => el.text).slice(0, 3),
                topicConnections: result.citationAnalysis.citationContexts.map(ctx => ctx.name)
            },
            authorityEvaluation: {
                credibilityScore: metrics.authorityScore,
                expertiseSignals: result.citationAnalysis.quotableElements.map(el => el.text).slice(0, 2),
                trustFactors: result.citationAnalysis.citationContexts.map(ctx => ctx.name).slice(0, 2)
            },
            geoRecommendations: {
                contentOptimization: result.geoRecommendations.contentOptimization,
                authorityEnhancement: result.geoRecommendations.authorityEnhancement,
                citationImprovement: result.geoRecommendations.citationImprovement
            },
            overallAssessment: {
                strengths: result.overallAssessment.strengths,
                improvements: result.overallAssessment.improvements,
                potentialImpact: result.overallAssessment.potentialImpact
            },
            aiPerceptionMetrics: {
                citationLikelihood: metrics.citationLikelihood,
                knowledgeIntegration: metrics.knowledgeIntegration,
                authorityScore: metrics.authorityScore,
                uniquenessValue: metrics.uniquenessValue,
                referenceQuality: metrics.referenceQuality
            },
            knowledgeGraph: {
                nodes: [{
                    id: "content",
                    label: "Current Content",
                    type: "content",
                    score: metrics.getOverallScore(),
                    metrics: {
                        authority: metrics.authorityScore,
                        relevance: metrics.knowledgeIntegration,
                        freshness: 85 // Default value for now
                    }
                }],
                edges: []
            },
            rankingFactors: {
                relevanceScore: metrics.knowledgeIntegration,
                authorityScore: metrics.authorityScore,
                citationLikelihood: metrics.citationLikelihood,
                uniquenessValue: metrics.uniquenessValue,
                referenceQuality: metrics.referenceQuality
            },
            competitiveAnalysis: {
                marketPosition: this.determineMarketPosition(metrics.getOverallScore()),
                uniqueStrengths: metrics.getStrengths()
            }
        }
    }

    private determineMarketPosition(score: number): string {
        if (score >= 90) return 'leader'
        if (score >= 75) return 'strong'
        if (score >= 60) return 'competitive'
        return 'niche'
    }
}
