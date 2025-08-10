import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

function FAQPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['faq'], queryFn: api.getFAQ })

  if (isLoading) return <div className="p-6">Chargement…</div>
  if (error) return <div className="p-6 text-red-600">{String((error as Error).message)}</div>

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">FAQ</h1>
      <div className="mt-6 divide-y">
        {data!.map((q, i) => (
          <details key={i} className="py-4">
            <summary className="cursor-pointer text-lg font-medium">{q.question}</summary>
            <p className="mt-2 text-gray-700">{q.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

export default FAQPage


