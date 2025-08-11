export type ReportSection = {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
  sources?: { title: string; url: string }[]
}

export type Report = {
  title: string
  sections: ReportSection[]
}

export type ChecklistGroup = {
  id: string
  title: string
  items: string[]
  sources?: { title: string; url: string }[]
}

export type Checklist = {
  title: string
  groups: ChecklistGroup[]
}

export type FAQItem = {
  question: string
  answer: string
}

export type GlossaryTerm = {
  term: string
  definition: string
}

export interface AuditResult {
  score: number
  details: Record<string, {
    label: string
    value: number
    max: number
    description: string
    why: string
    suggestions: string[]
  }>
  recommendations: string[]
}

export interface OptimizeResult {
  original: AuditResult
  optimized: {
    content: string
    improvements: Array<{
      area: string
      current: number
      target: number
      priority: number
      suggestions: string[]
    }>
  }
}


