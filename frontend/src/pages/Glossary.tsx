import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

function GlossaryPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['glossary'], queryFn: api.getGlossary })

  if (isLoading) return <div className="p-6">Chargement…</div>
  if (error) return <div className="p-6 text-red-600">{String((error as Error).message)}</div>

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Glossaire</h1>
      <dl className="mt-6 space-y-4">
        {data!.map((t, i) => (
          <div key={i}>
            <dt className="font-medium">{t.term}</dt>
            <dd className="text-gray-700">{t.definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default GlossaryPage


