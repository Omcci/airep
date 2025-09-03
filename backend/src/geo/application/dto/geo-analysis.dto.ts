import { IsString, IsNotEmpty, IsIn, IsOptional, IsUrl } from 'class-validator'

export class AnalyzeContentRequestDto {
    @IsString()
    @IsNotEmpty()
    content: string

    @IsString()
    @IsIn(['tool', 'article', 'documentation', 'api'])
    contentType: string

    @IsOptional()
    @IsUrl()
    url?: string
}

export class GEOAnalysisResponseDto {
    citationAnalysis: {
        likelihood: number
        quotableElements: string[]
        citationContexts: string[]
        metrics: {
            citationLikelihood: number
            knowledgeIntegration: number
            authorityScore: number
            uniquenessValue: number
            referenceQuality: number
        }
    }

    knowledgeSynthesis: {
        integrationScore: number
        uniqueValue: string[]
        topicConnections: string[]
    }

    authorityEvaluation: {
        credibilityScore: number
        expertiseSignals: string[]
        trustFactors: string[]
    }

    geoRecommendations: {
        contentOptimization: string[]
        authorityEnhancement: string[]
        citationImprovement: string[]
    }

    overallAssessment: {
        strengths: string[]
        improvements: string[]
        potentialImpact: string
    }

    aiPerceptionMetrics: {
        citationLikelihood: number
        knowledgeIntegration: number
        authorityScore: number
        uniquenessValue: number
        referenceQuality: number
    }

    knowledgeGraph: {
        nodes: Array<{
            id: string
            label: string
            type: string
            score: number
            metrics: {
                authority: number
                relevance: number
                freshness: number
            }
        }>
        edges: Array<{
            source: string
            target: string
            type: string
            strength: number
        }>
    }

    rankingFactors: Record<string, number>

    competitiveAnalysis: {
        marketPosition: string
        uniqueStrengths: string[]
    }
}
