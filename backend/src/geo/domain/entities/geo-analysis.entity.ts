import { CitationAnalysis } from './citation-analysis.entity'
import { Content } from './content.entity'
import { GEOMetrics } from '../value-objects/geo-metrics.vo'

export class GEOAnalysisResult {
    constructor(
        public readonly content: Content,
        public readonly citationAnalysis: CitationAnalysis,
        public readonly geoRecommendations: GEORecommendations,
        public readonly overallAssessment: OverallAssessment,
        public readonly analyzedAt: Date = new Date()
    ) { }

    public hasActionableInsights(): boolean {
        return this.geoRecommendations.hasRecommendations() ||
            this.citationAnalysis.hasQuotableContent()
    }

    public getContentScore(): number {
        return this.citationAnalysis.metrics.getOverallScore()
    }

    public getPrimaryInsights(): string[] {
        const insights: string[] = []

        if (this.citationAnalysis.hasQuotableContent()) {
            insights.push(`Found ${this.citationAnalysis.quotableElements.length} quotable elements`)
        }

        if (this.citationAnalysis.hasCitationContexts()) {
            insights.push(`Identified ${this.citationAnalysis.citationContexts.length} citation contexts`)
        }

        const score = this.getContentScore()
        if (score >= 80) {
            insights.push('Excellent AI visibility potential')
        } else if (score >= 60) {
            insights.push('Good AI visibility with room for improvement')
        } else {
            insights.push('Significant optimization opportunities identified')
        }

        return insights
    }
}

export class GEORecommendations {
    constructor(
        public readonly contentOptimization: string[],
        public readonly authorityEnhancement: string[],
        public readonly citationImprovement: string[]
    ) { }

    public hasRecommendations(): boolean {
        return this.contentOptimization.length > 0 ||
            this.authorityEnhancement.length > 0 ||
            this.citationImprovement.length > 0
    }

    public getAllRecommendations(): string[] {
        return [
            ...this.contentOptimization,
            ...this.authorityEnhancement,
            ...this.citationImprovement
        ]
    }

    public getTopPriority(): string[] {
        // Return top 3 most impactful recommendations
        return this.getAllRecommendations().slice(0, 3)
    }
}

export class OverallAssessment {
    constructor(
        public readonly strengths: string[],
        public readonly improvements: string[],
        public readonly potentialImpact: 'low' | 'moderate' | 'high'
    ) { }

    public getImpactLevel(): number {
        switch (this.potentialImpact) {
            case 'high': return 3
            case 'moderate': return 2
            case 'low': return 1
            default: return 1
        }
    }
}
