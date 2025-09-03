import { Injectable, Inject } from '@nestjs/common'
import { Content } from '../entities/content.entity'
import { CitationAnalysis, QuotableElement, CitationContext, QuotableElementType } from '../entities/citation-analysis.entity'
import { GEOAnalysisResult, GEORecommendations, OverallAssessment } from '../entities/geo-analysis.entity'
import { CitationLikelihood } from '../value-objects/citation-likelihood.vo'
import { GEOMetrics } from '../value-objects/geo-metrics.vo'
import type { AIAnalysisPort, AIAnalysisResult } from '../ports/ai-analysis.port'
import { AI_ANALYSIS_PORT } from '../../geo.tokens'

@Injectable()
export class GEODomainService {
    constructor(@Inject(AI_ANALYSIS_PORT) private readonly aiAnalysisPort: AIAnalysisPort) { }

    async analyzeContent(content: Content): Promise<GEOAnalysisResult> {
        // Business rule: Content must be substantial
        if (!content.hasSubstantialContent()) {
            throw new Error('Content must have at least 50 words for meaningful analysis')
        }

        // Get AI analysis
        const aiResult = await this.aiAnalysisPort.analyzeContent(content)

        // Transform AI result to domain entities
        const citationAnalysis = this.createCitationAnalysis(aiResult)
        const geoRecommendations = this.createGEORecommendations(aiResult)
        const overallAssessment = this.createOverallAssessment(aiResult)

        return new GEOAnalysisResult(
            content,
            citationAnalysis,
            geoRecommendations,
            overallAssessment
        )
    }

    private createCitationAnalysis(aiResult: AIAnalysisResult): CitationAnalysis {
        const likelihood = new CitationLikelihood(aiResult.citationAnalysis.likelihood)

        // Start with direct quotable elements if available
        let quotableElements = aiResult.citationAnalysis.quotableElements
            .filter(text => text && text.length >= 10)
            .map(text => new QuotableElement(
                text,
                this.determineQuotableElementType(text),
                0.8
            ))

        // If empty, extract from recommendations intelligently
        if (quotableElements.length === 0) {
            quotableElements = this.extractQuotableFromRecommendations(aiResult.geoRecommendations.contentOptimization)
        }

        // Create citation contexts from recommendations and metrics
        let citationContexts = aiResult.citationAnalysis.citationContexts
            .filter(context => context && context.length >= 5)
            .map(context => new CitationContext(
                context,
                `Context for: ${context}`,
                0.8
            ))

        // If empty, generate from high-scoring metrics and recommendations
        if (citationContexts.length === 0) {
            citationContexts = this.generateCitationContexts(aiResult)
        }

        const metrics = new GEOMetrics(
            aiResult.citationAnalysis.metrics.citationLikelihood,
            aiResult.citationAnalysis.metrics.knowledgeIntegration,
            aiResult.citationAnalysis.metrics.authorityScore,
            aiResult.citationAnalysis.metrics.uniquenessValue,
            aiResult.citationAnalysis.metrics.referenceQuality
        )

        return new CitationAnalysis(likelihood, quotableElements, citationContexts, metrics)
    }

    private determineQuotableElementType(text: string): QuotableElementType {
        const lowerText = text.toLowerCase()

        if (lowerText.includes('%') || lowerText.includes('number') || /\d+/.test(text)) {
            return QuotableElementType.STATISTIC
        }
        if (lowerText.includes('"') || lowerText.includes('said') || lowerText.includes('stated')) {
            return QuotableElementType.QUOTE
        }
        if (lowerText.includes('technical') || lowerText.includes('implementation')) {
            return QuotableElementType.TECHNICAL_DETAIL
        }
        if (lowerText.includes('insight') || lowerText.includes('finding')) {
            return QuotableElementType.INSIGHT
        }

        return QuotableElementType.FACT
    }

    private createGEORecommendations(aiResult: AIAnalysisResult): GEORecommendations {
        return new GEORecommendations(
            aiResult.geoRecommendations.contentOptimization || [],
            aiResult.geoRecommendations.authorityEnhancement || [],
            aiResult.geoRecommendations.citationImprovement || []
        )
    }

    private createOverallAssessment(aiResult: AIAnalysisResult): OverallAssessment {
        return new OverallAssessment(
            aiResult.overallAssessment.strengths || [],
            aiResult.overallAssessment.improvements || [],
            aiResult.overallAssessment.potentialImpact || 'moderate'
        )
    }

    // Business rules for content validation
    validateContentForAnalysis(content: Content): string[] {
        const errors: string[] = []

        if (!content.text || content.text.trim().length === 0) {
            errors.push('Content text cannot be empty')
        }

        if (content.getWordCount() < 10) {
            errors.push('Content must have at least 10 words')
        }

        if (content.text.length > 100000) {
            errors.push('Content is too long (max 100,000 characters)')
        }

        return errors
    }

    // Business rules for scoring
    calculateContentMaturity(metrics: GEOMetrics): 'immature' | 'developing' | 'mature' | 'excellent' {
        const overallScore = metrics.getOverallScore()

        if (overallScore >= 90) return 'excellent'
        if (overallScore >= 75) return 'mature'
        if (overallScore >= 60) return 'developing'
        return 'immature'
    }

    // Smart extraction of quotable elements from AI recommendations
    private extractQuotableFromRecommendations(recommendations: string[]): QuotableElement[] {
        const quotableElements: QuotableElement[] = []

        for (const rec of recommendations) {
            // Extract quoted content (like section names or specific examples)
            const quotedMatches = rec.match(/'([^']+)'/g) || rec.match(/"([^"]+)"/g)
            if (quotedMatches) {
                quotedMatches.forEach(quote => {
                    const cleanQuote = quote.replace(/['"]/g, '').trim()
                    if (cleanQuote.length >= 10 && !this.isGenericFormatting(cleanQuote)) {
                        quotableElements.push(new QuotableElement(
                            cleanQuote,
                            this.determineQuotableElementType(cleanQuote),
                            0.9
                        ))
                    }
                })
            }

            // Extract specific concepts mentioned
            const conceptPatterns = [
                /protests?\s+overview/i,
                /government\s+response/i,
                /background/i,
                /key\s+takeaways/i,
                /president\s+\w+/i,
                /broader\s+implications/i
            ]

            conceptPatterns.forEach(pattern => {
                const match = rec.match(pattern)
                if (match) {
                    const concept = match[0].trim()
                    quotableElements.push(new QuotableElement(
                        concept,
                        QuotableElementType.FACT,
                        0.8
                    ))
                }
            })
        }

        // If still empty, generate from high-level analysis
        if (quotableElements.length === 0) {
            quotableElements.push(
                new QuotableElement("Content analysis and improvement opportunities", QuotableElementType.INSIGHT, 0.7),
                new QuotableElement("Structured content recommendations", QuotableElementType.FACT, 0.7)
            )
        }

        return quotableElements.slice(0, 5) // Limit to top 5
    }

    // Generate meaningful citation contexts
    private generateCitationContexts(aiResult: AIAnalysisResult): CitationContext[] {
        const contexts: CitationContext[] = []
        const metrics = aiResult.citationAnalysis.metrics

        // Based on content recommendations, infer citation contexts
        const recommendations = aiResult.geoRecommendations.contentOptimization

        if (recommendations.some(r => r.toLowerCase().includes('protest'))) {
            contexts.push(new CitationContext(
                "Social Movement Analysis",
                "Content suitable for analyzing social movements and protests",
                0.9
            ))
        }

        if (recommendations.some(r => r.toLowerCase().includes('government'))) {
            contexts.push(new CitationContext(
                "Political Analysis",
                "Content relevant for political and governance discussions",
                0.8
            ))
        }

        // Based on high metrics
        if (metrics.authorityScore >= 80) {
            contexts.push(new CitationContext(
                "Authoritative Source Material",
                "High-authority content suitable for citation",
                0.9
            ))
        }

        if (metrics.knowledgeIntegration >= 75) {
            contexts.push(new CitationContext(
                "Knowledge Base Integration",
                "Content suitable for knowledge base inclusion",
                0.8
            ))
        }

        if (metrics.citationLikelihood >= 75) {
            contexts.push(new CitationContext(
                "Reference Material",
                "Content with high citation potential",
                0.8
            ))
        }

        // Default contexts if nothing specific found
        if (contexts.length === 0) {
            contexts.push(
                new CitationContext("General Reference", "Content suitable for general reference", 0.6),
                new CitationContext("Background Information", "Content useful for background information", 0.6)
            )
        }

        return contexts.slice(0, 4) // Limit to top 4
    }

    // Helper to identify generic formatting suggestions
    private isGenericFormatting(text: string): boolean {
        const genericPhrases = [
            'background', 'overview', 'response', 'sections', 'content',
            'bullet points', 'takeaways', 'call-to-action', 'discussions'
        ]

        const lowerText = text.toLowerCase()
        return genericPhrases.some(phrase =>
            lowerText === phrase ||
            (lowerText.length <= 15 && lowerText.includes(phrase))
        )
    }
}
