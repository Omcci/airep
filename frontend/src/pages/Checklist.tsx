import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

function ChecklistPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['checklist'], queryFn: api.getChecklist })

  if (isLoading) return <div className="p-6">Chargement…</div>
  if (error) return <div className="p-6 text-red-600">{String((error as Error).message)}</div>

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">{data!.title}</h1>
      <div className="mt-6 space-y-8">
        {data!.groups.map((g) => (
          <section key={g.id} className="space-y-2">
            <h2 className="text-lg font-medium">{g.title}</h2>
            <ul className="list-disc pl-6 text-gray-700">
              {g.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

export default ChecklistPage


