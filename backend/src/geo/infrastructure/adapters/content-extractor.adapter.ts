import { Injectable } from '@nestjs/common'
import { ContentExtractionPort, ExtractedContent, ContentFactory } from '../../domain/ports/content-extraction.port'
import { Content, ContentType } from '../../domain/entities/content.entity'
import { ProxyService } from '../../../proxy/proxy.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class ContentExtractorAdapter implements ContentExtractionPort, ContentFactory {
    constructor(private readonly proxyService: ProxyService) { }

    async extractFromUrl(url: string): Promise<ExtractedContent> {
        try {
            const content = await this.proxyService.fetchContent(url)

            return {
                text: content,
                metadata: {
                    source: url
                },
                success: true
            }
        } catch (error) {
            return {
                text: '',
                metadata: {},
                success: false,
                error: error.message
            }
        }
    }

    async validateUrl(url: string): Promise<boolean> {
        try {
            const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
            if (!urlPattern.test(url)) {
                return false
            }

            // Optional: Check if URL is reachable
            const result = await this.extractFromUrl(url)
            return result.success
        } catch {
            return false
        }
    }

    createFromText(text: string, type: ContentType): Content {
        return new Content(
            uuidv4(),
            text,
            type,
            undefined,
            {
                source: 'direct_input'
            }
        )
    }

    async createFromUrl(url: string, type: ContentType): Promise<Content> {
        const isValidUrl = await this.validateUrl(url)
        if (!isValidUrl) {
            throw new Error(`Invalid or unreachable URL: ${url}`)
        }

        const extractedContent = await this.extractFromUrl(url)
        if (!extractedContent.success) {
            throw new Error(`Failed to extract content from URL: ${extractedContent.error}`)
        }

        return new Content(
            uuidv4(),
            extractedContent.text,
            type,
            url,
            extractedContent.metadata
        )
    }
}
