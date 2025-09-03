export class CitationLikelihood {
    private readonly value: number

    constructor(value: number) {
        if (value < 0 || value > 100) {
            throw new Error('Citation likelihood must be between 0 and 100')
        }
        this.value = value
    }

    public getValue(): number {
        return this.value
    }

    public isHigh(): boolean {
        return this.value >= 80
    }

    public isMedium(): boolean {
        return this.value >= 60 && this.value < 80
    }

    public isLow(): boolean {
        return this.value < 60
    }

    public getCategory(): string {
        if (this.isHigh()) return 'High'
        if (this.isMedium()) return 'Medium'
        return 'Low'
    }

    public toString(): string {
        return `${this.value}%`
    }
}
