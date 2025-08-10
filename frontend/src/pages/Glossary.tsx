import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function GlossaryPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['glossary'], queryFn: api.getGlossary })

  if (isLoading) return <div className="p-6">Chargement…</div>
  if (error) return <div className="p-6 text-red-600">{String((error as Error).message)}</div>

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Glossaire</h1>
      <div className="space-y-3">
        {data!.map((t, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-lg">{t.term}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{t.definition}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default GlossaryPage


