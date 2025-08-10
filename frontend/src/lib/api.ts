import type { Report, Checklist, FAQItem, GlossaryTerm } from '../types/content'

const API_BASE = '/api'

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }
  return (await response.json()) as T
}

export const api = {
  getReport: () => fetchJSON<Report>('/content/report'),
  getChecklist: () => fetchJSON<Checklist>('/content/checklist'),
  getFAQ: () => fetchJSON<FAQItem[]>('/content/faq'),
  getGlossary: () => fetchJSON<GlossaryTerm[]>('/content/glossary'),
  auditEvaluate: (payload: { url?: string; content?: string }) =>
    fetchJSON<{ score: number; metrics: Record<string, number> }>(
      '/audit/evaluate',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    ),
}

export { fetchJSON }


