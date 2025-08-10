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
        return { score, metrics }
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
}


