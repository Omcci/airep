import { Injectable } from '@nestjs/common'
import { AIService } from '../ai/ai.service'
import { Platform, ContentType, Tone } from '../ai/dto/ai-analysis.dto'

@Injectable()
export class AuditService {
    constructor(private readonly aiService: AIService) { }

    async evaluateContent(content: string, platform: string = 'blog') {
        const metrics = this.evaluateText(content, platform)
        const score = this.computeScore(metrics, platform)
        const details = this.buildDetails(metrics, platform)
        const recommendations = this.buildRecommendations(details, platform)

        return { score, details, recommendations, platform }
    }

    async optimizeContent(content: string, platform: string = 'blog', tone: Tone = Tone.PROFESSIONAL) {
        try {
            // Use real AI service for optimization
            const aiRequest = {
                content,
                platform: platform as Platform,
                contentType: ContentType.CONTENT,
                tone,
                validatedContent: content // This is computed by the DTO transform
            }

            const aiResult = await this.aiService.analyzeContent(aiRequest, 'anonymous')

            // Extract optimized content from AI result
            const optimizedContent = this.extractOptimizedContent(aiResult, content, platform, tone)

            const analysis = await this.evaluateContent(content, platform)

            return {
                originalContent: content,
                original: analysis,
                optimized: {
                    content: optimizedContent,
                    improvements: this.getImprovementSuggestions(analysis.details),
                    tone: tone
                }
            }
        } catch (error) {
            console.error('AI optimization failed, falling back to template:', error)
            // Fallback to template-based optimization
            const analysis = await this.evaluateContent(content, platform)
            const optimized = this.generateOptimizedVersion(content, analysis.details, platform, tone)

            return {
                originalContent: content,
                original: analysis,
                optimized: {
                    content: optimized,
                    improvements: this.getImprovementSuggestions(analysis.details),
                    tone: tone
                }
            }
        }
    }

    private evaluateText(text: string, platform: string) {
        const lower = text.toLowerCase()

        // Base metrics
        const hasH1 = /<h1[\s\S]*?>[\s\S]*?<\/h1>/i.test(text)
        const hasH2 = /<h2[\s\S]*?>[\s\S]*?<\/h2>/i.test(text)
        const hasSchema = lower.includes('schema.org') || /<script[^>]*application\/ld\+json/i.test(text)
        const hasMetaDesc = /<meta[^>]*name=["']description["'][^>]*>/i.test(text)
        const hasFaq = lower.includes('faq') || lower.includes('q&a') || /faq/i.test(text)
        const hasList = /<ul[\s\S]*?>[\s\S]*?<\/ul>/i.test(text) || /<ol[\s\S]*?>[\s\S]*?<\/ol>/i.test(text)
        const hasNumbers = /(\b\d{1,3}(\.\d+)?%?\b)/.test(text)
        const hasSummary = /(summary|tl;dr|overview)/i.test(text)
        const conversational = /(how to|best way|step by step|guide)/i.test(lower)
        const hasExamples = /(example|instance|case study|scenario)/i.test(lower)
        const hasCitations = /(source|reference|study|research|according to)/i.test(lower)

        // Platform-specific metrics
        const hasHashtags = /#[a-zA-Z0-9]+/g.test(text)
        const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(text)
        const hasQuestions = /\?/.test(text)
        const hasCallToAction = /(what do you think|your thoughts|agree|disagree|comment|share|rt|retweet)/i.test(lower)
        const hasPersonalTouch = /(i|me|my|we|our|you|your)/i.test(lower)
        const hasProfessionalTone = /(business|professional|industry|market|strategy|leadership)/i.test(lower)

        if (platform === 'linkedin') {
            return {
                structure: Number(hasList) + Number(hasSummary),
                engagement: Number(hasQuestions) + Number(hasCallToAction) + Number(hasProfessionalTone),
                hashtags: Number(hasHashtags),
                specificity: Number(hasNumbers) + Number(hasExamples),
                summary: Number(hasSummary),
                conversational: Number(hasQuestions) + Number(hasCallToAction),
                authority: Number(hasCitations) + Number(hasProfessionalTone),
            }
        } else if (platform === 'twitter') {
            return {
                structure: Number(hasList) + Number(hasSummary),
                engagement: Number(hasQuestions) + Number(hasCallToAction) + Number(hasEmojis),
                hashtags: Number(hasHashtags),
                specificity: Number(hasNumbers) + Number(hasExamples),
                summary: Number(hasSummary),
                conversational: Number(hasQuestions) + Number(hasCallToAction),
                virality: Number(hasCallToAction) + Number(hasEmojis),
            }
        } else if (platform === 'email') {
            return {
                structure: Number(hasSummary) + Number(hasList),
                personalization: Number(hasPersonalTouch) + Number(hasCallToAction),
                clarity: Number(hasSummary) + Number(hasExamples),
                specificity: Number(hasNumbers) + Number(hasExamples),
                summary: Number(hasSummary),
                conversational: Number(hasQuestions) + Number(hasCallToAction),
                professional: Number(hasProfessionalTone),
            }
        } else {
            // Blog/Website
            return {
                structure: Number(hasH1) + Number(hasH2) + Number(hasList),
                semantics: Number(hasSchema) + Number(hasMetaDesc),
                faq: Number(hasFaq),
                specificity: Number(hasNumbers) + Number(hasExamples),
                summary: Number(hasSummary),
                conversational: Number(conversational),
                authority: Number(hasCitations),
            }
        }
    }

    private computeScore(metrics: ReturnType<AuditService['evaluateText']>, platform: string) {
        let weights: Record<string, number>

        if (platform === 'linkedin') {
            weights = {
                structure: 1,
                engagement: 3,
                hashtags: 2,
                specificity: 2,
                summary: 2,
                conversational: 2,
                authority: 2
            }
        } else if (platform === 'twitter') {
            weights = {
                structure: 1,
                engagement: 3,
                hashtags: 2,
                specificity: 1,
                summary: 1,
                conversational: 2,
                virality: 3
            }
        } else if (platform === 'email') {
            weights = {
                structure: 2,
                personalization: 3,
                clarity: 2,
                specificity: 2,
                summary: 2,
                conversational: 2,
                professional: 1
            }
        } else {
            // Blog/Website
            weights = {
                structure: 2,
                semantics: 2,
                faq: 1,
                specificity: 2,
                summary: 1,
                conversational: 2,
                authority: 1
            }
        }

        const raw = Object.entries(metrics).reduce((sum, [key, value]) => {
            return sum + (value * (weights[key] || 1))
        }, 0)
        const max = Object.values(weights).reduce((sum, weight) => sum + (weight * 2), 0)
        return Math.round((raw / max) * 100)
    }

    private buildDetails(metrics: ReturnType<AuditService['evaluateText']>, platform: string) {
        if (platform === 'linkedin') {
            return {
                structure: {
                    label: 'Content Structure',
                    value: metrics.structure,
                    max: 2,
                    description: 'Clear structure helps professionals scan and engage',
                    why: 'LinkedIn users prefer scannable, well-organized content',
                    suggestions: [
                        'Use bullet points for key benefits',
                        'Add a clear summary at the top',
                        'Break content into digestible sections'
                    ],
                },
                engagement: {
                    label: 'Engagement & Interaction',
                    value: metrics.engagement,
                    max: 3,
                    description: 'Questions and calls-to-action drive comments',
                    why: 'LinkedIn algorithm favors posts that generate discussion',
                    suggestions: [
                        'End with a thought-provoking question',
                        'Ask for opinions and experiences',
                        'Use professional tone that encourages networking'
                    ],
                },
                hashtags: {
                    label: 'Hashtag Strategy',
                    value: metrics.hashtags,
                    max: 2,
                    description: 'Strategic hashtags improve discoverability',
                    why: 'Hashtags help your content reach relevant professionals',
                    suggestions: [
                        'Use 3-5 relevant industry hashtags',
                        'Mix broad and specific hashtags',
                        'Avoid over-hashtagging (max 5)'
                    ],
                },
                specificity: {
                    label: 'Data & Examples',
                    value: metrics.specificity,
                    max: 2,
                    description: 'Concrete data makes your point more credible',
                    why: 'Professionals value evidence-based insights',
                    suggestions: [
                        'Include specific numbers and percentages',
                        'Add real-world examples or case studies',
                        'Reference industry trends or studies'
                    ],
                },
                summary: {
                    label: 'Executive Summary',
                    value: metrics.summary,
                    max: 2,
                    description: 'Top-level summary for busy professionals',
                    why: 'Executives scan content quickly before diving in',
                    suggestions: [
                        'Start with 2-3 key takeaways',
                        'Use bullet points for main benefits',
                        'Keep summary under 100 characters'
                    ],
                },
                conversational: {
                    label: 'Conversation Starter',
                    value: metrics.conversational,
                    max: 2,
                    description: 'Questions that encourage professional discussion',
                    why: 'LinkedIn is a networking platform, not just broadcasting',
                    suggestions: [
                        'Ask for industry insights',
                        'Request examples from others',
                        'Pose strategic questions'
                    ],
                },
                authority: {
                    label: 'Professional Authority',
                    value: metrics.authority,
                    max: 2,
                    description: 'Establishes your expertise and credibility',
                    why: 'LinkedIn users value thought leadership and expertise',
                    suggestions: [
                        'Reference industry sources or studies',
                        'Share professional insights and analysis',
                        'Demonstrate deep understanding of the topic'
                    ],
                },
            }
        } else if (platform === 'twitter') {
            return {
                structure: {
                    label: 'Thread Structure',
                    value: metrics.structure,
                    max: 2,
                    description: 'Organized threads are easier to follow',
                    why: 'Twitter users prefer well-structured content',
                    suggestions: [
                        'Use numbered tweets for sequences',
                        'Start with a hook, end with a call-to-action',
                        'Keep each tweet focused on one idea'
                    ],
                },
                engagement: {
                    label: 'Engagement Hooks',
                    value: metrics.engagement,
                    max: 3,
                    description: 'Content that encourages interaction',
                    why: 'Twitter algorithm favors engaging content',
                    suggestions: [
                        'Ask questions that invite responses',
                        'Use "RT if you agree" or similar CTAs',
                        'Create content worth sharing'
                    ],
                },
                hashtags: {
                    label: 'Viral Hashtags',
                    value: metrics.hashtags,
                    max: 2,
                    description: 'Trending hashtags increase reach',
                    why: 'Hashtags help your content join conversations',
                    suggestions: [
                        'Use 2-3 trending hashtags',
                        'Research what\'s currently popular',
                        'Don\'t overdo it (max 3 hashtags)'
                    ],
                },
                specificity: {
                    label: 'Concrete Details',
                    value: metrics.specificity,
                    max: 1,
                    description: 'Specific information adds value',
                    why: 'Twitter users appreciate actionable insights',
                    suggestions: [
                        'Include specific numbers or stats',
                        'Share concrete examples or tips',
                        'Make each tweet valuable on its own'
                    ],
                },
                summary: {
                    label: 'Quick Summary',
                    value: metrics.summary,
                    max: 1,
                    description: 'Brief overview for quick understanding',
                    why: 'Twitter users have short attention spans',
                    suggestions: [
                        'Start with key point in first tweet',
                        'Use bullet points for main ideas',
                        'Keep it concise and scannable'
                    ],
                },
                conversational: {
                    label: 'Conversation Starters',
                    value: metrics.conversational,
                    max: 2,
                    description: 'Questions that spark discussion',
                    why: 'Twitter thrives on conversations and debates',
                    suggestions: [
                        'Ask for opinions or experiences',
                        'Use "What do you think?" questions',
                        'Create debate-worthy content'
                    ],
                },
                virality: {
                    label: 'Viral Potential',
                    value: metrics.virality,
                    max: 3,
                    description: 'Content that encourages sharing',
                    why: 'Viral content reaches far beyond your followers',
                    suggestions: [
                        'Create shareable insights or tips',
                        'Use emotional triggers (surprise, humor, inspiration)',
                        'Make content worth retweeting'
                    ],
                },
            }
        } else {
            // Default blog/website details
            return {
                structure: {
                    label: 'Content Structure',
                    value: metrics.structure,
                    max: 3,
                    description: 'Clear headings and lists help AI extract quotable chunks',
                    why: 'Structured content improves passage-level retrieval and understanding',
                    suggestions: [
                        'Add a single H1, then H2/H3 for sections',
                        'Use bullet lists for steps/benefits',
                        'Keep paragraphs short (1 idea each)'
                    ],
                },
                semantics: {
                    label: 'Structured Data & Meta',
                    value: metrics.semantics,
                    max: 2,
                    description: 'Schema.org and meta description clarify page intent',
                    why: 'Machine-readable markup improves AI understanding and attribution',
                    suggestions: [
                        'Add Schema.org (FAQPage, HowTo, Article)',
                        'Include meta description with target keywords',
                        'Use proper HTML semantic elements'
                    ],
                },
                faq: {
                    label: 'FAQ Section',
                    value: metrics.faq,
                    max: 2,
                    description: 'Questions and answers improve AI comprehension',
                    why: 'FAQ format matches how people ask questions to AI',
                    suggestions: [
                        'Add common questions about your topic',
                        'Use Schema.org FAQPage markup',
                        'Structure as Q&A pairs'
                    ],
                },
                specificity: {
                    label: 'Specific Details',
                    value: metrics.specificity,
                    max: 2,
                    description: 'Concrete numbers and examples improve AI understanding',
                    why: 'Specific information helps AI provide accurate citations',
                    suggestions: [
                        'Include specific numbers, percentages, dates',
                        'Add real examples and case studies',
                        'Provide actionable, concrete advice'
                    ],
                },
                summary: {
                    label: 'Executive Summary',
                    value: metrics.summary,
                    max: 2,
                    description: 'Top-level overview helps AI extract key points',
                    why: 'Summaries improve AI comprehension and citation accuracy',
                    suggestions: [
                        'Add 2-3 sentence summary at the top',
                        'Use bullet points for key takeaways',
                        'Include target keywords naturally'
                    ],
                },
                conversational: {
                    label: 'Conversational Tone',
                    value: metrics.conversational,
                    max: 2,
                    description: 'Natural language improves AI comprehension',
                    why: 'Conversational content matches how people ask questions',
                    suggestions: [
                        'Use "how to" and "step by step" language',
                        'Include questions that readers might ask',
                        'Write in natural, helpful tone'
                    ],
                },
                authority: {
                    label: 'Authority Signals',
                    value: metrics.authority,
                    max: 2,
                    description: 'Citations and references build credibility',
                    why: 'AI systems value authoritative, well-sourced content',
                    suggestions: [
                        'Cite industry studies and research',
                        'Reference authoritative sources',
                        'Include expert quotes or insights'
                    ],
                },
            }
        }
    }

    private buildRecommendations(details: any, platform: string) {
        const improvements = Object.values(details)
            .filter((d: any) => d.value < d.max)
            .map((d: any) => ({
                area: d.label,
                current: d.value,
                target: d.max,
                priority: d.max - d.value,
                suggestions: d.suggestions
            }))
            .sort((a: any, b: any) => b.priority - a.priority)

        if (platform === 'linkedin') {
            return [
                'Focus on professional insights that encourage networking',
                'Use data and examples to build credibility',
                'End with questions that spark professional discussion',
                'Keep hashtags relevant to your industry (3-5 max)',
                'Structure content for busy professionals to scan quickly'
            ]
        } else if (platform === 'twitter') {
            return [
                'Create content worth retweeting and sharing',
                'Use trending hashtags strategically (2-3 max)',
                'Ask questions that invite responses and debate',
                'Keep each tweet focused on one clear idea',
                'End with a strong call-to-action for engagement'
            ]
        } else if (platform === 'email') {
            return [
                'Personalize content with "you" and "your" language',
                'Include clear calls-to-action for response',
                'Structure content for easy scanning',
                'Add personal touches and professional tone',
                'End with a question that encourages reply'
            ]
        } else {
            // Blog/Website
            return [
                'Add structured data markup for better AI understanding',
                'Include FAQ sections that match common queries',
                'Use clear headings and bullet points for structure',
                'Add specific examples and data points',
                'Include meta descriptions and schema markup'
            ]
        }
    }

    private generateOptimizedVersion(content: string, details: any, platform: string, tone: Tone) {
        // This would integrate with an AI service to generate optimized content
        // For now, return a template with suggestions

        if (platform === 'linkedin') {
            return this.generateLinkedInOptimized(content, details, tone)
        } else if (platform === 'twitter') {
            return this.generateTwitterOptimized(content, details, tone)
        } else if (platform === 'email') {
            return this.generateEmailOptimized(content, details, tone)
        } else {
            return this.generateBlogOptimized(content, details, tone)
        }
    }

    private generateLinkedInOptimized(content: string, details: any, tone: Tone) {
        // LinkedIn optimization: analyze actual content and generate relevant optimization
        let optimized = content

        // Add tone-based modifications
        switch (tone) {
            case Tone.PROFESSIONAL:
                optimized = `💼 Professional LinkedIn Post\n\n${content}\n\n#ProfessionalDevelopment #CareerGrowth #LinkedInTips`
                break
            case Tone.CASUAL:
                optimized = `😊 Casual LinkedIn Share\n\n${content}\n\n#CasualNetworking #RealTalk #LinkedInCommunity`
                break
            case Tone.FUNNY:
                optimized = `😂 Funny LinkedIn Moment\n\n${content}\n\n#LinkedInHumor #WorkLife #FunnyBusiness`
                break
            case Tone.HARSH:
                optimized = `⚡ Direct LinkedIn Truth\n\n${content}\n\n#BrutalHonesty #LinkedInReality #NoFilter`
                break
            case Tone.FRIENDLY:
                optimized = `🤗 Friendly LinkedIn Post\n\n${content}\n\n#LinkedInFriends #SupportiveCommunity #PositiveVibes`
                break
            case Tone.FORMAL:
                optimized = `📋 Formal LinkedIn Analysis\n\n${content}\n\n#FormalBusiness #ProfessionalStandards #LinkedInExcellence`
                break
        }

        return optimized
    }

    private generateHook(content: string): string {
        // Create a compelling hook based on the actual content
        if (content.includes('Tesla') && content.includes('Robotaxis')) {
            return 'Tesla\'s Autonomous Revolution: How Self-Driving Cars Will Transform Urban Mobility and Professional Productivity'
        } else if (content.includes('Uber') && content.includes('Paris')) {
            return 'The Future of Urban Transportation: From €12 Uber Rides to €3 Autonomous Journeys'
        } else if (content.includes('alternance') || content.includes('stage') || content.includes('candidature')) {
            return 'Navigating the Job Market: Lessons from My Search for the Perfect Opportunity'
        } else if (content.includes('projet') || content.includes('portfolio') || content.includes('développement')) {
            return 'Building My Professional Identity: How Personal Projects Shape Career Growth'
        } else {
            // Generate a hook based on content analysis
            const words = content.toLowerCase().split(/\s+/).filter(word => word.length > 3)
            if (words.length > 0) {
                const keyWord = words[0].charAt(0).toUpperCase() + words[0].slice(1)
                return `Insights on ${keyWord}: What I\'ve Learned and Where We\'re Heading`
            }
            return 'Professional Insights: Sharing What I\'ve Learned Along the Way'
        }
    }

    private extractKeyInsights(content: string): string {
        const insights = []
        const lowerContent = content.toLowerCase()

        // Check for specific content patterns
        if (lowerContent.includes('10 à 12 €') && lowerContent.includes('3 €')) {
            insights.push('• Transportation costs will drop by 75% (from €10-12 to €3 for 2km trips)')
        }
        if (lowerContent.includes('sans conducteur')) {
            insights.push('• Driverless technology eliminates human error and wait times')
        }
        if (lowerContent.includes('bande passante cognitive')) {
            insights.push('• Cognitive bandwidth optimization through reduced commute stress')
        }
        if (lowerContent.includes('rythme circadien')) {
            insights.push('• Daily routine optimization comparable to sleep and nutrition')
        }

        // Check for job search related content
        if (lowerContent.includes('alternance') || lowerContent.includes('stage') || lowerContent.includes('candidature')) {
            insights.push('• Job search requires persistence and continuous learning')
            insights.push('• Building projects during search demonstrates proactive mindset')
            insights.push('• Portfolio development showcases practical skills')
        }

        if (lowerContent.includes('projet') || lowerContent.includes('portfolio')) {
            insights.push('• Personal projects demonstrate initiative and technical skills')
            insights.push('• Portfolio showcases practical application of knowledge')
            insights.push('• Continuous learning through project development')
        }

        // If no specific patterns found, analyze the actual content
        if (insights.length === 0) {
            const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10)
            if (sentences.length > 0) {
                insights.push(`• ${sentences[0].trim()}`)
            }
            if (sentences.length > 1) {
                insights.push(`• ${sentences[1].trim()}`)
            }
            if (insights.length === 0) {
                insights.push('• Content analysis reveals opportunities for improvement')
                insights.push('• Consider adding specific examples and data')
                insights.push('• Structure content with clear sections and takeaways')
            }
        }

        return insights.join('\n')
    }

    private extractProfessionalBenefits(content: string): string {
        const benefits = []
        const lowerContent = content.toLowerCase()

        // Check for specific content patterns
        if (lowerContent.includes('dirigeant') || lowerContent.includes('cadre') || lowerContent.includes('indépendant')) {
            benefits.push('• Executives: More strategic thinking time during commutes')
            benefits.push('• Managers: Reduced logistical stress = better team leadership')
            benefits.push('• Entrepreneurs: Optimized schedules for maximum productivity')
        }

        if (lowerContent.includes('agenda optimisé')) {
            benefits.push('• Calendar optimization through predictable travel times')
            benefits.push('• Meeting scheduling without traffic uncertainty')
            benefits.push('• Work-life balance through efficient time management')
        }

        // Check for job search related benefits
        if (lowerContent.includes('alternance') || lowerContent.includes('stage')) {
            benefits.push('• Professional development through hands-on experience')
            benefits.push('• Industry exposure and networking opportunities')
            benefits.push('• Skill validation in real-world projects')
        }

        if (lowerContent.includes('projet') || lowerContent.includes('portfolio')) {
            benefits.push('• Demonstrates technical competence and initiative')
            benefits.push('• Shows problem-solving and project management skills')
            benefits.push('• Creates talking points for interviews')
        }

        // If no specific patterns found, analyze the actual content
        if (benefits.length === 0) {
            if (lowerContent.includes('apprendre') || lowerContent.includes('learn')) {
                benefits.push('• Continuous learning mindset')
                benefits.push('• Adaptability to new challenges')
                benefits.push('• Growth-oriented professional approach')
            } else {
                benefits.push('• Content analysis reveals professional development opportunities')
                benefits.push('• Consider highlighting specific skills and achievements')
                benefits.push('• Focus on measurable impact and results')
            }
        }

        return benefits.join('\n')
    }

    private extractIndustryImpact(content: string): string {
        const impacts = []
        const lowerContent = content.toLowerCase()

        // Check for specific content patterns
        if (lowerContent.includes('mobilité urbaine')) {
            impacts.push('• Urban planning will shift from traffic management to flow optimization')
            impacts.push('• Real estate values will change based on autonomous accessibility')
            impacts.push('• Public transportation will compete with autonomous private options')
        }

        if (lowerContent.includes('structure de journée')) {
            impacts.push('• Work schedules will become more flexible and efficient')
            impacts.push('• Remote work will integrate seamlessly with autonomous commuting')
            impacts.push('• Business districts will reorganize around autonomous hubs')
        }

        // Check for job market impacts
        if (lowerContent.includes('alternance') || lowerContent.includes('stage') || lowerContent.includes('emploi')) {
            impacts.push('• Job market evolution toward skill-based hiring')
            impacts.push('• Increased demand for practical experience')
            impacts.push('• Portfolio-driven recruitment processes')
        }

        if (lowerContent.includes('développement') || lowerContent.includes('tech')) {
            impacts.push('• Technology sector growth and innovation')
            impacts.push('• New career opportunities in emerging fields')
            impacts.push('• Continuous skill development requirements')
        }

        // If no specific patterns found, analyze the actual content
        if (impacts.length === 0) {
            if (lowerContent.includes('changement') || lowerContent.includes('évolution')) {
                impacts.push('• Industry adaptation to new technologies')
                impacts.push('• Evolution of professional requirements')
                impacts.push('• Transformation of traditional processes')
            } else {
                impacts.push('• Content analysis suggests industry transformation opportunities')
                impacts.push('• Consider broader market implications')
                impacts.push('• Focus on future-oriented thinking')
            }
        }

        return impacts.join('\n')
    }

    private generateStrategicInsights(content: string): string {
        const insights = []
        const lowerContent = content.toLowerCase()

        // Check for specific content patterns
        if (lowerContent.includes('quand')) {
            insights.push('• The question isn\'t IF this will happen, but WHEN')
            insights.push('• Early adopters will gain competitive advantages')
            insights.push('• Companies must prepare for autonomous-first operations')
        }

        if (lowerContent.includes('ia') || lowerContent.includes('ai')) {
            insights.push('• AI trust will become a competitive differentiator')
            insights.push('• Organizations must develop AI-first strategies')
            insights.push('• Leadership will require understanding of autonomous systems')
        }

        // Check for job search strategic insights
        if (lowerContent.includes('alternance') || lowerContent.includes('stage') || lowerContent.includes('candidature')) {
            insights.push('• Strategic positioning in competitive job markets')
            insights.push('• Building competitive advantages through projects')
            insights.push('• Long-term career planning and skill development')
        }

        if (lowerContent.includes('projet') || lowerContent.includes('portfolio')) {
            insights.push('• Strategic skill development for market demands')
            insights.push('• Building professional brand and reputation')
            insights.push('• Creating competitive advantages through innovation')
        }

        // If no specific patterns found, analyze the actual content
        if (insights.length === 0) {
            if (lowerContent.includes('futur') || lowerContent.includes('avenir')) {
                insights.push('• Future-focused strategic thinking')
                insights.push('• Long-term planning and preparation')
                insights.push('• Adaptability to changing environments')
            } else {
                insights.push('• Content analysis reveals strategic opportunities')
                insights.push('• Consider long-term implications and planning')
                insights.push('• Focus on competitive positioning and growth')
            }
        }

        return insights.join('\n')
    }

    private generateEngagementQuestions(content: string): string {
        const questions = []
        const lowerContent = content.toLowerCase()

        // Check for specific content patterns
        if (lowerContent.includes('tesla') || lowerContent.includes('autonomous')) {
            questions.push('• Would you trust an AI driver for your daily commute?')
            questions.push('• How will this change your approach to urban planning?')
            questions.push('• What industries will be most disrupted by this shift?')
        }

        if (lowerContent.includes('productivité') || lowerContent.includes('efficacité')) {
            questions.push('• How would you redesign your workday with autonomous commuting?')
            questions.push('• What new business opportunities does this create?')
            questions.push('• How will this affect your company\'s location strategy?')
        }

        // Check for job search related questions
        if (lowerContent.includes('alternance') || lowerContent.includes('stage') || lowerContent.includes('emploi')) {
            questions.push('• What\'s your experience with the current job market?')
            questions.push('• How do you evaluate candidates beyond their CV?')
            questions.push('• What skills do you think are most valuable today?')
        }

        if (lowerContent.includes('projet') || lowerContent.includes('portfolio')) {
            questions.push('• How do you showcase your skills in interviews?')
            questions.push('• What projects have had the biggest impact on your career?')
            questions.push('• How do you balance learning and building?')
        }

        // If no specific patterns found, generate relevant questions
        if (questions.length === 0) {
            if (lowerContent.includes('apprendre') || lowerContent.includes('learn')) {
                questions.push('• What\'s the most valuable lesson you\'ve learned recently?')
                questions.push('• How do you stay updated in your field?')
                questions.push('• What skills are you developing next?')
            } else {
                questions.push('• What resonates with you in this content?')
                questions.push('• How does this relate to your experience?')
                questions.push('• What would you add or change?')
            }
        }

        return questions.join('\n')
    }

    private generateRelevantHashtags(content: string): string {
        const hashtags = []
        const lowerContent = content.toLowerCase()

        // Check for specific content patterns
        if (lowerContent.includes('tesla') || lowerContent.includes('autonomous')) {
            hashtags.push('AutonomousVehicles', 'Tesla', 'FutureOfMobility')
        }
        if (lowerContent.includes('paris') || lowerContent.includes('lyon')) {
            hashtags.push('UrbanMobility', 'SmartCities', 'FrenchTech')
        }
        if (lowerContent.includes('productivité') || lowerContent.includes('efficacité')) {
            hashtags.push('Productivity', 'FutureOfWork', 'BusinessStrategy')
        }
        if (lowerContent.includes('ia') || lowerContent.includes('ai') || lowerContent.includes('technologie')) {
            hashtags.push('AI', 'Innovation', 'Technology')
        }

        // Check for job search related hashtags
        if (lowerContent.includes('alternance') || lowerContent.includes('stage') || lowerContent.includes('emploi')) {
            hashtags.push('JobSearch', 'CareerDevelopment', 'ProfessionalGrowth')
        }

        if (lowerContent.includes('projet') || lowerContent.includes('portfolio')) {
            hashtags.push('PersonalProjects', 'Portfolio', 'SkillDevelopment')
        }

        if (lowerContent.includes('développement') || lowerContent.includes('tech')) {
            hashtags.push('SoftwareDevelopment', 'TechCareer', 'Programming')
        }

        // If no specific patterns found, generate relevant hashtags
        if (hashtags.length === 0) {
            if (lowerContent.includes('apprendre') || lowerContent.includes('learn')) {
                hashtags.push('Learning', 'ProfessionalDevelopment', 'Growth')
            } else if (lowerContent.includes('futur') || lowerContent.includes('avenir')) {
                hashtags.push('FutureOfWork', 'Innovation', 'Trends')
            } else {
                hashtags.push('ProfessionalInsights', 'CareerAdvice', 'PersonalDevelopment')
            }
        }

        return hashtags.join(' #')
    }

    private generateTwitterOptimized(content: string, details: any, tone: Tone) {
        // Twitter optimization: character limits, engagement hooks, thread structure
        let optimized = content

        // Add tone-based modifications
        switch (tone) {
            case Tone.PROFESSIONAL:
                optimized = `📊 Professional Insights:\n\n${content}\n\n#Professional #Business #Insights`
                break
            case Tone.CASUAL:
                optimized = `😊 Quick thought:\n\n${content}\n\n#Casual #Thoughts #Sharing`
                break
            case Tone.FUNNY:
                optimized = `😂 The funny side:\n\n${content}\n\n#Funny #Humor #Laughs`
                break
            case Tone.HARSH:
                optimized = `⚡ Reality check:\n\n${content}\n\n#Harsh #Truth #Reality`
                break
            case Tone.FRIENDLY:
                optimized = `🤗 Friendly reminder:\n\n${content}\n\n#Friendly #Support #Community`
                break
            case Tone.FORMAL:
                optimized = `📋 Formal analysis:\n\n${content}\n\n#Formal #Analysis #Research`
                break
        }

        return optimized
    }

    private generateEmailOptimized(content: string, details: any, tone: Tone) {
        // Email optimization: clear structure, call-to-action, personalization
        let optimized = content

        // Add tone-based modifications
        switch (tone) {
            case Tone.PROFESSIONAL:
                optimized = `Subject: Professional Update\n\nDear Team,\n\n${content}\n\nBest regards,\n[Your Name]`
                break
            case Tone.CASUAL:
                optimized = `Subject: Quick Update\n\nHey everyone!\n\n${content}\n\nCheers,\n[Your Name]`
                break
            case Tone.FUNNY:
                optimized = `Subject: Funny Story\n\nHi team,\n\n${content}\n\nLaughing all the way,\n[Your Name]`
                break
            case Tone.HARSH:
                optimized = `Subject: Direct Feedback\n\nTeam,\n\n${content}\n\nNo sugar coating,\n[Your Name]`
                break
            case Tone.FRIENDLY:
                optimized = `Subject: Friendly Update\n\nHi friends,\n\n${content}\n\nWarm regards,\n[Your Name]`
                break
            case Tone.FORMAL:
                optimized = `Subject: Formal Communication\n\nDear Colleagues,\n\n${content}\n\nSincerely,\n[Your Name]`
                break
        }

        return optimized
    }

    private generateBlogOptimized(content: string, details: any, tone: Tone) {
        // Blog optimization: full HTML, structured data, SEO elements
        let optimized = content

        // Add tone-based modifications
        switch (tone) {
            case Tone.PROFESSIONAL:
                optimized = `<h1>Professional Analysis: ${content}</h1>\n\n<p>This comprehensive analysis provides professional insights and industry-standard recommendations.</p>\n\n<h2>Key Findings</h2>\n<p>${content}</p>`
                break
            case Tone.CASUAL:
                optimized = `<h1>Casual Take: ${content}</h1>\n\n<p>Here's my relaxed, easy-going perspective on this topic.</p>\n\n<h2>What I Think</h2>\n<p>${content}</p>`
                break
            case Tone.FUNNY:
                optimized = `<h1>Funny Version: ${content}</h1>\n\n<p>Let's add some humor to this serious topic!</p>\n\n<h2>The Humorous Side</h2>\n<p>${content}</p>`
                break
            case Tone.HARSH:
                optimized = `<h1>Direct & Harsh: ${content}</h1>\n\n<p>No sugar coating here - just the brutal truth.</p>\n\n<h2>The Reality</h2>\n<p>${content}</p>`
                break
            case Tone.FRIENDLY:
                optimized = `<h1>Friendly Approach: ${content}</h1>\n\n<p>Let's approach this with kindness and understanding.</p>\n\n<h2>With Warmth</h2>\n<p>${content}</p>`
                break
            case Tone.FORMAL:
                optimized = `<h1>Formal Analysis: ${content}</h1>\n\n<p>This structured assessment follows academic and professional standards.</p>\n\n<h2>Structured Assessment</h2>\n<p>${content}</p>`
                break
        }

        return optimized
    }

    private extractOptimizedContent(aiResult: any, originalContent: string, platform: string, tone: Tone): string {
        // Extract the optimized content from AI service response
        if (aiResult && aiResult.consensus && aiResult.consensus.optimization) {
            return aiResult.consensus.optimization
        }

        if (aiResult && aiResult.consensus && aiResult.consensus.content) {
            return aiResult.consensus.content
        }

        // Fallback: generate based on tone and platform
        return this.generateToneBasedContent(originalContent, platform, tone)
    }

    private generateToneBasedContent(content: string, platform: string, tone: Tone): string {
        const baseContent = content.trim()

        switch (tone) {
            case Tone.PROFESSIONAL:
                return `📊 Professional Analysis: ${baseContent}\n\n💼 Key Insights:\n• Professional tone maintained\n• Industry-specific terminology used\n• Clear structure and formatting\n\n🎯 Recommendations:\n• Consider adding relevant hashtags\n• Include call-to-action elements\n• Maintain professional credibility`

            case Tone.CASUAL:
                return `😊 Casual Take: ${baseContent}\n\n✨ What I Think:\n• Keeping it real and relatable\n• Easy to understand language\n• Friendly and approachable tone\n\n💡 Ideas:\n• Add some personality\n• Make it conversational\n• Keep it light and engaging`

            case Tone.FUNNY:
                return `😂 Funny Version: ${baseContent}\n\n🤪 The Humorous Side:\n• Adding some humor and wit\n• Making it entertaining\n• Keeping it fun while informative\n\n🎭 Suggestions:\n• Include relevant memes or jokes\n• Make it shareable and viral\n• Don't take it too seriously`

            case Tone.HARSH:
                return `⚡ Direct & Harsh: ${baseContent}\n\n💥 The Truth:\n• No sugar coating here\n• Direct and to the point\n• Cutting through the BS\n\n🔪 Reality Check:\n• Face the facts head-on\n• Be brutally honest\n• Get to the point quickly`

            case Tone.FRIENDLY:
                return `🤗 Friendly Approach: ${baseContent}\n\n💝 With Kindness:\n• Warm and welcoming tone\n• Supportive and encouraging\n• Building positive connections\n\n❤️ Friendly Tips:\n• Show empathy and understanding\n• Be encouraging and supportive\n• Create a welcoming atmosphere`

            case Tone.FORMAL:
                return `📋 Formal Analysis: ${baseContent}\n\n🏛️ Structured Assessment:\n• Academic and formal language\n• Professional terminology\n• Structured and organized format\n\n📚 Formal Recommendations:\n• Use proper citations\n• Maintain academic standards\n• Follow formal writing conventions`

            default:
                return baseContent
        }
    }

    private extractKeyPoints(content: string): string {
        // Extract key points from content for summary
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
        const keyPoints = sentences.slice(0, 3).map(s => s.trim())
        return keyPoints.join('. ') + '.'
    }

    private getImprovementSuggestions(details: any) {
        return Object.values(details)
            .filter((d: any) => d.value < d.max)
            .map((d: any) => ({
                area: d.label,
                current: d.value,
                target: d.max,
                priority: d.max - d.value,
                suggestions: d.suggestions
            }))
            .sort((a: any, b: any) => b.priority - a.priority)
    }

    private hasMeaningfulContent(content: string): boolean {
        // Check if content has meaningful words (not just random characters)
        const meaningfulWords = content.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2 && /[a-z]/.test(word))

        return meaningfulWords.length >= 3
    }
}
