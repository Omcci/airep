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
    knowledgeGraph: {
        nodes: APINode[]
        edges: APIEdge[]
    }
    aiPerceptionMetrics: {
        citationLikelihood: number
        knowledgeIntegration: number
        authorityScore: number
        uniquenessValue: number
        referenceQuality: number
    }
    rankingFactors: Record<string, number>
    competitiveAnalysis: {
        marketPosition: string
        uniqueStrengths: string[]
    }
    geoRecommendations: {
        contentOptimization: string[]
    }
}