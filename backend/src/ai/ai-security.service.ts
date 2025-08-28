import { Injectable, Logger } from '@nestjs/common'

export interface SecurityCheckResult {
  isSafe: boolean
  warnings: string[]
  riskLevel: 'low' | 'medium' | 'high'
  blocked: boolean
  reason?: string
}

@Injectable()
export class AISecurityService {
  private readonly logger = new Logger(AISecurityService.name)

  // Troll detection patterns
  private readonly trollPatterns = [
    /^[aeiou]{3,}$/i, // Only vowels repeated
    /^[bcdfghjklmnpqrstvwxyz]{5,}$/i, // Only consonants repeated
    /^[a-z]{1,3}$/i, // Very short random letters
    /^[a-z]{1,2}[0-9]{1,2}[a-z]{1,2}$/i, // Mixed short random
    /^(.)\1{2,}$/, // Same character repeated 3+ times
    /^[a-z0-9]{1,4}$/i, // Very short alphanumeric
  ]

  // Prompt injection patterns
  private readonly injectionPatterns = [
    // Core injection attempts
    /\bignore\s+(?:all|previous)\s+(?:instructions|prompt|context|rules)\b/i,
    /\bdisregard\s+(?:all|previous|above)\s+(?:instructions|prompt|context)\b/i,
    /\boverride\s+(?:system|prompt|instructions)\b/i,
    /\bbypass\s+(?:system|security|filters?)\b/i,
    /\bhack\s+(?:the\s+|this\s+)?(?:system|prompt|ai)\b/i,
    /\bexploit\s+(?:the\s+|this\s+)?(?:system|prompt|ai)\b/i,
    /\bprompt\s+injection\b/i,

    // System manipulation
    /\bnew\s+(?:system|instructions?|rules|guidelines)\s+(?:begin|start|now)\b/i,
    /\breset\s+(?:system|context|conversation)\s+(?:now|completely)\b/i,
    /\bstart\s+fresh\s+(?:system|context|conversation)\b/i,

    // Role manipulation
    /\byou\s+(?:must|should|will)\s+(?:now|instead)\s+(?:act|behave|operate)\s+as\b/i,
    /\bchange\s+your\s+(?:role|behavior|mode)\s+to\b/i,
    /\bswitch\s+to\s+(?:unrestricted|unsafe|debug)\s+mode\b/i,

    // Context manipulation
    /\bforget\s+(?:everything|all|context|history)\s+(?:before|above|previous)\b/i,
    /\bignore\s+(?:context|history|everything)\s+(?:before|above|previous)\b/i,
    /\bclear\s+(?:context|history|memory)\s+(?:now|completely)\b/i
  ]

  // Suspicious content patterns - More specific to avoid false positives
  private readonly suspiciousPatterns = [
    /user:\s*[a-z0-9]+/i, // User impersonation
    /password:\s*\S+/i, // Password attempts
    /api[_-]?key:\s*[a-z0-9]/i, // API key attempts (must have value)
    /token:\s*[a-z0-9]/i, // Token attempts (must have value)
    /secret:\s*[a-z0-9]/i, // Secret attempts (must have value)
    /\badmin\s+access\b|\badmin\s+password\b|\badmin\s+login\b/i, // Admin specific attempts
    /\broot\s+access\b|\broot\s+password\b|\broot\s+login\b/i, // Root specific attempts
    /\bsudo\s+rm\b|\bsudo\s+chmod\b|\bsudo\s+bash\b/i, // Sudo commands
    /\bchmod\s+[0-7]{3,4}\b/i, // Chmod with numbers
    /\brm\s+-rf\b|\brmdir\b/i, // Dangerous commands
    /\bdrop\s+table\b|\bdelete\s+from\b|\btruncate\s+table\b/i, // SQL specific
    /<script[\s>]|<\/script>/i, // Script tags
    /javascript:\s*[a-z]/i, // JS protocol with content
    /\bonload\s*=\s*["']/i, // Event handlers with quotes
    /\bonerror\s*=\s*["']/i, // Event handlers with quotes
    /\bonclick\s*=\s*["']/i, // Event handlers with quotes
    /\beval\s*\(|\beval\s*``/i, // Eval with content
    /\bexec\s*\(|\bexec\s*``/i, // Exec with content
    /\bsystem\s*\(|\bsystem\s*``/i, // System with content
    /\bshell_exec\s*\(|\bshell_exec\s*``/i, // Shell exec with content
    /\bpassthru\s*\(|\bpassthru\s*``/i, // Passthru with content
    /\bproc_open\s*\(|\bproc_open\s*``/i, // Proc open with content
    /\bpopen\s*\(|\bpopen\s*``/i, // Popen with content
    /\bcurl_exec\s*\(|\bcurl_exec\s*``/i, // Curl exec with content
    /\bfile_get_contents\s*\(["']/i, // File access with quotes
    /\bfopen\s*\(["']/i, // File access with quotes
    /\binclude\s*\(["']/i, // Include with quotes
    /\brequire\s*\(["']/i, // Require with quotes
    /\binclude_once\s*\(["']/i, // Include once with quotes
    /\brequire_once\s*\(["']/i, // Require once with quotes
  ]

  /**
   * Comprehensive security check for AI input
   */
  async checkInputSecurity(content: string, platform: string): Promise<SecurityCheckResult> {
    const warnings: string[] = []
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    let blocked = false
    let reason: string | undefined

    // 1. Troll Detection (temporarily disabled for testing)
    const trollResult = this.detectTrollContent(content)
    if (trollResult.isTroll) {
      // Block meaningless/troll content so AI analysis is not triggered
      this.logger.warn(`Troll content detected and blocked: ${trollResult.reason}`)
      // Redacted user-facing message (no content echo, no rule hints)
      warnings.push('Input did not meet minimum quality requirements.')
      riskLevel = 'high'
      blocked = true
      reason = 'Troll content detected'
    }

    // 2. Prompt Injection Detection
    const injectionResult = this.detectPromptInjection(content)
    if (injectionResult.detected) {
      blocked = true
      reason = 'Prompt injection attempt detected'
      warnings.push(`Potential prompt injection detected: "${injectionResult.pattern}"`)
      riskLevel = 'high'
    }

    // 3. Suspicious Content Detection
    const suspiciousResult = this.detectSuspiciousContent(content)
    if (suspiciousResult.detected) {
      warnings.push(`Suspicious content pattern detected: "${suspiciousResult.pattern}"`)
      riskLevel = riskLevel === 'low' ? 'medium' : 'high'
    }

    // 4. Content Quality Check
    const qualityResult = this.checkContentQuality(content, platform)
    if (!qualityResult.isValid) {
      if (qualityResult.reason) {
        warnings.push('Input did not meet minimum quality requirements.')
      }
      if (qualityResult.blocked) {
        blocked = true
        reason = 'Content quality too low'
        riskLevel = 'high'
      } else {
        riskLevel = riskLevel === 'low' ? 'medium' : riskLevel
      }
    }

    // 5. Rate Limiting Check (placeholder for future implementation)
    const rateLimitResult = await this.checkRateLimit(content)
    if (rateLimitResult.blocked) {
      blocked = true
      reason = 'Rate limit exceeded'
      riskLevel = 'high'
    }

    // Moderation (always-on if key present)
    const moderation = await this.checkOpenAIModeration(content)
    if (moderation.blocked) {
      warnings.push('Input did not meet policy requirements.')
      blocked = true
      reason = 'Policy violation detected'
      riskLevel = 'high'
    }

    // Log security events
    if (warnings.length > 0) {
      this.logger.warn(`Security warnings for content: ${warnings.join(', ')}`)
    }
    if (blocked && reason) {
      this.logger.error(`Content blocked for security reasons: ${reason}`)
    }

    return {
      isSafe: !blocked && riskLevel === 'low',
      warnings,
      riskLevel,
      blocked,
      reason: reason || undefined
    }
  }

  /**
   * Detect troll/garbage content
   */
  private detectTrollContent(content: string): { isTroll: boolean; reason?: string } {
    const normalized = this.normalizeForAnalysis(content)
    const trimmed = normalized.trim()

    // Fast-pass: sufficiently long, sentence-like content is never troll (language-agnostic)
    const words = Array.from(trimmed.matchAll(/\p{L}+/gu)).map(m => m[0])
    const sentenceMatches = trimmed.match(/[.!?…]+/g) || []
    if (words.length >= 20 && sentenceMatches.length >= 2) {
      return { isTroll: false }
    }

    // Check for very short content
    if (trimmed.length < 5) {
      return { isTroll: true, reason: 'Content too short' }
    }

    // Check for repeated characters
    if (trimmed.length > 2 && /^(.)\1+$/.test(trimmed)) {
      return { isTroll: true, reason: 'Repeated characters' }
    }

    // Check troll patterns
    for (const pattern of this.trollPatterns) {
      if (pattern.test(trimmed)) {
        return { isTroll: true, reason: 'Matches troll pattern' }
      }
    }

    // Character diversity checks only apply to short/medium content (language-agnostic)
    const lettersOnly = trimmed.replace(/[^\p{L}]/gu, '')
    const uniqueChars = new Set(lettersOnly.toLowerCase()).size
    const totalChars = lettersOnly.length
    if (totalChars > 10 && totalChars < 120 && uniqueChars / Math.max(totalChars, 1) < 0.3) {
      return { isTroll: true, reason: 'Low character diversity (gibberish)' }
    }
    if (totalChars >= 120 && uniqueChars / Math.max(totalChars, 1) < 0.15 && words.length < 15) {
      return { isTroll: true, reason: 'Very low character diversity (likely gibberish)' }
    }

    // Keyboard mashing patterns
    const keyboardPatterns = [
      /qwerty/i,
      /asdfgh/i,
      /zxcvbn/i,
      /qazwsx/i,
      /edcrfv/i,
      /tgbyhn/i,
      /ujmik/i,
      /olp/i,
    ]
    for (const pattern of keyboardPatterns) {
      if (pattern.test(trimmed)) {
        return { isTroll: true, reason: 'Keyboard mashing pattern' }
      }
    }

    // Language-agnostic default: not troll
    return { isTroll: false }
  }

  /**
   * Detect prompt injection attempts
   */
  private detectPromptInjection(content: string): { detected: boolean; pattern?: string } {
    const lowerContent = content.toLowerCase()

    for (const pattern of this.injectionPatterns) {
      if (pattern.test(lowerContent)) {
        return { detected: true, pattern: pattern.source }
      }
    }

    // Check for role-playing attempts
    const rolePatterns = [
      /you are now/i,
      /act as if/i,
      /pretend to be/i,
      /imagine you are/i,
      /suppose you are/i,
      /let's say you are/i,
      /what if you were/i,
      /if you were/i,
      /assume you are/i,
      /consider yourself/i,
    ]

    for (const pattern of rolePatterns) {
      if (pattern.test(lowerContent)) {
        return { detected: true, pattern: 'Role manipulation attempt' }
      }
    }

    return { detected: false }
  }

  /**
   * Detect suspicious content patterns
   */
  private detectSuspiciousContent(content: string): { detected: boolean; pattern?: string } {
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(content)) {
        return { detected: true, pattern: pattern.source }
      }
    }

    return { detected: false }
  }

  /**
   * Check content quality and relevance
   */
  private checkContentQuality(content: string, platform: string): { isValid: boolean; blocked: boolean; reason?: string } {
    const normalized = this.normalizeForAnalysis(content)
    const trimmed = normalized.trim()

    // Minimum content length based on platform
    const minLengths = { linkedin: 20, twitter: 10, blog: 50, email: 30 }
    const minLength = (minLengths as any)[platform] || 20

    if (trimmed.length < minLength) {
      return { isValid: false, blocked: true, reason: `Content too short for ${platform}. Minimum ${minLength} characters required.` }
    }

    // Unicode-aware word extraction (letters only)
    const words = Array.from(trimmed.matchAll(/\p{L}+/gu)).map(m => m[0]).filter(w => w.length > 2)
    if (words.length < 3) {
      return { isValid: false, blocked: true, reason: 'Content must contain at least 3 meaningful words.' }
    }

    // Excessive repetition
    const wordCounts = new Map<string, number>()
    for (const word of words) {
      const key = word.toLowerCase()
      wordCounts.set(key, (wordCounts.get(key) || 0) + 1)
    }
    const maxRepetition = Math.max(...wordCounts.values())
    if (maxRepetition > words.length * 0.4) {
      return { isValid: false, blocked: false, reason: 'Content has excessive word repetition.' }
    }

    return { isValid: true, blocked: false }
  }

  /**
   * Check rate limiting (placeholder for future implementation)
   */
  private async checkRateLimit(content: string): Promise<{ blocked: boolean }> {
    // Rate limiting is now handled by RateLimitService
    // This method is kept for backward compatibility
    return { blocked: false }
  }

  /**
   * Optional OpenAI moderation (always attempted if OPENAI_API_KEY is set)
   */
  private async checkOpenAIModeration(content: string): Promise<{ blocked: boolean; modelTried?: string; categories?: any; scores?: any }> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return { blocked: false }

    const callModeration = async (model: string) => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 1000)
      try {
        const res = await fetch('https://api.openai.com/v1/moderations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ model, input: content }),
          signal: controller.signal
        })
        clearTimeout(timeout)
        if (!res.ok) return { ok: false as const }
        const data = await res.json()
        const result = data?.results?.[0]
        if (!result) return { ok: false as const }
        const blocked = !!result.flagged
        return { ok: true as const, blocked, categories: result.categories, scores: result.category_scores }
      } catch {
        clearTimeout(timeout)
        return { ok: false as const }
      }
    }

    // Try newest first, then fallback
    const primaryModel = 'omni-moderation-latest'
    const fallbackModel = 'text-moderation-latest'

    const primary = await callModeration(primaryModel)
    if (primary.ok) {
      return { blocked: primary.blocked, modelTried: primaryModel, categories: primary.categories, scores: primary.scores }
    }

    const fallback = await callModeration(fallbackModel)
    if (fallback.ok) {
      return { blocked: fallback.blocked, modelTried: fallbackModel, categories: fallback.categories, scores: fallback.scores }
    }

    return { blocked: false }
  }

  /**
   * Normalize content for analysis: NFKC, strip emojis/pictographs and math alphanumerics, remove zero-width chars
   */
  private normalizeForAnalysis(content: string): string {
    let n = content.normalize('NFKC')
    // Remove zero-width characters
    n = n.replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Remove emoji/pictographs (U+1F300–U+1FAFF), dingbats/misc (U+2600–U+26FF, U+2700–U+27BF)
    n = n.replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
    n = n.replace(/[\u2600-\u26FF]/g, '').replace(/[\u2700-\u27BF]/g, '')
    // Remove Mathematical Alphanumeric Symbols (U+1D400–U+1D7FF)
    n = n.replace(/[\u{1D400}-\u{1D7FF}]/gu, '')
    return n
  }

  /**
   * Sanitize content for safe AI processing
   */
  sanitizeContent(content: string): string {
    return content
      .normalize('NFKC')
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width chars
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove JS protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
  }

  /**
   * Get security recommendations for blocked content
   */
  getSecurityRecommendations(securityResult: SecurityCheckResult): string[] {
    const recommendations: string[] = []

    if (securityResult.blocked) {
      recommendations.push('❌ Content blocked for security reasons')

      if (securityResult.reason === 'Troll content detected') {
        recommendations.push('💡 Please provide meaningful content for analysis')
        recommendations.push('💡 Content should be at least 20 characters with real words')
      } else if (securityResult.reason === 'Prompt injection attempt detected') {
        recommendations.push('🚨 Security violation detected')
        recommendations.push('💡 Please provide legitimate content only')
      } else if (securityResult.reason === 'Content quality too low') {
        recommendations.push('💡 Please provide more detailed content')
        recommendations.push('💡 Include specific examples or explanations')
      }
    } else if (securityResult.riskLevel === 'medium') {
      recommendations.push('⚠️ Content has some security warnings')
      recommendations.push('💡 Review the warnings above')
    } else if (securityResult.riskLevel === 'high') {
      recommendations.push('🚨 High security risk detected')
      recommendations.push('💡 Please review and revise your content')
    }

    return recommendations
  }
}
