import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

function AuditPage() {
    const [url, setUrl] = useState('')
    const [content, setContent] = useState('')
    const mutation = useMutation({
        mutationFn: () => api.auditEvaluate({ url: url || undefined, content: content || undefined }),
    })

    return (
        <div className="mx-auto max-w-3xl p-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Audit AI SEO</h1>
                <p className="text-gray-600">Évaluez une page ou un contenu selon les critères LLM‑SEO.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Entrées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">URL (optionnel)</label>
                        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Contenu (ou collez le HTML)</label>
                        <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
                    </div>
                    <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                        {mutation.isPending ? 'Analyse…' : 'Lancer l’audit'}
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


