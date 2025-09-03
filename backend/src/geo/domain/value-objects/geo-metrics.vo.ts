export class GEOMetrics {
    constructor(
        public readonly citationLikelihood: number,
        public readonly knowledgeIntegration: number,
        public readonly authorityScore: number,
        public readonly uniquenessValue: number,
        public readonly referenceQuality: number
    ) {
        this.validateMetrics()
    }

    private validateMetrics(): void {
        const metrics = [
            this.citationLikelihood,
            this.knowledgeIntegration,
            this.authorityScore,
            this.uniquenessValue,
            this.referenceQuality
        ]

        metrics.forEach(metric => {
            if (metric < 0 || metric > 100) {
                throw new Error('All metrics must be between 0 and 100')
            }
        })
    }

    public getOverallScore(): number {
        return Math.round(
            (this.citationLikelihood +
                this.knowledgeIntegration +
                this.authorityScore +
                this.uniquenessValue +
                this.referenceQuality) / 5
        )
    }

    public getStrengths(): string[] {
        const strengths: string[] = []

        if (this.citationLikelihood >= 80) strengths.push('High Citation Potential')
        if (this.knowledgeIntegration >= 80) strengths.push('Excellent Knowledge Integration')
        if (this.authorityScore >= 80) strengths.push('Strong Authority Signals')
        if (this.uniquenessValue >= 80) strengths.push('Unique Value Proposition')
        if (this.referenceQuality >= 80) strengths.push('High Reference Quality')

        return strengths
    }

    public getWeaknesses(): string[] {
        const weaknesses: string[] = []

        if (this.citationLikelihood < 60) weaknesses.push('Low Citation Potential')
        if (this.knowledgeIntegration < 60) weaknesses.push('Limited Knowledge Integration')
        if (this.authorityScore < 60) weaknesses.push('Weak Authority Signals')
        if (this.uniquenessValue < 60) weaknesses.push('Limited Uniqueness')
        if (this.referenceQuality < 60) weaknesses.push('Poor Reference Quality')

        return weaknesses
    }

    public toRadarData(): Array<{ metric: string, value: number }> {
        return [
            { metric: 'Citation Likelihood', value: this.citationLikelihood },
            { metric: 'Knowledge Integration', value: this.knowledgeIntegration },
            { metric: 'Authority Score', value: this.authorityScore },
            { metric: 'Uniqueness Value', value: this.uniquenessValue },
            { metric: 'Reference Quality', value: this.referenceQuality }
        ]
    }
}
