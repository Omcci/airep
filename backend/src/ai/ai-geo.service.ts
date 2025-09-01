import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { AIService } from './ai.service'
import { AISecurityService } from './ai-security.service'
import { buildGEOPrompt } from './prompts/geo-analysis.prompt'
import { Platform, ContentType } from './dto/ai-analysis.dto'

export interface GEONode {
    id: string
    label: string
    type: 'concept' | 'topic' | 'reference' | 'content'
    score: number
    metrics: {
        authority: number
        relevance: number
        freshness: number
    }
}

export interface GEOEdge {
    source: string
    target: string
    type: 'references' | 'relates_to' | 'cites' | 'influences'
    strength: number
}

export interface GEOGraph {
    nodes: GEONode[]
    edges: GEOEdge[]
}

export interface GEOAnalysis {
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
    aiPerceptionMetrics: {
        citationLikelihood: number
        knowledgeIntegration: number
        authorityScore: number
        uniquenessValue: number
        referenceQuality: number
    }
    overallAssessment: {
        strengths: string[]
        improvements: string[]
        potentialImpact: string
    }
    knowledgeGraph: GEOGraph
}

@Injectable()
export class AIGEOService {
    private readonly logger = new Logger(AIGEOService.name)

    constructor(
        private readonly aiService: AIService,
        private readonly aiSecurityService: AISecurityService
    ) { }

    /**
     * Analyze content for Generative Engine Optimization (GEO)
     */
    async analyzeGEO(content: string, contentType: string): Promise<GEOAnalysis> {
        this.logger.log(`Starting GEO analysis for ${contentType}`)

        // Basic content validation
        const securityResult = await this.aiSecurityService.checkInputSecurity(content, Platform.BLOG)
        if (securityResult.blocked) {
            throw new BadRequestException(`Content blocked: ${securityResult.reason}`)
        }

        // Build specialized prompt for GEO analysis
        const prompt = buildGEOPrompt(content, contentType)

        try {
            // Get analysis from multiple AI providers
            const result = await this.aiService.analyzeContent({
                content,
                platform: Platform.BLOG,
                contentType: ContentType.CONTENT,
                tone: undefined, // No specific tone for GEO analysis
                validatedContent: content // Already validated by our DTO
            }, 'geo-analysis') // Use a specific user ID for GEO analysis

            // Extract and validate GEO metrics
            const geoAnalysis = this.validateAndNormalizeGEOMetrics(result.consensus)

            // Generate knowledge graph
            const graph = await this.generateKnowledgeGraph(content, contentType, result.consensus)

            this.logger.log(`GEO analysis completed with citation likelihood: ${geoAnalysis.citationAnalysis.likelihood}`)

            return {
                ...geoAnalysis,
                knowledgeGraph: graph
            }
        } catch (error) {
            this.logger.error(`GEO analysis failed: ${error.message}`)
            throw new BadRequestException('Failed to analyze content for GEO')
        }
    }

    /**
     * Get specific recommendations for improving AI visibility
     */
    async getGEORecommendations(content: string, contentType: string): Promise<{
        improvements: string[]
        priority: 'high' | 'medium' | 'low'
        estimatedImpact: number
        visualImpact: GEOGraph
    }> {
        const analysis = await this.analyzeGEO(content, contentType)

        // Calculate priority based on potential impact
        const currentScore = (
            analysis.aiPerceptionMetrics.citationLikelihood +
            analysis.aiPerceptionMetrics.knowledgeIntegration +
            analysis.aiPerceptionMetrics.authorityScore
        ) / 3

        const priority = currentScore < 60 ? 'high' : currentScore < 80 ? 'medium' : 'low'

        // Estimate potential improvement impact
        const potentialScore = Math.min(100, currentScore + 20)
        const estimatedImpact = potentialScore - currentScore

        // Generate improvement visualization
        const visualImpact = this.generateImprovementGraph(analysis.knowledgeGraph, analysis.geoRecommendations)

        return {
            improvements: analysis.geoRecommendations.contentOptimization,
            priority,
            estimatedImpact,
            visualImpact
        }
    }

    /**
     * Analyze citation potential in specific contexts
     */
    async analyzeCitationPotential(content: string, contentType: string): Promise<{
        contexts: string[]
        likelihood: number
        competitorComparison: 'better' | 'similar' | 'worse'
        citationGraph: GEOGraph
    }> {
        const analysis = await this.analyzeGEO(content, contentType)

        // Determine competitive position
        const competitorComparison =
            analysis.aiPerceptionMetrics.citationLikelihood > 80 ? 'better' :
                analysis.aiPerceptionMetrics.citationLikelihood > 60 ? 'similar' : 'worse'

        // Generate citation network visualization
        const citationGraph = this.generateCitationGraph(analysis.knowledgeGraph, analysis.citationAnalysis)

        return {
            contexts: analysis.citationAnalysis.citationContexts,
            likelihood: analysis.citationAnalysis.likelihood,
            competitorComparison,
            citationGraph
        }
    }

    private validateAndNormalizeGEOMetrics(result: any): Omit<GEOAnalysis, 'knowledgeGraph'> {
        const metrics = result.aiPerception || {}
        const citationAnalysis = result.citationAnalysis || {}
        const rankingFactors = result.rankingFactors || {}
        const competitiveAnalysis = result.competitiveAnalysis || {}

        // Extract quotable elements from the content
        const quotableElements = this.extractQuotableElements(result)

        return {
            citationAnalysis: {
                likelihood: this.normalizeScore(citationAnalysis.likelihood || metrics.citationLikelihood || 75),
                quotableElements: this.extractQuotableElements(result),
                citationContexts: this.extractCitationContexts(result),
                metrics: {
                    citationLikelihood: this.normalizeScore(citationAnalysis.likelihood || 85),
                    knowledgeIntegration: this.normalizeScore(metrics.knowledgeIntegration || 80),
                    authorityScore: this.normalizeScore(metrics.authorityScore || 85),
                    uniquenessValue: this.normalizeScore(metrics.uniquenessValue || 80),
                    referenceQuality: this.normalizeScore(metrics.referenceQuality || 85)
                }
            },
            knowledgeSynthesis: {
                integrationScore: this.normalizeScore(rankingFactors.solutionCompleteness || metrics.knowledgeIntegration || 70),
                uniqueValue: competitiveAnalysis.uniqueStrengths || [],
                topicConnections: this.extractTopicConnections(result)
            },
            authorityEvaluation: {
                credibilityScore: this.normalizeScore(rankingFactors.technicalDepth || metrics.authorityScore || 80),
                expertiseSignals: result.authorityEvaluation?.expertiseSignals || [],
                trustFactors: result.authorityEvaluation?.trustFactors || []
            },
            geoRecommendations: {
                contentOptimization: result.recommendations || competitiveAnalysis.improvements || [],
                authorityEnhancement: this.generateAuthorityEnhancements(result),
                citationImprovement: this.generateCitationImprovements(result)
            },
            aiPerceptionMetrics: {
                citationLikelihood: this.normalizeScore(citationAnalysis.likelihood || metrics.citationLikelihood || 75),
                knowledgeIntegration: this.normalizeScore(rankingFactors.solutionCompleteness || metrics.knowledgeIntegration || 70),
                authorityScore: this.normalizeScore(rankingFactors.technicalDepth || metrics.authorityScore || 80),
                uniquenessValue: this.normalizeScore(rankingFactors.relevanceScore || metrics.uniquenessValue || 85),
                referenceQuality: this.normalizeScore(rankingFactors.implementationClarity || metrics.referenceQuality || 75)
            },
            overallAssessment: {
                strengths: competitiveAnalysis.uniqueStrengths || [],
                improvements: competitiveAnalysis.improvements || [],
                potentialImpact: this.determinePotentialImpact(result)
            }
        }
    }

    private async generateKnowledgeGraph(content: string, contentType: string, analysis: any): Promise<GEOGraph> {
        // Extract concepts and relationships from the content and analysis
        const nodes: GEONode[] = []
        const edges: GEOEdge[] = []

        // Add main content node
        nodes.push({
            id: 'content',
            label: 'Current Content',
            type: 'content',
            score: analysis.score || 50,
            metrics: {
                authority: this.normalizeScore(analysis.rankingFactors?.technicalDepth || analysis.aiPerception?.authorityScore || analysis.authorityEvaluation?.credibilityScore || 80),
                relevance: this.normalizeScore(analysis.rankingFactors?.relevanceScore || analysis.aiPerception?.citationLikelihood || analysis.citationAnalysis?.likelihood || 75),
                freshness: this.normalizeScore(analysis.rankingFactors?.contentFreshness || analysis.aiPerception?.contentFreshness || 90)
            }
        })

        // Add concept nodes from topic connections
        analysis.topicConnections?.forEach((topic: string, index: number) => {
            const nodeId = `topic_${index}`
            nodes.push({
                id: nodeId,
                label: topic,
                type: 'topic',
                score: 75, // Default score
                metrics: {
                    authority: 70,
                    relevance: 80,
                    freshness: 75
                }
            })
            edges.push({
                source: 'content',
                target: nodeId,
                type: 'relates_to',
                strength: 0.8
            })
        })

        // Add reference nodes from citations
        analysis.citationContexts?.forEach((context: string, index: number) => {
            const nodeId = `reference_${index}`
            nodes.push({
                id: nodeId,
                label: context,
                type: 'reference',
                score: 80,
                metrics: {
                    authority: 85,
                    relevance: 80,
                    freshness: 75
                }
            })
            edges.push({
                source: nodeId,
                target: 'content',
                type: 'cites',
                strength: 0.9
            })
        })

        return { nodes, edges }
    }

    private generateImprovementGraph(baseGraph: GEOGraph, recommendations: any): GEOGraph {
        // Clone base graph
        const nodes = [...baseGraph.nodes]
        const edges = [...baseGraph.edges]

        // Add improvement nodes
        recommendations.contentOptimization?.forEach((improvement: string, index: number) => {
            const nodeId = `improvement_${index}`
            nodes.push({
                id: nodeId,
                label: improvement,
                type: 'concept',
                score: 90,
                metrics: {
                    authority: 85,
                    relevance: 90,
                    freshness: 95
                }
            })
            edges.push({
                source: nodeId,
                target: 'content',
                type: 'influences',
                strength: 0.7
            })
        })

        return { nodes, edges }
    }

    private generateCitationGraph(baseGraph: GEOGraph, citationAnalysis: any): GEOGraph {
        // Clone base graph
        const nodes = [...baseGraph.nodes]
        const edges = [...baseGraph.edges]

        // Add citation opportunity nodes
        citationAnalysis.citationContexts?.forEach((context: string, index: number) => {
            const nodeId = `citation_${index}`
            nodes.push({
                id: nodeId,
                label: context,
                type: 'reference',
                score: 85,
                metrics: {
                    authority: 80,
                    relevance: 85,
                    freshness: 90
                }
            })
            edges.push({
                source: 'content',
                target: nodeId,
                type: 'cites',
                strength: 0.85
            })
        })

        return { nodes, edges }
    }

    private extractQuotableElements(result: any): string[] {
        const elements = []

        // Extract from citationAnalysis
        if (result.citationAnalysis?.quotableElements) {
            elements.push(...result.citationAnalysis.quotableElements)
        }

        // Extract direct quotes from content
        if (result.quotes) {
            elements.push(...result.quotes)
        }

        // Extract key facts and statistics
        if (result.keyFacts) {
            elements.push(...result.keyFacts)
        }

        // Extract official statements
        if (result.officialStatements) {
            elements.push(...result.officialStatements)
        }

        // Extract from authorityEvaluation
        if (result.authorityEvaluation?.implementationProof) {
            elements.push(...result.authorityEvaluation.implementationProof)
        }

        // Extract from competitiveAnalysis
        if (result.competitiveAnalysis?.differentiators) {
            elements.push(...result.competitiveAnalysis.differentiators)
        }

        // For news articles, extract key events
        if (result.events) {
            elements.push(...result.events.map((e: any) => e.description))
        }

        // Extract significant developments
        if (result.developments) {
            elements.push(...result.developments)
        }

        return elements.filter(Boolean)
    }

    private extractCitationContexts(result: any): string[] {
        const contexts = []

        // Extract from citationAnalysis
        if (result.citationAnalysis?.relevantQueries) {
            contexts.push(...result.citationAnalysis.relevantQueries.map((q: any) => q.citationContext))
        }

        // Extract from authorityEvaluation
        if (result.authorityEvaluation?.trustFactors) {
            contexts.push(...result.authorityEvaluation.trustFactors)
        }

        // For news articles, add specific citation contexts
        if (result.citationContexts) {
            contexts.push(...result.citationContexts)
        }

        // Add policy implications
        if (result.policyImplications) {
            contexts.push(...result.policyImplications.map((p: any) => `Policy discussion: ${p}`))
        }

        // Add social impact contexts
        if (result.socialImpact) {
            contexts.push(...result.socialImpact.map((s: any) => `Social impact analysis: ${s}`))
        }

        // Add historical documentation contexts
        if (result.historicalContext) {
            contexts.push(...result.historicalContext.map((h: any) => `Historical documentation: ${h}`))
        }

        // Add related events contexts
        if (result.relatedEvents) {
            contexts.push(...result.relatedEvents.map((e: any) => `Related event analysis: ${e}`))
        }

        return contexts.filter(Boolean)
    }

    private extractTopicConnections(result: any): string[] {
        const connections = []

        // Extract from knowledgeGraph
        if (result.knowledgeGraph?.nodes) {
            connections.push(...result.knowledgeGraph.nodes
                .filter((n: any) => n.type === 'topic')
                .map((n: any) => n.label))
        }

        // Extract from competitiveAnalysis
        if (result.competitiveAnalysis?.differentiators) {
            connections.push(...result.competitiveAnalysis.differentiators)
        }

        return connections.filter(Boolean)
    }

    private generateAuthorityEnhancements(result: any): string[] {
        const enhancements = []

        // Add from authorityEvaluation
        if (result.authorityEvaluation?.trustFactors) {
            enhancements.push(...result.authorityEvaluation.trustFactors.map((factor: string) =>
                `Strengthen ${factor.toLowerCase()} to enhance authority`))
        }

        // Add from rankingFactors
        if (result.rankingFactors?.technicalDepth < 80) {
            enhancements.push('Add more technical details and implementation examples')
        }

        return enhancements.filter(Boolean)
    }

    private generateCitationImprovements(result: any): string[] {
        const improvements = []

        // Add from citationAnalysis
        if (result.citationAnalysis?.relevantQueries) {
            improvements.push(...result.citationAnalysis.relevantQueries
                .filter((q: any) => q.relevance < 80)
                .map((q: any) => `Improve relevance for "${q.query}" queries`))
        }

        // Add from rankingFactors
        if (result.rankingFactors?.implementationClarity < 80) {
            improvements.push('Add more clear implementation examples')
        }

        return improvements.filter(Boolean)
    }

    private determinePotentialImpact(result: any): string {
        const baseScore = result.rankingFactors?.relevanceScore ||
            result.citationAnalysis?.likelihood ||
            result.aiPerception?.citationLikelihood ||
            75

        if (baseScore >= 85) return 'high'
        if (baseScore >= 70) return 'moderate'
        return 'low'
    }

    private normalizeScore(score: number): number {
        if (typeof score !== 'number') return 50
        return Math.max(0, Math.min(100, Math.round(score)))
    }
}