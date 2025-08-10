import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
                        <CardTitle>Résultat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-medium">Score: {mutation.data.score}/100</div>
                        <ul className="mt-2 list-disc pl-6 text-gray-700">
                            {Object.entries(mutation.data.metrics).map(([k, v]) => (
                                <li key={k}>
                                    <span className="font-medium">{k}</span>: {v}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default AuditPage


