import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function ChecklistPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['checklist'], queryFn: api.getChecklist })

  if (isLoading) return <div className="p-6">Chargement…</div>
  if (error) return <div className="p-6 text-red-600">{String((error as Error).message)}</div>

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{data!.title}</h1>
      <div className="space-y-6">
        {data!.groups.map((g) => (
          <Card key={g.id}>
            <CardHeader>
              <CardTitle className="text-lg">{g.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 text-gray-700">
                {g.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ChecklistPage


