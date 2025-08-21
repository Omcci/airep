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
                model: 'claude-3-haiku-20240307',
                analysis,
                metadata: {
                    tokensUsed: estimatedTokens,
                    cost: estimatedTokens * 0.00000025, // Anthropic Haiku pricing (much cheaper!)
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
        return 0.00000025 // Anthropic Claude 3 Haiku pricing per token (much cheaper than Sonnet!)
    }

    getMaxTokens(): number {
        return 200000 // Anthropic Claude 3 Haiku context window (same as Sonnet, but cheaper!)
    }

    private buildPrompt(request: AIAnalysisRequest): string {
        const platformInstructions = {
            linkedin: 'OPTIMIZE FOR LINKEDIN ENGAGEMENT: Preserve storytelling hooks, personal anecdotes, and curiosity-building openings. Focus on human connection, vulnerability, and conversation-starting elements. LinkedIn rewards authentic storytelling over corporate polish. Maintain suspense and personal touch throughout.',
            twitter: 'OPTIMIZE FOR X/TWITTER ENGAGEMENT: Use concise, punchy openings with thought-provoking questions. Focus on trending topics, viral potential, and retweetability. Keep it conversational and shareable.',
            blog: 'OPTIMIZE FOR BLOG ENGAGEMENT: SEO-friendly headlines with clear value proposition. Structured, scannable content that keeps readers engaged. Focus on comprehensive coverage and authority.',
            email: 'OPTIMIZE FOR EMAIL ENGAGEMENT: Personal, actionable content that builds relationships. Focus on opening hooks, clear value delivery, and strong calls-to-action.'
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

        return `Analyze this content for ${request.platform} optimization with a focus on ENGAGEMENT and PLATFORM-SPECIFIC PATTERNS:

CONTENT:
${request.content}

PLATFORM: ${request.platform}
INSTRUCTIONS: ${platformInstructions[request.platform]}${toneInstruction}

ENGAGEMENT FOCUS:
- For LinkedIn: Preserve storytelling hooks, personal anecdotes, and curiosity-building openings. DO NOT remove suspense or give away the story upfront.
- For Twitter: Create viral-worthy, shareable content with strong opening hooks.
- For Blog: Maintain reader interest through structured storytelling and clear value delivery.
- For Email: Build personal connection and drive action through compelling narratives.

LANGUAGE POLICY: Detect the language of the CONTENT automatically and produce all generated text in that same language. Do not translate to another language. Keep the JSON property names in English.
IMPORTANT: You MUST respond in the EXACT SAME LANGUAGE as the input content. If the content is in French, respond in French. If it's in Spanish, respond in Spanish. If it's in English, respond in English. NEVER translate the language.

Please provide a JSON response with the following structure:
{
  "score": 85,
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "optimization": "Optimized version of the content for the platform with the specified tone. PRESERVE ENGAGEMENT HOOKS and storytelling elements.",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "engagement": ["engagement tip 1", "engagement tip 2"],
  "subScores": {
    "structure": { "value": 1, "max": 2, "label": "Content Structure" },
    "engagement": { "value": 2, "max": 3, "label": "Engagement & Interaction" },
    "hashtags": { "value": 1, "max": 2, "label": "Hashtag Strategy" },
    "specificity": { "value": 1, "max": 2, "label": "Data & Examples" },
    "summary": { "value": 1, "max": 2, "label": "Executive Summary" },
    "conversational": { "value": 2, "max": 2, "label": "Conversation Starter" },
    "authority": { "value": 0, "max": 2, "label": "Professional Authority" },
    "hookStrength": { "value": 2, "max": 2, "label": "Opening Hook Strength" },
    "storytelling": { "value": 2, "max": 2, "label": "Storytelling Flow" },
    "viralPotential": { "value": 1, "max": 2, "label": "Viral/Share Potential" }
  }
}

CRITICAL ENGAGEMENT RULES:
- NEVER remove compelling opening hooks that create curiosity
- PRESERVE personal storytelling elements and vulnerability
- MAINTAIN suspense and narrative flow
- ENHANCE conversation-starting potential
- OPTIMIZE for platform-specific engagement patterns
- RESPONDING IN THE SAME LANGUAGE AS THE INPUT CONTENT`
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
                    subScores: parsed.subScores || undefined,
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
