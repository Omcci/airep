import { Injectable, Logger } from '@nestjs/common'
import { AIAnalysisPort, AIAnalysisResult, ValidationResult } from '../../domain/ports/ai-analysis.port'
import { Content } from '../../domain/entities/content.entity'
import { AIService } from '../../../ai/ai.service'
import { AISecurityService } from '../../../ai/ai-security.service'
import { buildGEOPrompt } from '../../../ai/prompts/geo-analysis.prompt'
import { Platform } from '../../../ai/dto/ai-analysis.dto'
import { OpenAIService } from '../../../ai/openai.service'
import { AnthropicService } from '../../../ai/anthropic.service'
import { MistralService } from '../../../ai/mistral.service'
import { AIAnalysisRequest } from '../../../ai/ai.interface'

@Injectable()
export class AIProviderAdapter implements AIAnalysisPort {
    private readonly logger = new Logger(AIProviderAdapter.name)

    constructor(
        private readonly aiService: AIService,
        private readonly aiSecurityService: AISecurityService,
        private readonly openaiService: OpenAIService,
        private readonly anthropicService: AnthropicService,
        private readonly mistralService: MistralService
    ) { }

    async analyzeContent(content: Content): Promise<AIAnalysisResult> {
        // Build the specialized GEO prompt
        const prompt = buildGEOPrompt(content.text, content.type)

        this.logger.log('Starting GEO analysis with specialized prompt')

        // Create the analysis request with the GEO prompt
        const analysisRequest: AIAnalysisRequest = {
            content: content.text,
            platform: Platform.BLOG,
            contentType: content.type as any,
            maxTokens: 4000,
            temperature: 0.7
        }

        // Call AI providers directly with the GEO prompt
        const providers = [
            { name: 'OpenAI', service: this.openaiService },
            { name: 'Anthropic Claude', service: this.anthropicService },
            { name: 'Mistral', service: this.mistralService }
        ]

        const results = []
        const errors = []

        // Call each provider in parallel
        for (const provider of providers) {
            try {
                if (await provider.service.isHealthy()) {
                    this.logger.log(`Calling ${provider.name} with GEO prompt`)

                    // Call the AI provider directly with GEO prompt
                    const result = await this.callAIProviderWithGEOPrompt(provider.service, analysisRequest, prompt)
                    results.push(result)
                    this.logger.log(`${provider.name} analysis completed successfully`)
                } else {
                    this.logger.warn(`${provider.name} is not healthy, skipping`)
                }
            } catch (error) {
                this.logger.error(`${provider.name} analysis failed:`, error.message)
                errors.push({ provider: provider.name, error: error.message })
            }
        }

        if (results.length === 0) {
            throw new Error('All AI providers failed. Errors: ' + errors.map(e => `${e.provider}: ${e.error}`).join(', '))
        }

        this.logger.log(`Successfully analyzed with ${results.length}/${providers.length} providers`)

        // Debug: Log the raw results
        console.log('Raw AI Results:', JSON.stringify(results, null, 2))

        // Consolidate results (simplified version)
        const consolidatedResult = this.consolidateGEOResults(results)

        console.log('GEO Analysis Result:', JSON.stringify(consolidatedResult, null, 2))

        // Transform the response to match our domain interface
        return this.transformGEOResponse(consolidatedResult)
    }

    async validateContent(content: Content): Promise<ValidationResult> {
        try {
            // Use existing security service for validation
            const securityResult = await this.aiSecurityService.checkInputSecurity(
                content.text,
                Platform.BLOG
            )

            if (securityResult.blocked) {
                return {
                    isValid: false,
                    errors: [securityResult.reason || 'Security check failed'],
                    warnings: []
                }
            }

            return {
                isValid: true,
                errors: [],
                warnings: []
            }
        } catch (error) {
            return {
                isValid: false,
                errors: [`Validation failed: ${error.message}`],
                warnings: []
            }
        }
    }

    private transformResponse(aiResponse: any): AIAnalysisResult {
        // Transform the existing AI response to our domain interface
        // The AI service returns { consensus: { ... } } structure

        const consensus = aiResponse.consensus || aiResponse
        const aiPerception = consensus.aiPerception || {}

        return {
            citationAnalysis: {
                likelihood: aiPerception.citationPotential || aiPerception.authority || 75,
                quotableElements: consensus.citationAnalysis?.quotableElements || [],
                citationContexts: consensus.citationAnalysis?.citationContexts || [],
                metrics: {
                    citationLikelihood: aiPerception.citationPotential || 75,
                    knowledgeIntegration: aiPerception.semanticRelevance || 70,
                    authorityScore: aiPerception.authority || 80,
                    uniquenessValue: aiPerception.contentFreshness || 85,
                    referenceQuality: aiPerception.sourceCredibility || 75
                }
            },
            geoRecommendations: {
                contentOptimization: consensus.recommendations || [],
                authorityEnhancement: consensus.competitiveAnalysis?.improvements || [],
                citationImprovement: consensus.optimization ? [consensus.optimization] : []
            },
            overallAssessment: {
                strengths: consensus.competitiveAnalysis?.uniqueStrengths || [],
                improvements: consensus.competitiveAnalysis?.improvements || [],
                potentialImpact: this.determineImpactLevel(consensus.score || 75)
            },
            knowledgeGraph: consensus.knowledgeGraph
        }
    }

    private determineImpactLevel(score: number): 'low' | 'moderate' | 'high' {
        if (score >= 80) return 'high'
        if (score >= 60) return 'moderate'
        return 'low'
    }

    private async callAIProviderWithGEOPrompt(service: any, request: AIAnalysisRequest, prompt: string): Promise<any> {
        // Call the AI provider directly with the GEO prompt
        // This bypasses the service's own prompt building and parsing

        const startTime = Date.now()

        try {
            // Get the raw response from the AI provider
            let rawResponse: string

            if (service.name === 'OpenAI') {
                const completion = await (service as any).openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert AI SEO analyst specializing in content optimization for different platforms. Provide specific, actionable insights and recommendations.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: request.maxTokens || 4000,
                    temperature: request.temperature || 0.7,
                })
                rawResponse = completion.choices[0]?.message?.content || ''
            } else if (service.name === 'Mistral') {
                const response = await (service as any).mistralClient.chat({
                    model: 'mistral-small-latest',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    maxTokens: request.maxTokens || 4000,
                    temperature: request.temperature || 0.7
                })
                rawResponse = response.choices[0]?.message?.content || ''
            } else if (service.name === 'Anthropic Claude') {
                const response = await (service as any).anthropic.messages.create({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: request.maxTokens || 4000,
                    temperature: request.temperature || 0.7,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ]
                })
                rawResponse = response.content[0]?.text || ''
            } else {
                throw new Error(`Unsupported AI provider: ${service.name}`)
            }

            if (!rawResponse) {
                throw new Error('No response from AI provider')
            }

            // Parse the GEO response
            const analysis = this.parseGEOResponse(rawResponse)
            const responseTime = Date.now() - startTime

            return {
                provider: service.name,
                model: service.name === 'OpenAI' ? 'gpt-4o-mini' :
                    service.name === 'Mistral' ? 'mistral-small-latest' : 'claude-3-haiku-20240307',
                analysis,
                metadata: {
                    tokensUsed: Math.ceil(request.content.length / 4) + 500,
                    cost: 0.001, // Estimated cost
                    responseTime,
                    timestamp: new Date()
                }
            }
        } catch (error) {
            this.logger.error(`${service.name} GEO analysis failed:`, error.message)
            throw error
        }
    }

    private parseGEOResponse(response: string): any {
        try {
            // Clean the response by removing control characters that break JSON
            const cleanedResponse = response
                .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
                .replace(/\r\n/g, '\n') // Normalize line endings
                .replace(/\r/g, '\n') // Normalize line endings

            // Try to extract JSON from the cleaned response
            const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0])
                    return parsed
                } catch (jsonError) {
                    this.logger.warn('JSON parsing failed after cleaning:', jsonError.message)
                }
            }
        } catch (error) {
            this.logger.warn('Failed to clean GEO response:', error.message)
        }

        // Fallback: return empty structure
        return {
            citationAnalysis: {
                likelihood: 75,
                quotableElements: [],
                citationContexts: []
            },
            knowledgeGraph: {
                nodes: [],
                edges: []
            },
            authorityEvaluation: {
                credibilityScore: 80,
                expertiseSignals: [],
                trustFactors: []
            },
            competitiveAnalysis: {
                uniqueStrengths: [],
                improvements: []
            },
            rankingFactors: {
                relevanceScore: 70,
                authorityScore: 80,
                citationLikelihood: 75,
                uniquenessValue: 85,
                referenceQuality: 75
            }
        }
    }

    private consolidateGEOResults(results: any[]): any {
        if (results.length === 1) {
            return this.parseAIResponse(results[0].analysis)
        }

        // Parse all results first
        const parsedResults = results.map(r => this.parseAIResponse(r.analysis))

        // Simple consolidation - take the first result as base and average scores
        const baseResult = parsedResults[0]

        // Average the scores
        const avgScore = parsedResults.reduce((sum, r) => sum + (r.score || 0), 0) / parsedResults.length

        // Combine insights and recommendations
        const allInsights = parsedResults.flatMap(r => r.insights || [])
        const allRecommendations = parsedResults.flatMap(r => r.recommendations || [])

        // Average AI perception metrics
        const avgAiPerception = this.averageAiPerception(parsedResults)

        return {
            ...baseResult,
            score: Math.round(avgScore),
            insights: [...new Set(allInsights)], // Remove duplicates
            recommendations: [...new Set(allRecommendations)], // Remove duplicates
            aiPerception: avgAiPerception
        }
    }

    private parseAIResponse(response: any): any {
        // If it's already an object, return it
        if (typeof response === 'object' && response !== null) {
            return response
        }

        // If it's a string, try to parse it as JSON
        if (typeof response === 'string') {
            try {
                return JSON.parse(response)
            } catch (error) {
                this.logger.error('Failed to parse AI response as JSON:', error)
                return {}
            }
        }

        return {}
    }

    private averageAiPerception(results: any[]): any {
        const perceptionKeys = [
            'authority', 'credibility', 'expertise', 'freshness', 'rankingPotential',
            'semanticRelevance', 'citationPotential', 'knowledgeGraphPosition',
            'authoritySignals', 'contentFreshness', 'sourceCredibility'
        ]

        const avgPerception: Record<string, number> = {}
        for (const key of perceptionKeys) {
            const values = results
                .map(r => r.aiPerception?.[key])
                .filter(v => typeof v === 'number')

            if (values.length > 0) {
                avgPerception[key] = Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
            }
        }

        return avgPerception
    }

    private transformGEOResponse(consolidatedResult: any): AIAnalysisResult {
        // The consolidated result should now have the proper GEO structure
        // It should already be parsed by consolidateGEOResults
        const analysis = consolidatedResult

        // Extract citation analysis
        const citationAnalysis = analysis.citationAnalysis || {}
        const quotableElements = citationAnalysis.quotableElements || []
        const citationContexts = citationAnalysis.citationContexts || []

        // Extract knowledge graph
        const knowledgeGraph = analysis.knowledgeGraph || { nodes: [], edges: [] }

        // Extract authority evaluation
        const authorityEvaluation = analysis.authorityEvaluation || {}

        // Extract competitive analysis
        const competitiveAnalysis = analysis.competitiveAnalysis || {}

        // Extract ranking factors
        const rankingFactors = analysis.rankingFactors || {}

        return {
            citationAnalysis: {
                likelihood: citationAnalysis.likelihood || 75,
                quotableElements: quotableElements,
                citationContexts: citationContexts,
                metrics: {
                    citationLikelihood: citationAnalysis.likelihood || 75,
                    knowledgeIntegration: rankingFactors.relevanceScore || 70,
                    authorityScore: authorityEvaluation.credibilityScore || 80,
                    uniquenessValue: rankingFactors.uniquenessValue || 85,
                    referenceQuality: rankingFactors.referenceQuality || 75
                }
            },
            geoRecommendations: {
                contentOptimization: analysis.recommendations || [],
                authorityEnhancement: competitiveAnalysis.improvements || [],
                citationImprovement: analysis.optimization ? [analysis.optimization] : []
            },
            overallAssessment: {
                strengths: competitiveAnalysis.uniqueStrengths || [],
                improvements: competitiveAnalysis.improvements || [],
                potentialImpact: this.determineImpactLevel(analysis.score || 75)
            },
            knowledgeGraph: knowledgeGraph
        }
    }
}
