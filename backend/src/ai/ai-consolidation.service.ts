import { Injectable, Logger } from '@nestjs/common'
import { AIProvider, AIAnalysisRequest, AIAnalysisResponse, AIConsolidatedResponse } from './ai.interface'

@Injectable()
export class AIConsolidationService {
    private readonly logger = new Logger(AIConsolidationService.name)

    async consolidateAnalysis(
        providers: AIProvider[],
        request: AIAnalysisRequest
    ): Promise<AIConsolidatedResponse> {
        const startTime = Date.now()
        this.logger.log(`Starting AI consolidation with ${providers.length} providers`)

        try {
            // Get responses from all healthy providers in parallel
            const healthyProviders = await this.filterHealthyProviders(providers)

            if (healthyProviders.length === 0) {
                throw new Error('No healthy AI providers available')
            }

            this.logger.log(`Using ${healthyProviders.length} healthy providers: ${healthyProviders.map(p => p.name).join(', ')}`)

            // Analyze content with all providers simultaneously
            const analysisPromises = healthyProviders.map(provider =>
                this.analyzeWithProvider(provider, request)
            )

            const responses = await Promise.allSettled(analysisPromises)
            const validResponses = responses
                .filter((result): result is PromiseFulfilledResult<AIAnalysisResponse> =>
                    result.status === 'fulfilled' && !result.value.error
                )
                .map(result => result.value)

            if (validResponses.length === 0) {
                throw new Error('All AI providers failed to analyze content')
            }

            this.logger.log(`Successfully analyzed with ${validResponses.length}/${healthyProviders.length} providers`)

            // Consolidate the responses
            const consolidated = this.buildConsensus(validResponses)
            const responseTime = Date.now() - startTime

            return {
                consensus: consolidated,
                providerInsights: this.buildProviderInsights(validResponses),
                confidence: this.calculateConfidence(validResponses),
                conflicts: this.identifyConflicts(validResponses),
            }
        } catch (error) {
            this.logger.error('AI consolidation failed:', error.message)
            throw error
        }
    }

    private async filterHealthyProviders(providers: AIProvider[]): Promise<AIProvider[]> {
        const healthChecks = await Promise.allSettled(
            providers.map(async provider => ({
                provider,
                healthy: await provider.isHealthy()
            }))
        )

        return healthChecks
            .filter((result): result is PromiseFulfilledResult<{ provider: AIProvider; healthy: boolean }> =>
                result.status === 'fulfilled'
            )
            .filter(result => result.value.healthy)
            .map(result => result.value.provider)
    }

    private async analyzeWithProvider(
        provider: AIProvider,
        request: AIAnalysisRequest
    ): Promise<AIAnalysisResponse> {
        try {
            return await provider.analyze(request)
        } catch (error) {
            this.logger.error(`Provider ${provider.name} analysis failed:`, error.message)
            throw error
        }
    }

    private buildConsensus(responses: AIAnalysisResponse[]): AIConsolidatedResponse['consensus'] {
        // Calculate weighted average score based on provider reliability
        const totalScore = responses.reduce((sum, response) => sum + response.analysis.score, 0)
        const averageScore = Math.round(totalScore / responses.length)

        // Combine insights from all providers
        const allInsights = responses.flatMap(r => r.analysis.insights)
        const uniqueInsights = [...new Set(allInsights)]
        const topInsights = this.selectTopItems(uniqueInsights, 5)

        // Combine recommendations
        const allRecommendations = responses.flatMap(r => r.analysis.recommendations)
        const uniqueRecommendations = [...new Set(allRecommendations)]
        const topRecommendations = this.selectTopItems(uniqueRecommendations, 5)

        // Select best optimization (highest score provider)
        const bestResponse = responses.reduce((best, current) =>
            current.analysis.score > best.analysis.score ? current : best
        )

        // Combine hashtags
        const allHashtags = responses.flatMap(r => r.analysis.hashtags)
        const uniqueHashtags = [...new Set(allHashtags)]
        const topHashtags = this.selectTopItems(uniqueHashtags, 5)

        // Combine engagement tips
        const allEngagement = responses.flatMap(r => r.analysis.engagement)
        const uniqueEngagement = [...new Set(allEngagement)]
        const topEngagement = this.selectTopItems(uniqueEngagement, 3)

        return {
            score: averageScore,
            insights: topInsights,
            recommendations: topRecommendations,
            optimization: bestResponse.analysis.optimization,
            hashtags: topHashtags,
            engagement: topEngagement,
        }
    }

    private selectTopItems(items: string[], maxCount: number): string[] {
        // Simple selection - could be enhanced with AI ranking later
        return items.slice(0, maxCount)
    }

    private buildProviderInsights(responses: AIAnalysisResponse[]): AIConsolidatedResponse['providerInsights'] {
        const insights: { [provider: string]: AIAnalysisResponse } = {}

        responses.forEach(response => {
            insights[response.provider] = response
        })

        return insights
    }

    private calculateConfidence(responses: AIAnalysisResponse[]): number {
        if (responses.length === 1) return 0.7 // Single provider = moderate confidence

        // Calculate confidence based on agreement between providers
        const scores = responses.map(r => r.analysis.score)
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

        // Higher confidence if scores are similar (low variance)
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length
        const standardDeviation = Math.sqrt(variance)

        // Confidence decreases with higher standard deviation
        const baseConfidence = 0.8
        const variancePenalty = Math.min(standardDeviation / 20, 0.3) // Max 30% penalty

        return Math.max(0.3, baseConfidence - variancePenalty)
    }

    private identifyConflicts(responses: AIAnalysisResponse[]): string[] {
        const conflicts: string[] = []

        if (responses.length < 2) return conflicts

        // Check for significant score differences
        const scores = responses.map(r => r.analysis.score)
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

        responses.forEach(response => {
            const scoreDiff = Math.abs(response.analysis.score - averageScore)
            if (scoreDiff > 20) { // More than 20 points difference
                conflicts.push(`${response.provider} score (${response.analysis.score}) differs significantly from average (${Math.round(averageScore)})`)
            }
        })

        // Check for conflicting recommendations
        const allRecommendations = responses.flatMap(r => r.analysis.recommendations)
        const recommendationCounts = allRecommendations.reduce((counts, rec) => {
            counts[rec] = (counts[rec] || 0) + 1
            return counts
        }, {} as { [key: string]: number })

        // Identify recommendations that only one provider suggests
        Object.entries(recommendationCounts).forEach(([rec, count]) => {
            if (count === 1 && responses.length > 2) {
                conflicts.push(`Conflicting recommendation: "${rec}" only suggested by one provider`)
            }
        })

        return conflicts
    }
}
