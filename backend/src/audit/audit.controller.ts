import { Controller, Post, Body } from '@nestjs/common'
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Post('evaluate')
    async evaluate(@Body() body: { url?: string; content?: string; platform?: string }) {
        if (body.url) {
            return this.auditService.evaluateUrl(body.url)
        } else if (body.content) {
            return this.auditService.evaluateContent(body.content, body.platform || 'blog')
        }
        throw new Error('Either URL or content must be provided')
    }

    @Post('optimize')
    async optimizeContent(@Body() body: { content: string; platform?: string }) {
        const { content, platform = 'blog' } = body
        return this.auditService.optimizeContent(content, platform)
    }
}


