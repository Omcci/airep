export type ReportSection = {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

export type Report = {
  title: string
  sections: ReportSection[]
}

export type ChecklistGroup = {
  id: string
  title: string
  items: string[]
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


