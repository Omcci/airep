import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Reveal from '@/components/Reveal'
import { CheckCircle2 } from 'lucide-react'

function ChecklistPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['checklist'], queryFn: api.getChecklist })

  if (isLoading) return <div className="p-6">Chargement…</div>
  if (error) return <div className="p-6 text-red-600">{String((error as Error).message)}</div>

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{data!.title}</h1>
      <div className="space-y-6">
        {data!.groups.map((g) => (
          <Reveal key={g.id}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{g.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  {g.items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                {g.sources && g.sources.length > 0 && (
                  <div className="pt-2 text-xs text-gray-500">
                    Sources:
                    <ul className="mt-1 list-disc pl-6">
                      {g.sources.map((src) => (
                        <li key={src.url}>
                          <a className="underline hover:text-primary" href={src.url} target="_blank" rel="noreferrer">
                            {src.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default ChecklistPage


