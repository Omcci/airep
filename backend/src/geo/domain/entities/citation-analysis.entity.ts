import { CitationLikelihood } from '../value-objects/citation-likelihood.vo'
import { GEOMetrics } from '../value-objects/geo-metrics.vo'

export class CitationAnalysis {
    constructor(
        public readonly likelihood: CitationLikelihood,
        public readonly quotableElements: QuotableElement[],
        public readonly citationContexts: CitationContext[],
        public readonly metrics: GEOMetrics
    ) { }

    public hasQuotableContent(): boolean {
        return this.quotableElements.length > 0
    }

    public hasCitationContexts(): boolean {
        return this.citationContexts.length > 0
    }

    public getHighValueElements(): QuotableElement[] {
        return this.quotableElements.filter(element => element.isHighValue())
    }
}

export class QuotableElement {
    constructor(
        public readonly text: string,
        public readonly type: QuotableElementType,
        public readonly confidence: number
    ) { }

    public isHighValue(): boolean {
        return this.confidence >= 0.8
    }

    public isSubstantial(): boolean {
        return this.text.length >= 10
    }
}

export enum QuotableElementType {
    QUOTE = 'quote',
    STATISTIC = 'statistic',
    FACT = 'fact',
    INSIGHT = 'insight',
    TECHNICAL_DETAIL = 'technical_detail'
}

export class CitationContext {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly relevance: number
    ) { }

    public isRelevant(): boolean {
        return this.relevance >= 0.7
    }
}
