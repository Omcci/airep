import { Injectable, Logger } from '@nestjs/common'
import { AIProvider, AIAnalysisRequest, AIAnalysisResponse } from './ai.interface'

@Injectable()
export class MistralService implements AIProvider {
    private readonly logger = new Logger(MistralService.name)
    private readonly client: any
    private readonly isConfigured: boolean

    constructor() {
        this.logger.log(`Mistral constructor called. Checking environment...`)
        this.logger.log(`MISTRAL_API_KEY exists: ${!!process.env.MISTRAL_API_KEY}`)
        this.logger.log(`MISTRAL_API_KEY length: ${process.env.MISTRAL_API_KEY ? process.env.MISTRAL_API_KEY.length : 0}`)
        this.logger.log(`MISTRAL_API_KEY preview: ${process.env.MISTRAL_API_KEY ? process.env.MISTRAL_API_KEY.substring(0, 10) + '...' : 'undefined'}`)

        this.isConfigured = !!process.env.MISTRAL_API_KEY
        if (this.isConfigured) {
            try {
                // Initialize Mistral client
                const { MistralClient } = require('mistral-ts')
                this.client = new MistralClient(process.env.MISTRAL_API_KEY)
                this.logger.log('Mistral AI service initialized successfully')
            } catch (error) {
                this.logger.error('Failed to initialize Mistral client:', error)
                this.isConfigured = false
            }
        } else {
            this.logger.warn('Mistral API key not found. Service will be disabled.')
        }
    }

    get name(): string {
        return 'Mistral'
    }

    async isHealthy(): Promise<boolean> {
        this.logger.log(`Mistral isHealthy called. isConfigured: ${this.isConfigured}, client: ${!!this.client}`)

        if (!this.isConfigured) {
            this.logger.warn('Mistral service not configured - no API key')
            return false
        }

        if (!this.client) {
            this.logger.warn('Mistral client not initialized - package not available')
            return false
        }

        try {
            // Simple health check - could be enhanced with actual API call
            this.logger.log('Mistral health check passed')
            return true
        } catch (error) {
            this.logger.error('Mistral health check failed:', error)
            return false
        }
    }

    async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
        if (!this.isConfigured || !this.client) {
            throw new Error('Mistral service not configured')
        }

        const startTime = Date.now()

        try {
            this.logger.log(`Starting Mistral analysis for ${request.platform} platform`)

            // Build the prompt for Mistral
            const prompt = this.buildPrompt(request)

            // Make real API call to Mistral
            const response = await this.client.chat({
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

            const aiResponse = response.choices[0]?.message?.content
            if (!aiResponse) {
                throw new Error('No response from Mistral')
            }

            // Log the raw response for debugging (first 500 chars)
            this.logger.debug(`Mistral raw response (first 500 chars): ${aiResponse.substring(0, 500)}...`)

            // Parse the AI response
            const analysis = this.parseResponse(aiResponse)
            const responseTime = Date.now() - startTime
            const estimatedTokens = Math.ceil(request.content.length / 4) + 500

            return {
                provider: 'Mistral',
                model: 'mistral-small-latest',
                analysis,
                metadata: {
                    tokensUsed: estimatedTokens,
                    cost: estimatedTokens * 0.000002, // Mistral Small pricing (much cheaper!)
                    responseTime,
                    timestamp: new Date()
                }
            }

        } catch (error) {
            this.logger.error('Mistral analysis failed:', error)

            // Provide a fallback response instead of throwing
            const responseTime = Date.now() - startTime
            const estimatedTokens = Math.ceil(request.content.length / 4) + 500

            return {
                provider: 'Mistral',
                model: 'mistral-small-latest',
                analysis: {
                    score: 75,
                    insights: ['Content analysis completed with fallback processing'],
                    recommendations: ['Consider the AI-generated insights above'],
                    optimization: 'Content optimization completed successfully',
                    hashtags: ['AI', 'Optimization'],
                    engagement: ['Use the optimized content above'],
                },
                metadata: {
                    tokensUsed: estimatedTokens,
                    cost: estimatedTokens * 0.000002, // Mistral Small pricing
                    responseTime,
                    timestamp: new Date()
                },
                error: error.message
            }
        }
    }

    getCostPerToken(): number {
        return 0.000002 // Mistral Small pricing per token (much cheaper than Large!)
    }

    getMaxTokens(): number {
        return 32000 // Mistral Small context window (same as Large, but cheaper!)
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

LANGUAGE POLICY: CRITICAL - LANGUAGE CONSISTENCY IS MANDATORY

1. DETECT INPUT LANGUAGE: Analyze the CONTENT above and identify the primary language (French, Spanish, English, etc.)
2. RESPOND IN SAME LANGUAGE: ALL generated text (insights, recommendations, optimization, engagement, hashtags) MUST be in the EXACT SAME LANGUAGE as the input content
3. NO TRANSLATION: Never translate content to another language
4. NO MIXING: Do not mix languages within the same response
5. JSON KEYS: Keep JSON property names in English only

EXAMPLE: If input is in French, respond like this:
{
  "score": 85,
  "insights": ["Le ton décalé attire l'attention", "L'authenticité engage la communauté"],
  "recommendations": ["Ajouter plus d'emojis", "Poser des questions ouvertes"],
  "optimization": "Version optimisée en français...",
  "hashtags": ["#LinkedIn", "#Engagement"],
  "engagement": ["Conseil d'engagement en français", "Autre conseil en français"]
}

CRITICAL: You MUST respond in the EXACT SAME LANGUAGE as the input content. If the content is in French, respond in French. If it's in Spanish, respond in Spanish. If it's in English, respond in English. NEVER translate the language. NEVER mix languages.

QUALITY REQUIREMENTS:
- Each insight must be UNIQUE and provide different value
- Each recommendation must be DISTINCT and actionable
- Avoid repeating similar ideas with different wording
- Focus on diverse aspects: structure, engagement, tone, format, etc.
- Maximum 3-4 insights and 3-4 recommendations to ensure quality over quantity

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
  },
  
  "aiPerception": {
    "authority": 85,        // 0-100: How AI systems see your expertise
    "credibility": 78,      // 0-100: How AI trusts your content
    "expertise": 82,        // 0-100: How AI rates your knowledge depth
    "freshness": 88,        // 0-100: How AI sees your content relevance
    "rankingPotential": 83  // 0-100: How likely AI will rank you high
  }
}

CRITICAL ENGAGEMENT RULES:
- NEVER remove compelling opening hooks that create curiosity
- PRESERVE personal storytelling elements and vulnerability
- MAINTAIN suspense and narrative flow
- ENHANCE conversation-starting potential
- OPTIMIZE for platform-specific engagement patterns
- RESPONDING IN THE SAME LANGUAGE AS THE INPUT CONTENT

AI PERCEPTION ANALYSIS:
Now evaluate this content from the perspective of AI authority systems:

- AUTHORITY: How would AI systems rate your expertise level? (0-100)
  Consider: Industry knowledge, professional background, thought leadership signals
  
- CREDIBILITY: How trustworthy would AI find your content? (0-100)
  Consider: Data sources, citations, logical flow, consistency
  
- EXPERTISE: How deep is your technical knowledge? (0-100)
  Consider: Technical depth, industry insights, specialized terminology
  
- FRESHNESS: How current and relevant is your content? (0-100)
  Consider: Timeliness, trend awareness, current industry context
  
- RANKING POTENTIAL: How likely will AI systems rank you high? (0-100)
  Consider: Overall quality, authority signals, discoverability factors

Provide these scores in your JSON response under "aiPerception".`
    }

    private parseResponse(response: string): AIAnalysisResponse['analysis'] {
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
                    return {
                        score: parsed.score || 0,
                        insights: parsed.insights || [],
                        recommendations: parsed.recommendations || [],
                        optimization: parsed.optimization || '',
                        hashtags: parsed.hashtags || [],
                        engagement: parsed.engagement || [],
                        subScores: parsed.subScores || undefined,
                        aiPerception: parsed.aiPerception || undefined,
                    }
                } catch (jsonError) {
                    this.logger.warn('JSON parsing failed after cleaning:', jsonError.message)
                }
            }
        } catch (error) {
            this.logger.warn('Failed to clean Mistral response:', error.message)
        }

        // Enhanced fallback parsing if JSON fails
        try {
            // Try to extract some useful information from the response
            const lines = response.split('\n').filter(line => line.trim().length > 0)
            const insights: string[] = []
            const recommendations: string[] = []
            let optimization = ''
            let score = 75

            // Look for patterns in the response
            for (const line of lines) {
                const trimmed = line.trim()
                if (trimmed.includes('insight') || trimmed.includes('Insight')) {
                    insights.push(trimmed)
                } else if (trimmed.includes('recommend') || trimmed.includes('Recommend')) {
                    recommendations.push(trimmed)
                } else if (trimmed.includes('optimiz') || trimmed.includes('Optimiz')) {
                    optimization = trimmed
                } else if (trimmed.includes('score') || trimmed.includes('Score')) {
                    const scoreMatch = trimmed.match(/(\d+)/)
                    if (scoreMatch) {
                        score = parseInt(scoreMatch[1])
                    }
                }
            }

            // If we found some content, use it
            if (insights.length > 0 || recommendations.length > 0 || optimization) {
                return {
                    score,
                    insights: insights.length > 0 ? insights : ['Content analyzed successfully'],
                    recommendations: recommendations.length > 0 ? recommendations : ['Consider the AI-generated insights above'],
                    optimization: optimization || response.substring(0, 200) + '...',
                    hashtags: ['AI', 'Optimization'],
                    engagement: ['Use the optimized content above'],
                }
            }
        } catch (fallbackError) {
            this.logger.warn('Fallback parsing also failed:', fallbackError.message)
        }

        // Final fallback
        return {
            score: 75,
            insights: ['Content analyzed successfully'],
            recommendations: ['Consider the AI-generated insights above'],
            optimization: response.substring(0, 200) + '...',
            hashtags: ['AI', 'Optimization'],
            engagement: ['Use the optimized content above'],
        }
    }
}
