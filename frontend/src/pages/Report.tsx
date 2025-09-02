import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Reveal from '@/components/Reveal'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

interface ReportSource {
  title: string
  url: string
}

interface ReportSection {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
  sources?: ReportSource[]
}



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
        {data!.sections.map((s: ReportSection) => (
          <Reveal key={s.id}>
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
              <Card className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {s.paragraphs?.map((p: string, i: number) => (
                    <p key={i} className="text-gray-700 dark:text-gray-300">
                      {p}
                    </p>
                  ))}
                  {s.bullets && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {s.bullets.map((b: string, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.35, delay: i * 0.05 }}
                        >
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <div className="flex cursor-default items-start gap-3 rounded-lg border bg-white/60 p-3 text-sm text-gray-800 shadow-sm transition-colors hover:bg-white dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200 dark:hover:bg-gray-900">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                <span>{b}</span>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80 text-xs">
                              <div className="text-gray-700 dark:text-gray-300">
                                This point enhances LLM retrieval and quoting by improving structure or authority.
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {s.sources && s.sources.length > 0 && (
                    <div className="pt-2 text-xs text-gray-500">
                      Sources:
                      <ul className="mt-1 list-disc pl-6">
                        {s.sources.map((src: ReportSource) => (
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
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default ReportPage


