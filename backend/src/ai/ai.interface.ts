export interface AIAnalysisRequest {
  content: string
  platform: 'linkedin' | 'twitter' | 'blog' | 'email'
  contentType: 'content' | 'tool' | 'url' | 'article' | 'documentation' | 'api'
  tone?: 'professional' | 'casual' | 'funny' | 'harsh' | 'friendly' | 'formal'
  maxTokens?: number
  temperature?: number
  userId?: string
}

export interface AIAnalysisResponse {
  provider: string
  model: string
  analysis: {
    score: number
    insights: string[]
    recommendations: string[]
    optimization: string
    hashtags: string[]
    engagement: string[]
    subScores?: {
      [key: string]: { value: number; max: number; label?: string }
    }
    // GEO Analysis fields
    citationAnalysis?: {
      quotableElements: string[]
      citationContexts: string[]
      relevantQueries?: Array<{ query: string; citationContext: string }>
    }
    authorityEvaluation?: {
      expertiseSignals: string[]
      trustFactors: string[]
      implementationProof?: string[]
    }
    competitiveAnalysis?: {
      uniqueStrengths: string[]
      differentiators: string[]
      improvements: string[]
    }
    knowledgeGraph?: {
      nodes: Array<{
        type: string
        label: string
        category: string
        metrics: {
          relevance: number
          authority: number
          freshness: number
        }
      }>
    }
    aiPerception?: {
      // Core authority metrics
      authority: number
      credibility: number
      expertise: number
      freshness: number
      rankingPotential: number
      // LLM training metrics
      semanticRelevance: number
      citationPotential: number
      knowledgeGraphPosition: number
      authoritySignals: number
      contentFreshness: number
      sourceCredibility: number
    }
  }
  metadata: {
    tokensUsed: number
    cost: number
    responseTime: number
    timestamp: Date
  }
  error?: string
}

export interface AIConsolidatedResponse {
  consensus: {
    score: number
    insights: string[]
    recommendations: string[]
    optimization: string
    hashtags: string[]
    engagement: string[]
    subScores?: {
      [key: string]: { value: number; max: number; label?: string }
    }
    aiPerception?: {
      authority: number
      credibility: number
      expertise: number
      freshness: number
      rankingPotential: number
      semanticRelevance: number
      citationPotential: number
      knowledgeGraphPosition: number
      authoritySignals: number
      contentFreshness: number
      sourceCredibility: number
    }
  }
  providerInsights: {
    [provider: string]: AIAnalysisResponse
  }
  confidence: number
  conflicts: string[]
}

export interface AIProvider {
  name: string
  analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse>
  isHealthy(): Promise<boolean>
  getCostPerToken(): number
  getMaxTokens(): number
}
