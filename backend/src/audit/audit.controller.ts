import { Controller, Post, Body } from '@nestjs/common'
import { AuditService } from './audit.service'
import { Tone } from '../ai/dto/ai-analysis.dto'

@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Post('evaluate')
    async evaluate(@Body() body: { url?: string; content?: string; platform?: string }) {
        if (body.url) {
            // For URL evaluation, we'll treat the URL as content for now
            // In a real implementation, you might want to fetch the URL content first
            return this.auditService.evaluateContent(body.url, body.platform || 'blog')
        } else if (body.content) {
            return this.auditService.evaluateContent(body.content, body.platform || 'blog')
        }
        throw new Error('Either URL or content must be provided')
    }

    @Post('optimize')
    async optimizeContent(@Body() body: { content: string; platform?: string; tone?: Tone }) {
        const { content, platform = 'blog', tone = Tone.PROFESSIONAL } = body
        return this.auditService.optimizeContent(content, platform, tone)
    }

    @Post('tone-variation')
    async generateToneVariation(@Body() body: { content: string; platform: string; tone: Tone }) {
        const { content, platform, tone } = body
        return this.auditService.optimizeContent(content, platform, tone)
    }

    @Post('redo-optimization')
    async redoOptimization(@Body() body: { content: string; platform: string; tone?: Tone }) {
        const { content, platform, tone = Tone.PROFESSIONAL } = body
        return this.auditService.optimizeContent(content, platform, tone)
    }
}


