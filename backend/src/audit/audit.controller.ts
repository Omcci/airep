import { Body, Controller, Post } from '@nestjs/common'
import { IsOptional, IsString, IsUrl, MinLength, ValidateIf } from 'class-validator'

class AuditRequestDto {
    @IsOptional()
    @IsUrl({ require_tld: false }, { message: 'url invalide' })
    url?: string

    @ValidateIf((o) => !o.url)
    @IsString()
    @MinLength(20)
    content?: string
}

@Controller('audit')
export class AuditController {
    @Post('evaluate')
    async evaluate(@Body() body: AuditRequestDto) {
        const text = await this.resolveText(body)
        const metrics = this.evaluateText(text)
        const score = this.computeScore(metrics)
        const details = this.buildDetails(metrics)
        const recommendations = this.buildRecommendations(details)
        return { score, metrics, details, recommendations }
    }

    private async resolveText(body: AuditRequestDto): Promise<string> {
        if (body.content && body.content.trim().length > 0) return body.content
        if (body.url) {
            try {
                const res = await fetch(body.url)
                const html = await res.text()
                return html
            } catch {
                return ''
            }
        }
        return ''
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
        const hasSummary = /(résumé|summary|en bref|tl;dr)/i.test(text)
        const conversational = /(comment|meilleure méthode|how to|best way)/i.test(lower)

        return {
            structure: Number(hasH1) + Number(hasH2) + Number(hasList),
            semantics: Number(hasSchema) + Number(hasMetaDesc),
            faq: Number(hasFaq),
            specificity: Number(hasNumbers),
            summary: Number(hasSummary),
            conversational: Number(conversational),
        }
    }

    private computeScore(m: ReturnType<AuditController['evaluateText']>) {
        const weights = { structure: 2, semantics: 2, faq: 1, specificity: 2, summary: 1, conversational: 2 }
        const raw =
            m.structure * weights.structure +
            m.semantics * weights.semantics +
            m.faq * weights.faq +
            m.specificity * weights.specificity +
            m.summary * weights.summary +
            m.conversational * weights.conversational
        const max = 2 * weights.structure + 2 * weights.semantics + 1 * weights.faq + 2 * weights.specificity + 1 * weights.summary + 2 * weights.conversational
        return Math.round((raw / max) * 100)
    }

    private buildDetails(m: ReturnType<AuditController['evaluateText']>) {
        return {
            structure: {
                label: 'Structure',
                value: m.structure,
                max: 3,
                description: 'Headings and lists help models extract quotable chunks.',
                why: 'Clear H1/H2/H3 and bullet points increase passage‑level retrieval quality.',
                suggestions: [
                    'Add a single H1, then H2/H3 for sections',
                    'Use bullet lists for steps/benefits',
                    'Keep paragraphs short (1 idea each)'
                ],
            },
            semantics: {
                label: 'Structured data & meta',
                value: m.semantics,
                max: 2,
                description: 'Schema.org and meta description clarify page intent.',
                why: 'Machine‑readable markup improves understanding and attribution.',
                suggestions: [
                    'Add Schema.org (FAQPage, HowTo, Article)',
                    'Provide a concise meta description',
                ],
            },
            faq: {
                label: 'Q&A format',
                value: m.faq,
                max: 1,
                description: 'Direct Q→A sections are easy to reuse in LLM answers.',
                why: 'FAQs align with conversational retrieval and summarization.',
                suggestions: [
                    'Add a FAQ section answering common queries',
                    'Mark it up with FAQPage schema',
                ],
            },
            specificity: {
                label: 'Specificity',
                value: m.specificity,
                max: 1,
                description: 'Numbers and concrete examples make content quotable.',
                why: 'Precise claims are more likely to be cited verbatim.',
                suggestions: [
                    'Add benchmarks, metrics, and study links',
                    'Use concrete examples with figures',
                ],
            },
            summary: {
                label: 'Upfront summary',
                value: m.summary,
                max: 1,
                description: 'An opening summary increases reuse of your phrasing.',
                why: 'Models often lift the first concise summary for answers.',
                suggestions: [
                    'Add a short executive summary at the top',
                    'Provide TL;DR for long articles',
                ],
            },
            conversational: {
                label: 'Conversational phrasing',
                value: m.conversational,
                max: 2,
                description: 'Use natural prompts and how‑to phrasing.',
                why: 'Matches how users query LLMs (“how to…”, “best way…”)',
                suggestions: [
                    'Include headings like “How to …” and “Best way to …”',
                    'Add step‑by‑step sections and checklists',
                ],
            },
        }
    }

    private buildRecommendations(details: ReturnType<AuditController['buildDetails']>) {
        // Prioritize metrics with largest improvement potential
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
}


