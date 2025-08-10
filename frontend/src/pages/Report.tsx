import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

function ReportPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['report'], queryFn: api.getReport })

  if (isLoading) return <div className="p-6">Chargement…</div>
  if (error) return <div className="p-6 text-red-600">{String((error as Error).message)}</div>

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">{data!.title}</h1>
      <div className="mt-6 space-y-8">
        {data!.sections.map((s) => (
          <section key={s.id} className="space-y-3">
            <h2 className="text-xl font-medium">{s.title}</h2>
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
          </section>
        ))}
      </div>
    </div>
  )
}

export default ReportPage


