import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function ReportPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['report'], queryFn: api.getReport })

  if (isLoading) return <div className="p-6">Chargement…</div>
  if (error) return <div className="p-6 text-red-600">{String((error as Error).message)}</div>

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{data!.title}</h1>
      <div className="space-y-4 text-sm text-gray-600">
        <p>Résumé: master structure, specificity, accessibility and authority to be cited by LLMs.
        </p>
      </div>
      <div className="space-y-6">
        {data!.sections.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle className="text-xl">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {s.paragraphs?.map((p, i) => (
                <p key={i} className="text-gray-700">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="list-disc pl-6 text-gray-700">
                  {s.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ReportPage


