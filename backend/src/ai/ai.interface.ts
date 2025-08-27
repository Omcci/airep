export interface AIAnalysisRequest {
  content: string
  platform: 'linkedin' | 'twitter' | 'blog' | 'email'
  contentType: 'content' | 'tool' | 'url'
  tone?: 'professional' | 'casual' | 'funny' | 'harsh' | 'friendly' | 'formal'
  maxTokens?: number
  temperature?: number
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
    aiPerception?: {
      authority: number
      credibility: number
      expertise: number
      freshness: number
      rankingPotential: number
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
