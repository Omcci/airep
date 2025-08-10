import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, CircleAlert } from 'lucide-react'

function AuditPage() {
    const [url, setUrl] = useState('')
    const [content, setContent] = useState('')
    const mutation = useMutation({
        mutationFn: () => api.auditEvaluate({ url: url || undefined, content: content || undefined }),
    })

    return (
        <div className="mx-auto max-w-3xl p-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">AI SEO Audit</h1>
                <p className="text-gray-600 dark:text-gray-300">Evaluate a page or paste content against LLM‑SEO criteria.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs defaultValue="url" className="w-full">
                        <TabsList>
                            <TabsTrigger value="url">By URL</TabsTrigger>
                            <TabsTrigger value="content">By Content</TabsTrigger>
                        </TabsList>
                        <TabsContent value="url" className="space-y-3">
                            <label className="block text-sm font-medium">URL</label>
                            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
                        </TabsContent>
                        <TabsContent value="content" className="space-y-3">
                            <label className="block text-sm font-medium">Content (paste HTML or text)</label>
                            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
                        </TabsContent>
                    </Tabs>
                    <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                        {mutation.isPending ? 'Analyzing…' : 'Run audit'}
                    </Button>
                    {mutation.error && (
                        <div className="text-red-600">{String((mutation.error as Error).message)}</div>
                    )}
                </CardContent>
            </Card>

            {mutation.data && (
                <Card>
                    <CardHeader>
                        <CardTitle>Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="mb-1 text-sm text-gray-500">Overall score</div>
                            <div className="h-2 w-full rounded bg-muted">
                                <div
                                    className="h-2 rounded bg-gradient-to-r from-emerald-500 to-sky-500"
                                    style={{ width: `${mutation.data.score}%` }}
                                />
                            </div>
                            <div className="mt-1 text-sm text-gray-500">{mutation.data.score}/100</div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(mutation.data.details)
                                .sort((a: any, b: any) => (a[1].value / a[1].max) - (b[1].value / b[1].max))
                                .map(([key, d]: any) => {
                                    const ratio = Math.round((d.value / d.max) * 100)
                                    const complete = d.value >= d.max
                                    return (
                                        <div key={key} className="rounded-md border p-3 text-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium">{d.label}</div>
                                                {complete ? (
                                                    <Badge className="bg-emerald-600 text-white"><CheckCircle2 className="mr-1 h-3 w-3" /> Good</Badge>
                                                ) : (
                                                    <Badge variant="secondary"><CircleAlert className="mr-1 h-3 w-3" /> Improve</Badge>
                                                )}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500">{d.description}</div>
                                            <div className="mt-2 h-1.5 w-full rounded bg-muted">
                                                <div
                                                    className={`h-1.5 rounded ${complete ? 'bg-emerald-500' : 'bg-primary'}`}
                                                    style={{ width: `${ratio}%` }}
                                                />
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">Why: {d.why}</div>
                                            {!complete && (
                                                <div className="mt-1 text-xs">Tip: {d.suggestions[0]}</div>
                                            )}
                                        </div>
                                    )
                                })}
                        </div>
                        {mutation.data.recommendations?.length > 0 && (
                            <div>
                                <div className="text-sm font-medium">Top recommendations</div>
                                <ul className="mt-1 list-disc pl-6 text-sm">
                                    {mutation.data.recommendations.map((r: string, i: number) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default AuditPage


