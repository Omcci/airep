import { Content, ContentType } from '../entities/content.entity'

export interface ContentExtractionPort {
    extractFromUrl(url: string): Promise<ExtractedContent>
    validateUrl(url: string): Promise<boolean>
}

export interface ExtractedContent {
    text: string
    metadata: {
        title?: string
        author?: string
        publishedAt?: Date
        source?: string
        tags?: string[]
    }
    success: boolean
    error?: string
}

export interface ContentFactory {
    createFromText(text: string, type: ContentType): Content
    createFromUrl(url: string, type: ContentType): Promise<Content>
}
