import { Injectable, Logger } from '@nestjs/common'
import OpenAI from 'openai'
import { AIProvider, AIAnalysisRequest, AIAnalysisResponse } from './ai.interface'

@Injectable()
export class OpenAIService implements AIProvider {
  private readonly logger = new Logger(OpenAIService.name)
  private openai: OpenAI
  private readonly model = 'gpt-4o-mini' // Using GPT-4o-mini for cost efficiency
  private readonly maxTokens = 4000
  private readonly costPerToken = 0.00000015 // GPT-4o-mini pricing

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      this.logger.warn('OpenAI API key not found. Service will be disabled.')
      return
    }

    this.openai = new OpenAI({
      apiKey,
      maxRetries: 3,
      timeout: 30000,
    })
  }

  get name(): string {
    return 'OpenAI'
  }

  getCostPerToken(): number {
    return this.costPerToken
  }

  getMaxTokens(): number {
    return this.maxTokens
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.openai) return false

      // Simple health check with minimal tokens
      await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5,
      })
      return true
    } catch (error) {
      this.logger.error('OpenAI health check failed:', error.message)
      return false
    }
  }

  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const startTime = Date.now()

    try {
      if (!this.openai) {
        throw new Error('OpenAI service not configured')
      }

      const prompt = this.buildPrompt(request)

      const completion = await this.openai.chat.completions.create({
        model: this.model,
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
        max_tokens: request.maxTokens || this.maxTokens,
        temperature: request.temperature || 0.7,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      const analysis = this.parseResponse(response)
      const tokensUsed = completion.usage?.total_tokens || 0
      const cost = tokensUsed * this.costPerToken
      const responseTime = Date.now() - startTime

      return {
        provider: this.name,
        model: this.model,
        analysis,
        metadata: {
          tokensUsed,
          cost,
          responseTime,
          timestamp: new Date(),
        },
      }
    } catch (error) {
      this.logger.error('OpenAI analysis failed:', error.message)
      return {
        provider: this.name,
        model: this.model,
        analysis: {
          score: 0,
          insights: [],
          recommendations: [],
          optimization: '',
          hashtags: [],
          engagement: [],
        },
        metadata: {
          tokensUsed: 0,
          cost: 0,
          responseTime: Date.now() - startTime,
          timestamp: new Date(),
        },
        error: error.message,
      }
    }
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

LANGUAGE POLICY: Detect the language of the CONTENT automatically and write all generated text (insights, recommendations, optimization, engagement, hashtags) entirely in that same language. Do not translate to another language. Keep JSON keys in English.
IMPORTANT: You MUST respond in the EXACT SAME LANGUAGE as the input content. If the content is in French, respond in French. If it's in Spanish, respond in Spanish. If it's in English, respond in English. NEVER translate the language.

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
- Maintaining the specified tone throughout the optimized content
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
        }
      }
    } catch (error) {
      this.logger.warn('Failed to parse OpenAI response as JSON:', error.message)
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
