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
  auditEvaluate: (data: { url?: string; content?: string; platform?: string }) =>
    fetch('/api/audit/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  optimizeContent: (data: { content: string; platform: string; tone?: string }) =>
    fetch('/api/audit/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  // GEO Analysis
  geoAnalyze: (data: { content: string; contentType: string; url?: string }) =>
    fetch('/api/geo/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  // Tone variation generation
  generateToneVariation: async (data: { content: string; platform: string; tone: string }) => {
    const response = await fetch('/api/audit/tone-variation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to generate tone variation')
    return response.json()
  },

  // Redo optimization
  redoOptimization: async (data: { content: string; platform: string; tone?: string }) => {
    const response = await fetch('/api/audit/redo-optimization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to redo optimization')
    return response.json()
  }
}

export { fetchJSON }


