import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Reveal from '@/components/Reveal'
import { Input } from '@/components/ui/input'
import { useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function GlossaryPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['glossary'], queryFn: api.getGlossary })
  const [q, setQ] = useState('')
  const [tab, setTab] = useState<'all' | 'a-m' | 'n-z'>('all')
  const filtered = useMemo(() => {
    if (!data) return []
    const s = q.toLowerCase()
    const searched = data.filter((t) => t.term.toLowerCase().includes(s) || t.definition.toLowerCase().includes(s))
    if (tab === 'all') return searched
    return searched.filter((t) => {
      const first = (t.term.trim()[0] || '').toLowerCase()
      if (first < 'a' || first > 'z') return false
      if (tab === 'a-m') return first >= 'a' && first <= 'm'
      return first >= 'n' && first <= 'z'
    })
  }, [data, q, tab])

  if (isLoading) return <div className="p-6">Loading…</div>
  if (error) return <div className="p-6 text-red-600">{String((error as Error).message)}</div>

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="sticky top-16 z-10 rounded-md border bg-background/80 p-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold">Glossary</h1>
          <div className="grow max-w-md">
            <Input placeholder="Search terms…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mt-2">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="a-m">A–M</TabsTrigger>
            <TabsTrigger value="n-z">N–Z</TabsTrigger>
          </TabsList>
          <TabsContent value="all" />
          <TabsContent value="a-m" />
          <TabsContent value="n-z" />
        </Tabs>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t, i) => (
          <Reveal key={i}>
            <Card className="text-sm">
              <CardHeader>
                <CardTitle className="text-base">{t.term}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t.definition}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default GlossaryPage


