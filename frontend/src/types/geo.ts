export interface APINode {
    id: string
    label: string
    type: string
    score: number
    metrics: {
        authority: number
        relevance: number
        freshness: number
    }
}

export interface APIEdge {
    source: string
    target: string
    type?: string
    value?: number
}

export interface CitationAnalysis {
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

export interface GEOAnalysisData {
    citationAnalysis: CitationAnalysis
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
        nodes: APINode[]
        edges: APIEdge[]
    }
    rankingFactors: Record<string, number>
    competitiveAnalysis: {
        marketPosition: string
        uniqueStrengths: string[]
    }
}