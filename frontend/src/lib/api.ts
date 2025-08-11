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
  getReport: () => fetch('/api/content/report').then(res => res.json()),
  getChecklist: () => fetch('/api/content/checklist').then(res => res.json()),
  getFAQ: () => fetch('/api/content/faq').then(res => res.json()),
  getGlossary: () => fetch('/api/content/glossary').then(res => res.json()),
  auditEvaluate: (data: { url?: string; content?: string }) =>
    fetch('/api/audit/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  optimizeContent: (content: string) =>
    fetch('/api/audit/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    }).then(res => res.json()),
  boostTool: (payload: any) =>
    fetch('/api/boost/tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(res => res.json()),
  boostArticle: (payload: any) =>
    fetch('/api/boost/article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(res => res.json()),
}

export { fetchJSON }


