import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, CircleAlert, Loader2, Sparkles, Target, Zap, Eye, MessageSquare, FileText, Copy, Download } from 'lucide-react'
import { useState } from 'react'
import type { OptimizeResult } from '../types/content'

function AuditPage() {
    const [url, setUrl] = useState('')
    const [content, setContent] = useState('')
    const [activeTab, setActiveTab] = useState('audit')

    const auditMutation = useMutation({
        mutationFn: api.auditEvaluate,
    })

    const optimizeMutation = useMutation({
        mutationFn: api.optimizeContent,
    })

    const handleAuditSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (url) {
            auditMutation.mutate({ url })
        }
    }

    const handleOptimizeSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (content) {
            optimizeMutation.mutate(content)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="mx-auto max-w-4xl p-6 space-y-6">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">AI SEO Tools</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Optimize your content for AI search engines and conversational AI. Get insights on how LLMs will find, understand, and present your content.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="audit" className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        URL Audit
                    </TabsTrigger>
                    <TabsTrigger value="optimize" className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Content Optimizer
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        AI Insights
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="audit" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                AI SEO Audit
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Analyze your existing webpage for AI search optimization
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAuditSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="url" className="block text-sm font-medium mb-2">
                                        Website URL
                                    </label>
                                    <Input
                                        id="url"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={auditMutation.isPending || !url}>
                                    {auditMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Analyze for AI SEO
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {auditMutation.data && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Audit Results</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="mb-1 text-sm text-gray-500">Overall score</div>
                                    <div className="h-2 w-full rounded-full bg-muted">
                                        <div
                                            className="h-2 rounded-full bg-primary transition-all duration-500"
                                            style={{ width: `${auditMutation.data.score}%` }}
                                        />
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">{auditMutation.data.score}/100</div>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {Object.entries(auditMutation.data.details)
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
                                {auditMutation.data.recommendations?.length > 0 && (
                                    <div>
                                        <h3 className="font-medium mb-2">Top recommendations</h3>
                                        <ul className="space-y-1 text-sm">
                                            {auditMutation.data.recommendations.map((rec: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-primary font-medium">{i + 1}.</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="optimize" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                AI Content Optimizer
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Optimize your content to be more discoverable and valuable for AI systems
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleOptimizeSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium mb-2">
                                        Content to Optimize
                                    </label>
                                    <Textarea
                                        id="content"
                                        placeholder="Paste your article, blog post, or any content you want to optimize for AI..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={8}
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={optimizeMutation.isPending || !content}>
                                    {optimizeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Optimize for AI
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {optimizeMutation.data && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-5 w-5" />
                                        Optimization Results
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <h3 className="font-medium mb-2">Original Score</h3>
                                            <div className="text-2xl font-bold text-muted-foreground">
                                                {optimizeMutation.data.original.score}/100
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-2">Potential Score</h3>
                                            <div className="text-2xl font-bold text-primary">
                                                {Math.min(100, optimizeMutation.data.original.score +
                                                    optimizeMutation.data.optimized.improvements.reduce((sum: number, imp: any) => sum + imp.priority, 0))}/100
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-3">Priority Improvements</h3>
                                        <div className="space-y-2">
                                            {optimizeMutation.data.optimized.improvements.slice(0, 3).map((imp: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-md border">
                                                    <div>
                                                        <div className="font-medium">{imp.area}</div>
                                                        <div className="text-sm text-muted-foreground">{imp.suggestions[0]}</div>
                                                    </div>
                                                    <Badge variant="secondary">+{imp.priority} pts</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Optimized Content
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => copyToClipboard(optimizeMutation.data.optimized.content)}
                                        >
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="max-h-96 overflow-y-auto rounded-md border p-4 bg-muted/50">
                                        <pre className="whitespace-pre-wrap text-sm">{optimizeMutation.data.optimized.content}</pre>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MessageSquare className="h-5 w-5" />
                                    Conversational Keywords
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Discover how people actually ask questions about your topic
                                </p>
                                <Button variant="outline" className="w-full">
                                    Research Keywords
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5" />
                                    Content Templates
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Generate AI-optimized content structures
                                </p>
                                <Button variant="outline" className="w-full">
                                    Create Templates
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AuditPage


