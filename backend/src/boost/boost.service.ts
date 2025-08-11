import { Injectable } from '@nestjs/common'

@Injectable()
export class BoostService {
    generateToolBoost(input: {
        name: string
        homepage: string
        tagline?: string
        description?: string
        categories?: string[]
        pricing?: string
        signupUrl?: string
        endpoints?: Array<{ method: string; path: string; description: string }>
        examples?: Array<{ title: string; prompt?: string; steps?: string[] }>
    }) {
        const now = new Date().toISOString()

        const llmSnippet = [
            `${input.name} — ${input.tagline || 'AI tool'}`,
            input.description || '',
            input.categories?.length ? `Categories: ${input.categories.join(', ')}` : '',
            input.pricing ? `Pricing: ${input.pricing}` : '',
            `Homepage: ${input.homepage}`,
            input.signupUrl ? `Signup: ${input.signupUrl}` : '',
            input.endpoints?.length ? 'Endpoints:' : '',
            ...(input.endpoints || []).map(e => `- ${e.method.toUpperCase()} ${e.path} — ${e.description}`),
            input.examples?.length ? 'Examples:' : '',
            ...(input.examples || []).map(ex => `- ${ex.title}${ex.prompt ? ` — prompt: ${ex.prompt}` : ''}`),
        ].filter(Boolean).join('\n')

        const softwareJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: input.name,
            description: input.description || input.tagline || 'AI tool',
            applicationCategory: 'DeveloperApplication',
            softwareHelp: input.homepage,
            sameAs: input.homepage,
            url: input.homepage,
            keywords: input.categories?.join(', '),
            offers: input.pricing ? { '@type': 'Offer', description: input.pricing } : undefined,
            dateModified: now,
        }

        const faqJsonLd = (input.examples || []).length
            ? {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: (input.examples || []).map(ex => ({
                    '@type': 'Question',
                    name: ex.title,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: ex.steps?.length ? ex.steps.map(s => `- ${s}`).join('\n') : ex.prompt || 'See docs',
                    },
                })),
            }
            : undefined

        return {
            snippet: llmSnippet,
            jsonld: {
                softwareApplication: softwareJsonLd,
                faq: faqJsonLd,
            },
            metadata: {
                generatedAt: now,
                kind: 'tool',
            },
        }
    }

    generateArticleBoost(input: {
        title: string
        url: string
        body: string
        summary?: string
        authorName?: string
        datePublished?: string
    }) {
        const now = new Date().toISOString()

        const tlDr = input.summary || this.makeSummary(input.body)
        const quotes = this.extractQuotes(input.body)
        const qa = this.generateQA(input.body)

        const articleJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: input.title,
            url: input.url,
            author: input.authorName ? { '@type': 'Person', name: input.authorName } : undefined,
            datePublished: input.datePublished,
            dateModified: now,
            description: tlDr,
        }

        const faqJsonLd = qa.length
            ? {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: qa.map(q => ({
                    '@type': 'Question',
                    name: q.q,
                    acceptedAnswer: { '@type': 'Answer', text: q.a },
                })),
            }
            : undefined

        const howToJsonLd = this.buildHowTo(input.body)

        const llmAnswerPack = {
            url: input.url,
            title: input.title,
            tl_dr: tlDr,
            quotes,
            qa,
            updatedAt: now,
        }

        return {
            snippet: `${input.title} — TL;DR: ${tlDr}\nCite: ${quotes[0] || ''}`.trim(),
            jsonld: {
                article: articleJsonLd,
                faq: faqJsonLd,
                howTo: howToJsonLd,
            },
            feed: llmAnswerPack,
            metadata: { generatedAt: now, kind: 'article' },
        }
    }

    private makeSummary(body: string): string {
        const first = body.replace(/\s+/g, ' ').slice(0, 220)
        return first.endsWith('.') ? first : first + '…'
    }

    private extractQuotes(body: string): string[] {
        const sentences = body.split(/(?<=[.!?])\s+/).filter(s => s.length > 40)
        return sentences.slice(0, 3)
    }

    private generateQA(body: string): Array<{ q: string; a: string }> {
        // naive heuristic: derive 3 questions from headings and key phrases
        const lines = body.split(/\n+/)
        const headings = lines.filter(l => /^#{1,3}\s|<h[1-3]/i.test(l)).slice(0, 3)
        const qs = headings.map((h, i) => ({
            q: h.replace(/[#<\/>h\d]/g, '').trim() || `What is key point ${i + 1}?`,
            a: this.makeSummary(body.slice(0, 500)),
        }))
        return qs
    }

    private buildHowTo(body: string) {
        const stepLines = body.split(/\n/).filter(l => /^[-*]\s|^\d+\./.test(l))
        if (!stepLines.length) return undefined
        return {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to accomplish the task',
            step: stepLines.slice(0, 8).map(l => ({ '@type': 'HowToStep', text: l.replace(/^[-*]\s|^\d+\.\s/, '') })),
        }
    }
}
