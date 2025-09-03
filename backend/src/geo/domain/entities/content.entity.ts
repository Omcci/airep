export class Content {
    constructor(
        public readonly id: string,
        public readonly text: string,
        public readonly type: ContentType,
        public readonly url?: string,
        public readonly metadata?: ContentMetadata
    ) { }

    public getWordCount(): number {
        return this.text.split(/\s+/).length
    }

    public hasSubstantialContent(): boolean {
        return this.getWordCount() >= 50
    }

    public isUrl(): boolean {
        return this.url !== undefined
    }
}

export enum ContentType {
    TOOL = 'tool',
    ARTICLE = 'article',
    DOCUMENTATION = 'documentation',
    API = 'api'
}

export interface ContentMetadata {
    title?: string
    author?: string
    publishedAt?: Date
    source?: string
    tags?: string[]
}
