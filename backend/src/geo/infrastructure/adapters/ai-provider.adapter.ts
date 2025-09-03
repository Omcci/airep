import { Injectable } from '@nestjs/common'
import { AIAnalysisPort, AIAnalysisResult, ValidationResult } from '../../domain/ports/ai-analysis.port'
import { Content } from '../../domain/entities/content.entity'
import { AIService } from '../../../ai/ai.service'
import { AISecurityService } from '../../../ai/ai-security.service'
import { buildGEOPrompt } from '../../../ai/prompts/geo-analysis.prompt'
import { Platform } from '../../../ai/dto/ai-analysis.dto'

@Injectable()
export class AIProviderAdapter implements AIAnalysisPort {
    constructor(
        private readonly aiService: AIService,
        private readonly aiSecurityService: AISecurityService
    ) { }

    async analyzeContent(content: Content): Promise<AIAnalysisResult> {
        // Build the specialized GEO prompt
        const prompt = buildGEOPrompt(content.text, content.type)

        // Use the existing AI service to get multi-provider analysis
        const aiResponse = await this.aiService.analyzeContent({
            content: content.text,
            platform: Platform.BLOG, // Valid platform value
            contentType: content.type as any,
            validatedContent: content.text
        })

        console.log('AI Response from service:', JSON.stringify(aiResponse, null, 2))

        // Transform the response to match our domain interface
        return this.transformResponse(aiResponse)
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
}
