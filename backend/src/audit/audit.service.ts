import { Injectable } from '@nestjs/common'

@Injectable()
export class AuditService {
    async evaluateUrl(url: string) {
        try {
            const res = await fetch(url)
            const html = await res.text()
            return this.evaluateContent(html)
        } catch {
            throw new Error('Failed to fetch URL')
        }
    }

    async evaluateContent(content: string) {
        const metrics = this.evaluateText(content)
        const score = this.computeScore(metrics)
        const details = this.buildDetails(metrics)
        const recommendations = this.buildRecommendations(details)

        return { score, details, recommendations }
    }

    async optimizeContent(content: string) {
        const analysis = await this.evaluateContent(content)
        const optimized = this.generateOptimizedVersion(content, analysis.details)

        return {
            original: analysis,
            optimized: {
                content: optimized,
                improvements: this.getImprovementSuggestions(analysis.details)
            }
        }
    }

    private evaluateText(text: string) {
        const lower = text.toLowerCase()
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

    private computeScore(metrics: ReturnType<AuditService['evaluateText']>) {
        const weights = {
            structure: 2,
            semantics: 2,
            faq: 1,
            specificity: 2,
            summary: 1,
            conversational: 2,
            authority: 1
        }
        const raw = Object.entries(metrics).reduce((sum, [key, value]) => {
            return sum + (value * weights[key as keyof typeof weights])
        }, 0)
        const max = Object.values(weights).reduce((sum, weight) => sum + (weight * 2), 0)
        return Math.round((raw / max) * 100)
    }

    private buildDetails(metrics: ReturnType<AuditService['evaluateText']>) {
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
                    'Provide a concise meta description',
                ],
            },
            faq: {
                label: 'Q&A Format',
                value: metrics.faq,
                max: 1,
                description: 'Direct Q→A sections are easy to reuse in AI responses',
                why: 'FAQs align with conversational retrieval and summarization',
                suggestions: [
                    'Add a FAQ section answering common queries',
                    'Mark it up with FAQPage schema',
                ],
            },
            specificity: {
                label: 'Specificity & Examples',
                value: metrics.specificity,
                max: 2,
                description: 'Numbers, examples, and concrete details make content quotable',
                why: 'Precise claims are more likely to be cited verbatim by AI',
                suggestions: [
                    'Add benchmarks, metrics, and study links',
                    'Use concrete examples with figures',
                ],
            },
            summary: {
                label: 'Upfront Summary',
                value: metrics.summary,
                max: 1,
                description: 'An opening summary increases reuse of your phrasing',
                why: 'AI models often lift the first concise summary for answers',
                suggestions: [
                    'Add a short executive summary at the top',
                    'Provide TL;DR for long articles',
                ],
            },
            conversational: {
                label: 'Conversational Phrasing',
                value: metrics.conversational,
                max: 1,
                description: 'Use natural prompts and how-to phrasing',
                why: 'Matches how users query AI systems ("how to…", "best way…")',
                suggestions: [
                    'Include headings like "How to …" and "Best way to …"',
                    'Add step-by-step sections and checklists',
                ],
            },
            authority: {
                label: 'Authority & Citations',
                value: metrics.authority,
                max: 1,
                description: 'Reference credible sources and studies',
                why: 'Cited information builds trust and improves AI attribution',
                suggestions: [
                    'Link to authoritative sources and research',
                    'Include case studies and real examples',
                ],
            },
        }
    }

    private buildRecommendations(details: ReturnType<AuditService['buildDetails']>) {
        const entries = Object.values(details).map((d) => ({
            key: d.label,
            gap: Math.max(0, d.max - d.value),
            suggestions: d.suggestions,
        }))
        entries.sort((a, b) => b.gap - a.gap)
        const recs: string[] = []
        for (const e of entries) {
            if (e.gap <= 0) continue
            recs.push(`${e.key}: ${e.suggestions[0]}`)
            if (recs.length >= 5) break
        }
        return recs
    }

    private generateOptimizedVersion(content: string, details: any) {
        // This would integrate with an AI service to generate optimized content
        // For now, return a template with suggestions
        let optimized = content

        if (details.summary.value === 0) {
            optimized = `<h2>Summary</h2>\n<p>[AI-optimized summary will be generated here]</p>\n\n${optimized}`
        }

        if (details.faq.value === 0) {
            optimized += `\n\n<h2>Frequently Asked Questions</h2>\n<div itemscope itemtype="https://schema.org/FAQPage">\n  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">\n    <h3 itemprop="name">[Common question 1]</h3>\n    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">\n      <div itemprop="text">[AI-generated answer]</div>\n    </div>\n  </div>\n</div>`
        }

        return optimized
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
}
