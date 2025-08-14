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
    /ignore previous instructions/i,
    /forget everything/i,
    /new instructions/i,
    /system prompt/i,
    /ignore above/i,
    /disregard previous/i,
    /new system/i,
    /override/i,
    /bypass/i,
    /hack/i,
    /exploit/i,
    /prompt injection/i,
    /ignore the above/i,
    /disregard all above/i,
    /new rules/i,
    /new guidelines/i,
    /ignore all previous/i,
    /start fresh/i,
    /reset conversation/i,
    /new conversation/i,
    /ignore context/i,
    /ignore history/i,
    /ignore everything/i,
    /ignore all/i,
    /ignore above instructions/i,
    /ignore previous rules/i,
    /ignore previous guidelines/i,
    /ignore previous context/i,
    /ignore previous history/i,
    /ignore previous everything/i,
    /ignore previous all/i,
    /ignore previous above/i,
    /ignore previous system/i,
    /ignore previous prompt/i,
    /ignore previous conversation/i,
    /ignore previous reset/i,
    /ignore previous fresh/i,
    /ignore previous start/i,
    /ignore previous new/i,
    /ignore previous override/i,
    /ignore previous bypass/i,
    /ignore previous hack/i,
    /ignore previous exploit/i,
    /ignore previous injection/i,
    /ignore previous rules/i,
    /ignore previous guidelines/i,
    /ignore previous context/i,
    /ignore previous history/i,
    /ignore previous everything/i,
    /ignore previous all/i,
    /ignore previous above/i,
    /ignore previous system/i,
    /ignore previous prompt/i,
    /ignore previous conversation/i,
    /ignore previous reset/i,
    /ignore previous fresh/i,
    /ignore previous start/i,
    /ignore previous new/i,
    /ignore previous override/i,
    /ignore previous bypass/i,
    /ignore previous hack/i,
    /ignore previous exploit/i,
    /ignore previous injection/i,
  ]

  // Suspicious content patterns
  private readonly suspiciousPatterns = [
    /user:\s*[a-z0-9]+/i, // User impersonation
    /password:\s*\S+/i, // Password attempts
    /api[_-]?key:\s*\S+/i, // API key attempts
    /token:\s*\S+/i, // Token attempts
    /secret:\s*\S+/i, // Secret attempts
    /admin/i, // Admin access attempts
    /root/i, // Root access attempts
    /sudo/i, // Sudo attempts
    /chmod/i, // Command attempts
    /rm\s+-rf/i, // Dangerous commands
    /drop\s+table/i, // SQL injection
    /<script>/i, // XSS attempts
    /javascript:/i, // JS injection
    /onload=/i, // Event injection
    /onerror=/i, // Event injection
    /onclick=/i, // Event injection
    /eval\(/i, // Code execution
    /exec\(/i, // Code execution
    /system\(/i, // Code execution
    /shell_exec\(/i, // Code execution
    /passthru\(/i, // Code execution
    /proc_open\(/i, // Code execution
    /popen\(/i, // Code execution
    /curl_exec\(/i, // Network requests
    /file_get_contents\(/i, // File access
    /fopen\(/i, // File access
    /include\(/i, // File inclusion
    /require\(/i, // File inclusion
    /include_once\(/i, // File inclusion
    /require_once\(/i, // File inclusion
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
      // Temporarily log instead of blocking for testing
      this.logger.warn(`Troll content detected but not blocked: ${trollResult.reason}`)
      warnings.push(`Content appears to be meaningless or troll content: "${content}"`)
      riskLevel = 'medium'
      // blocked = true  // Temporarily disabled
      // reason = 'Troll content detected'  // Temporarily disabled
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
        warnings.push(qualityResult.reason)
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
    const trimmed = content.trim()

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

    // Check for gibberish (low character diversity) - less strict for longer content
    const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s/g, '')).size
    const totalChars = trimmed.replace(/\s/g, '').length
    if (totalChars > 10 && totalChars < 50 && uniqueChars / totalChars < 0.3) {
      return { isTroll: true, reason: 'Low character diversity (gibberish)' }
    }
    // For longer content (>50 chars), be more lenient as natural language has repetition
    if (totalChars >= 50 && uniqueChars / totalChars < 0.15) {
      return { isTroll: true, reason: 'Very low character diversity (likely gibberish)' }
    }

    // Check for random keyboard mashing
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

    // Check for French language indicators (be more lenient)
    const frenchIndicators = [
      /\b(je|tu|il|elle|nous|vous|ils|elles)\b/i,
      /\b(est|sont|était|étaient|avoir|faire|aller|venir)\b/i,
      /\b(avec|pour|dans|sur|par|de|du|des|le|la|les)\b/i,
      /\b(projet|développement|web|mobile|fonctionnalité|erreur|corriger)\b/i,
    ]

    const frenchWordCount = frenchIndicators.filter(pattern => pattern.test(trimmed)).length
    if (frenchWordCount >= 3) {
      // If we detect French words, be more lenient with character diversity
      return { isTroll: false, reason: 'French language detected' }
    }

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
    const trimmed = content.trim()

    // Minimum content length based on platform
    const minLengths = {
      linkedin: 20,
      twitter: 10,
      blog: 50,
      email: 30
    }

    const minLength = minLengths[platform as keyof typeof minLengths] || 20

    if (trimmed.length < minLength) {
      return {
        isValid: false,
        blocked: true,
        reason: `Content too short for ${platform}. Minimum ${minLength} characters required.`
      }
    }

    // Check for meaningful content (not just random words)
    const words = trimmed.split(/\s+/).filter(word => word.length > 2)
    if (words.length < 3) {
      return {
        isValid: false,
        blocked: true,
        reason: 'Content must contain at least 3 meaningful words.'
      }
    }

    // Check for excessive repetition
    const wordCounts = new Map<string, number>()
    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
    }

    const maxRepetition = Math.max(...wordCounts.values())
    if (maxRepetition > words.length * 0.4) {
      return {
        isValid: false,
        blocked: false,
        reason: 'Content has excessive word repetition.'
      }
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
   * Sanitize content for safe AI processing
   */
  sanitizeContent(content: string): string {
    return content
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
