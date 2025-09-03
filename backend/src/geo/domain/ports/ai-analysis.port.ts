import { Content } from '../entities/content.entity'

export interface AIAnalysisPort {
    analyzeContent(content: Content): Promise<AIAnalysisResult>
    validateContent(content: Content): Promise<ValidationResult>
}

export interface AIAnalysisResult {
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
    geoRecommendations: {
        contentOptimization: string[]
        authorityEnhancement: string[]
        citationImprovement: string[]
    }
    overallAssessment: {
        strengths: string[]
        improvements: string[]
        potentialImpact: 'low' | 'moderate' | 'high'
    }
    knowledgeGraph?: {
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
}

export interface ValidationResult {
    isValid: boolean
    errors: string[]
    warnings: string[]
}
