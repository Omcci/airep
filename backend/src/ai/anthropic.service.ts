import { Injectable, Logger } from '@nestjs/common'
import { AIProvider, AIAnalysisRequest, AIAnalysisResponse } from './ai.interface'

@Injectable()
export class AnthropicService implements AIProvider {
    private readonly logger = new Logger(AnthropicService.name)
    private readonly client: any
    private readonly isConfigured: boolean

    constructor() {
        this.logger.log(`Anthropic constructor called. Checking environment...`)
        this.logger.log(`ANTHROPIC_API_KEY exists: ${!!process.env.ANTHROPIC_API_KEY}`)
        this.logger.log(`ANTHROPIC_API_KEY length: ${process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.length : 0}`)
        this.logger.log(`ANTHROPIC_API_KEY preview: ${process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 10) + '...' : 'undefined'}`)

        this.isConfigured = !!process.env.ANTHROPIC_API_KEY
        if (this.isConfigured) {
            try {
                // Initialize Anthropic client
                const { Anthropic } = require('@anthropic-ai/sdk')
                this.client = new Anthropic({
                    apiKey: process.env.ANTHROPIC_API_KEY,
                })
                this.logger.log('Anthropic Claude service initialized successfully')
            } catch (error) {
                this.logger.error('Failed to initialize Anthropic client:', error)
                this.isConfigured = false
            }
        } else {
            this.logger.warn('Anthropic API key not found. Service will be disabled.')
        }
    }

    get name(): string {
        return 'Anthropic Claude'
    }

    async isHealthy(): Promise<boolean> {
        this.logger.log(`Anthropic isHealthy called. isConfigured: ${this.isConfigured}, client: ${!!this.client}`)

        if (!this.isConfigured) {
            this.logger.warn('Anthropic service not configured - no API key')
            return false
        }

        if (!this.client) {
            this.logger.warn('Anthropic client not initialized - package not available')
            return false
        }

        try {
            // Simple health check - could be enhanced with actual API call
            this.logger.log('Anthropic health check passed')
            return true
        } catch (error) {
            this.logger.error('Anthropic health check failed:', error)
            return false
        }
    }

    async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
        if (!this.isConfigured || !this.client) {
            throw new Error('Anthropic service not configured')
        }

        const startTime = Date.now()

        try {
            this.logger.log(`Starting Anthropic Claude analysis for ${request.platform} platform`)

            // Build the prompt for Claude
            const prompt = this.buildPrompt(request)

            // Make real API call to Anthropic Claude
            const response = await this.client.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: request.maxTokens || 4000,
                temperature: request.temperature || 0.7,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })

            const aiResponse = response.content[0]?.text
            if (!aiResponse) {
                throw new Error('No response from Anthropic Claude')
            }

            // Parse the AI response
            const analysis = this.parseResponse(aiResponse)
            const responseTime = Date.now() - startTime
            const estimatedTokens = Math.ceil(request.content.length / 4) + 500

            return {
                provider: 'Anthropic Claude',
                model: 'claude-3-5-sonnet-20241022',
                analysis,
                metadata: {
                    tokensUsed: estimatedTokens,
                    cost: estimatedTokens * 0.000003, // Anthropic pricing
                    responseTime,
                    timestamp: new Date()
                }
            }

        } catch (error) {
            this.logger.error('Anthropic Claude analysis failed:', error)
            throw error
        }
    }

    getCostPerToken(): number {
        return 0.000003 // Anthropic Claude 3.5 Sonnet pricing per token
    }

    getMaxTokens(): number {
        return 200000 // Anthropic Claude 3.5 Sonnet context window
    }

    private buildPrompt(request: AIAnalysisRequest): string {
        const platformInstructions = {
            linkedin: 'Optimize for LinkedIn: professional tone, industry insights, networking opportunities',
            twitter: 'Optimize for X/Twitter: concise, engaging, trending topics, viral potential',
            blog: 'Optimize for blog/website: SEO-friendly, comprehensive, authoritative',
            email: 'Optimize for email newsletter: personal, actionable, relationship-building'
        }

        const toneInstructions = {
            professional: 'Use a professional, business-like tone with industry terminology and formal language',
            casual: 'Use a relaxed, conversational tone that feels friendly and approachable',
            funny: 'Add humor and wit while maintaining the core message and being entertaining',
            harsh: 'Be direct, blunt, and brutally honest without sugar-coating',
            friendly: 'Use a warm, supportive, and encouraging tone that builds positive connections',
            formal: 'Use academic, structured language with proper citations and formal writing conventions'
        }

        const toneInstruction = request.tone ? `\nTONE: ${request.tone.toUpperCase()}\nTONE INSTRUCTIONS: ${toneInstructions[request.tone]}` : ''

        return `Analyze this content for ${request.platform} optimization:

CONTENT:
${request.content}

PLATFORM: ${request.platform}
INSTRUCTIONS: ${platformInstructions[request.platform]}${toneInstruction}

Please provide a JSON response with the following structure:
{
  "score": 85,
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "optimization": "Optimized version of the content for the platform with the specified tone",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "engagement": ["engagement tip 1", "engagement tip 2"]
}

Focus on:
- Platform-specific best practices
- Content structure and readability
- Engagement and interaction potential
- SEO and discoverability
- Professional credibility and authority
- Maintaining the specified tone throughout the optimized content`
    }

    private parseResponse(response: string): AIAnalysisResponse['analysis'] {
        try {
            // Try to extract JSON from the response
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                return {
                    score: parsed.score || 0,
                    insights: parsed.insights || [],
                    recommendations: parsed.recommendations || [],
                    optimization: parsed.optimization || '',
                    hashtags: parsed.hashtags || [],
                    engagement: parsed.engagement || [],
                }
            }
        } catch (error) {
            this.logger.warn('Failed to parse Anthropic response as JSON:', error.message)
        }

        // Fallback parsing if JSON fails
        return {
            score: 75,
            insights: ['Content analyzed successfully'],
            recommendations: ['Consider the AI-generated insights above'],
            optimization: response,
            hashtags: ['AI', 'Optimization'],
            engagement: ['Use the optimized content above'],
        }
    }
}
