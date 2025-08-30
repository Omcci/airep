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

        // Security check
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
        visualImpact: GEOGraph // Visual representation of improvements
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
        citationGraph: GEOGraph // Visual representation of citation network
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

        return {
            citationAnalysis: {
                likelihood: this.normalizeScore(metrics.citationLikelihood),
                quotableElements: result.quotableElements || [],
                citationContexts: result.citationContexts || []
            },
            knowledgeSynthesis: {
                integrationScore: this.normalizeScore(metrics.knowledgeIntegration),
                uniqueValue: result.uniqueValue || [],
                topicConnections: result.topicConnections || []
            },
            authorityEvaluation: {
                credibilityScore: this.normalizeScore(metrics.authorityScore),
                expertiseSignals: result.expertiseSignals || [],
                trustFactors: result.trustFactors || []
            },
            geoRecommendations: {
                contentOptimization: result.recommendations || [],
                authorityEnhancement: result.authorityEnhancement || [],
                citationImprovement: result.citationImprovement || []
            },
            aiPerceptionMetrics: {
                citationLikelihood: this.normalizeScore(metrics.citationLikelihood),
                knowledgeIntegration: this.normalizeScore(metrics.knowledgeIntegration),
                authorityScore: this.normalizeScore(metrics.authorityScore),
                uniquenessValue: this.normalizeScore(metrics.uniquenessValue),
                referenceQuality: this.normalizeScore(metrics.referenceQuality)
            },
            overallAssessment: {
                strengths: result.strengths || [],
                improvements: result.improvements || [],
                potentialImpact: result.potentialImpact || 'moderate'
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
                authority: analysis.aiPerception?.authorityScore || 50,
                relevance: analysis.aiPerception?.citationLikelihood || 50,
                freshness: analysis.aiPerception?.contentFreshness || 50
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

    private normalizeScore(score: number): number {
        if (typeof score !== 'number') return 50
        return Math.max(0, Math.min(100, Math.round(score)))
    }
}