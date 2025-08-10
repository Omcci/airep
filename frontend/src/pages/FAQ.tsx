import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Reveal from '@/components/Reveal'

function FAQPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['faq'], queryFn: api.getFAQ })

  if (isLoading) return <div className="p-6">Chargement…</div>
  if (error) return <div className="p-6 text-red-600">{String((error as Error).message)}</div>

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">FAQ</h1>
      <div className="space-y-4">
        {data!.map((q, i) => (
          <Reveal key={i}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{q.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{q.answer}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default FAQPage


