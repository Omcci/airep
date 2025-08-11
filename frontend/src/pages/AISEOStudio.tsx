import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, CircleAlert, Loader2, Sparkles, Target, Zap, Eye, FileJson, Copy, Download, ArrowRight, CheckCircle } from 'lucide-react'
import type { OptimizeResult } from '../types/content'

type WorkflowStep = 'analyze' | 'optimize' | 'preview' | 'deploy'

function JsonBlock({ data }: { data: unknown }) {
    return (
        <pre className="whitespace-pre-wrap text-xs bg-muted/50 p-3 rounded-md border max-h-80 overflow-auto">
            {JSON.stringify(data, null, 2)}
        </pre>
    )
}

function HtmlPreview({ html, jsonLd }: { html: string; jsonLd: any }) {
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview - AI Optimized Content</title>
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>
</head>
<body>
    ${html}
</body>
</html>`

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(fullHtml)}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Full HTML
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                    const blob = new Blob([fullHtml], { type: 'text/html' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'ai-optimized-content.html'
                    a.click()
                }}>
                    <Download className="mr-2 h-4 w-4" /> Download HTML
                </Button>
            </div>
            <div className="border rounded-md overflow-hidden">
                <div className="bg-muted px-3 py-2 text-sm font-medium border-b">HTML Preview</div>
                <iframe
                    srcDoc={fullHtml}
                    className="w-full h-96 border-0"
                    title="Content Preview"
                />
            </div>
        </div>
    )
}

export default function AISEOStudio() {
    const [currentStep, setCurrentStep] = useState<WorkflowStep>('analyze')
    const [contentType, setContentType] = useState<'url' | 'content' | 'tool'>('content')
    const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'blog' | 'email'>('linkedin')

    // Refs for automatic scrolling
    const optimizationResultsRef = useRef<HTMLDivElement>(null)

    // URL/Content analysis state
    const [url, setUrl] = useState('')
    const [content, setContent] = useState('')

    // Tool optimization state
    const [tool, setTool] = useState({
        name: '',
        homepage: '',
        tagline: '',
        description: '',
        categories: '',
        pricing: '',
        signupUrl: '',
        endpoints: '',
        examples: '',
    })

    // Mutations
    const auditMutation = useMutation({ mutationFn: api.auditEvaluate })
    const optimizeMutation = useMutation({ mutationFn: api.optimizeContent })
    const boostToolMutation = useMutation({ mutationFn: api.boostTool })

    // Automatic scroll to optimization results when they appear
    useEffect(() => {
        if ((optimizeMutation.data || boostToolMutation.data) && optimizationResultsRef.current) {
            setTimeout(() => {
                optimizationResultsRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }, 100)
        }
    }, [optimizeMutation.data, boostToolMutation.data])

    const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

    const moveToNextStep = () => {
        if (currentStep === 'analyze') {
            setCurrentStep('optimize')
        } else if (currentStep === 'optimize') {
            setCurrentStep('preview')
        } else if (currentStep === 'preview') {
            setCurrentStep('deploy')
        }
    }

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault()
        if (contentType === 'url' && url) {
            auditMutation.mutate({ url, platform })
        } else if (contentType === 'content' && content) {
            auditMutation.mutate({ content, platform })
        }
    }

    const handleOptimize = (e: React.FormEvent) => {
        e.preventDefault()
        if (contentType === 'tool') {
            const toolData = {
                ...tool,
                categories: tool.categories.split('\n').map(s => s.trim()).filter(Boolean),
                endpoints: tool.endpoints.split('\n').map(s => s.trim()).filter(Boolean).map(line => {
                    const m = line.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(\S+)\s+-\s+(.+)/i)
                    return m ? { method: m[1], path: m[2], description: m[3] } : { method: 'GET', path: line, description: '' }
                }),
                examples: tool.examples.split('\n').map(s => s.trim()).filter(Boolean).map(t => ({ title: t })),
            }
            boostToolMutation.mutate(toolData)
        } else if (content && auditMutation.data) {
            // Pass platform to the optimization API
            optimizeMutation.mutate({ content, platform })
        }
    }

    const canProceedToOptimize = () => {
        if (contentType === 'tool') return tool.name && tool.homepage
        if (contentType === 'content') return content.length > 0 && (auditMutation.data || optimizeMutation.data)
        if (contentType === 'url') return url.length > 0 && auditMutation.data
        return false
    }

    const canProceedToPreview = () => {
        if (contentType === 'tool') return boostToolMutation.data
        if (contentType === 'content') return optimizeMutation.data
        if (contentType === 'url') return auditMutation.data
        return false
    }

    const getStepStatus = (step: WorkflowStep) => {
        if (step === currentStep) return 'current'
        if (step === 'analyze') return 'completed'
        if (step === 'optimize' && (canProceedToOptimize() || optimizeMutation.data || boostToolMutation.data)) return 'completed'
        if (step === 'preview' && canProceedToPreview()) return 'completed'
        if (step === 'deploy' && canProceedToPreview()) return 'completed'
        return 'upcoming'
    }

    const getStepIcon = (step: WorkflowStep, status: string) => {
        if (status === 'completed') return <CheckCircle className="h-5 w-5 text-green-500" />
        if (status === 'current') return <Target className="h-5 w-5 text-primary" />
        return <CircleAlert className="h-5 w-5 text-muted-foreground" />
    }

    const steps: { key: WorkflowStep; label: string; description: string }[] = [
        { key: 'analyze', label: 'Analyze', description: 'Check your content for AI optimization' },
        { key: 'optimize', label: 'Optimize', description: 'Generate AI-friendly improvements' },
        { key: 'preview', label: 'Preview', description: 'See how it will look with JSON-LD' },
        { key: 'deploy', label: 'Deploy', description: 'Get ready-to-use code and markup' },
    ]

    return (
        <div className="mx-auto max-w-6xl p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">AI SEO Studio</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Complete AI SEO workflow: analyze, optimize, preview, and deploy your content for maximum AI discoverability.
                </p>
            </div>

            {/* Workflow Steps */}
            <div className="flex justify-center">
                <div className="flex space-x-8">
                    {steps.map((step, index) => {
                        const status = getStepStatus(step.key)
                        return (
                            <div key={step.key} className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background">
                                    {getStepIcon(step.key, status)}
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium">{step.label}</div>
                                    <div className="text-muted-foreground">{step.description}</div>
                                </div>
                                {index < steps.length - 1 && (
                                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Content Type Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>What are you optimizing?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Platform Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-3">Target Platform</label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={platform === 'linkedin' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPlatform('linkedin')}
                                className="flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                            </Button>
                            <Button
                                variant={platform === 'twitter' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPlatform('twitter')}
                                className="flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                X/Twitter
                            </Button>
                            <Button
                                variant={platform === 'blog' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPlatform('blog')}
                                className="flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5zM19 19.09H5V4.91h14v14.18zM6 15h12v2H6zm0-4h12v2H6zm0-4h12v2H6z" />
                                </svg>
                                Blog/Website
                            </Button>
                            <Button
                                variant={platform === 'email' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPlatform('email')}
                                className="flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                                Email Newsletter
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {platform === 'linkedin' && 'Optimized for LinkedIn posts (no HTML, AI-friendly structure)'}
                            {platform === 'twitter' && 'Optimized for X/Twitter threads (character limits, engagement hooks)'}
                            {platform === 'blog' && 'Full HTML optimization with JSON-LD markup and structured data'}
                            {platform === 'email' && 'Email-friendly optimization with limited HTML support'}
                        </p>
                    </div>

                    <Tabs value={contentType} onValueChange={(v) => setContentType(v as any)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="url">Website URL</TabsTrigger>
                            <TabsTrigger value="content">Content/Article</TabsTrigger>
                            <TabsTrigger value="tool">Tool/Service</TabsTrigger>
                        </TabsList>

                        <TabsContent value="url" className="space-y-4">
                            <form onSubmit={handleAnalyze} className="space-y-4">
                                <div>
                                    <label htmlFor="url" className="block text-sm font-medium mb-2">Website URL</label>
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
                                    Analyze Website
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="content" className="space-y-4">
                            <form onSubmit={handleAnalyze} className="space-y-4">
                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium mb-2">Content to Analyze</label>
                                    <Textarea
                                        id="content"
                                        placeholder="Paste your article, blog post, or any content..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={8}
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={auditMutation.isPending || !content}>
                                    {auditMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Analyze Content
                                </Button>
                            </form>

                            {/* Debug Info */}
                            {content && (
                                <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-md">
                                    <div>Content length: {content.length} characters</div>
                                    <div>Analysis status: {auditMutation.isPending ? 'Analyzing...' : auditMutation.data ? 'Complete' : 'Not started'}</div>
                                    <div>Can proceed to optimize: {canProceedToOptimize() ? 'Yes' : 'No'}</div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="tool" className="space-y-4">
                            <form onSubmit={handleOptimize} className="grid gap-3 sm:grid-cols-2">
                                <Input placeholder="Tool Name" value={tool.name} onChange={e => setTool({ ...tool, name: e.target.value })} required />
                                <Input placeholder="Homepage (https://...)" value={tool.homepage} onChange={e => setTool({ ...tool, homepage: e.target.value })} required />
                                <Input placeholder="Tagline" value={tool.tagline} onChange={e => setTool({ ...tool, tagline: e.target.value })} />
                                <Input placeholder="Pricing (Free, $9/mo, etc.)" value={tool.pricing} onChange={e => setTool({ ...tool, pricing: e.target.value })} />
                                <Input placeholder="Signup URL" value={tool.signupUrl} onChange={e => setTool({ ...tool, signupUrl: e.target.value })} />
                                <Input placeholder="Categories (one per line)" value={tool.categories} onChange={e => setTool({ ...tool, categories: e.target.value })} />
                                <Textarea className="sm:col-span-2" placeholder="Description" value={tool.description} onChange={e => setTool({ ...tool, description: e.target.value })} rows={3} />
                                <Textarea className="sm:col-span-2" placeholder="Endpoints (e.g. GET /api/minify - Minify a URL)" value={tool.endpoints} onChange={e => setTool({ ...tool, endpoints: e.target.value })} rows={4} />
                                <Textarea className="sm:col-span-2" placeholder="Examples (one per line)" value={tool.examples} onChange={e => setTool({ ...tool, examples: e.target.value })} rows={3} />
                                <div className="sm:col-span-2">
                                    <Button type="submit" disabled={boostToolMutation.isPending || !canProceedToOptimize()}>
                                        {boostToolMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Generate Tool Optimization
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Analysis Results */}
            {auditMutation.data && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Analysis Results for {platform === 'linkedin' ? 'LinkedIn' : platform === 'twitter' ? 'X/Twitter' : platform === 'blog' ? 'Blog/Website' : 'Email'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="mb-1 text-sm text-gray-500">Overall AI SEO Score</div>
                            <div className="h-3 w-full rounded-full bg-muted">
                                <div
                                    className="h-3 rounded-full bg-primary transition-all duration-500"
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

                        {/* Inline Optimization Form */}
                        <div className="border-t pt-6 mt-6">
                            <div className="text-center space-y-4">
                                <h3 className="text-lg font-semibold">Ready to Optimize?</h3>
                                <p className="text-muted-foreground">
                                    Generate {platform === 'linkedin' ? 'LinkedIn' : platform === 'twitter' ? 'X/Twitter' : platform === 'blog' ? 'blog' : 'email'}-optimized content based on your analysis.
                                </p>

                                {contentType === 'content' && (
                                    <Button
                                        onClick={() => handleOptimize({ preventDefault: () => { } } as any)}
                                        disabled={optimizeMutation.isPending}
                                        size="lg"
                                        className="px-8"
                                    >
                                        {optimizeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {platform === 'linkedin' && 'Generate LinkedIn-Optimized Content'}
                                        {platform === 'twitter' && 'Generate X/Twitter-Optimized Content'}
                                        {platform === 'blog' && 'Generate Blog-Optimized Content'}
                                        {platform === 'email' && 'Generate Email-Optimized Content'}
                                    </Button>
                                )}

                                {contentType === 'tool' && (
                                    <Button
                                        onClick={() => handleOptimize({ preventDefault: () => { } } as any)}
                                        disabled={boostToolMutation.isPending}
                                        size="lg"
                                        className="px-8"
                                    >
                                        {boostToolMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Generate Tool Optimization
                                    </Button>
                                )}

                                {contentType === 'url' && (
                                    <div className="space-y-3">
                                        <p className="text-sm text-muted-foreground">
                                            To optimize your website, you'll need to provide specific content to work with.
                                        </p>
                                        <Button
                                            onClick={() => setContentType('content')}
                                            variant="outline"
                                        >
                                            Switch to Content Optimization
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Optimization Results - Show inline after analysis */}
            {(optimizeMutation.data || boostToolMutation.data) && (
                <Card ref={optimizationResultsRef}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            {platform === 'linkedin' ? 'LinkedIn' : platform === 'twitter' ? 'X/Twitter' : platform === 'blog' ? 'Blog/Website' : 'Email'} Optimization Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {contentType === 'tool' && boostToolMutation.data && (
                            <>
                                <div>
                                    <h3 className="font-medium mb-3">LLM Snippet Pack</h3>
                                    <div className="flex justify-between items-center mb-2">
                                        <Badge variant="secondary">Copy for docs</Badge>
                                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(boostToolMutation.data.snippet)}>
                                            <Copy className="mr-2 h-4 w-4" /> Copy
                                        </Button>
                                    </div>
                                    <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded-md border max-h-80 overflow-auto">
                                        {boostToolMutation.data.snippet}
                                    </pre>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-3">JSON-LD Markup</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-sm font-medium mb-1">SoftwareApplication</div>
                                            <JsonBlock data={boostToolMutation.data.jsonld.softwareApplication} />
                                        </div>
                                        {boostToolMutation.data.jsonld.faq && (
                                            <div>
                                                <div className="text-sm font-medium mb-1">FAQPage</div>
                                                <JsonBlock data={boostToolMutation.data.jsonld.faq} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {contentType === 'content' && optimizeMutation.data && (
                            <>
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

                                <div>
                                    <h3 className="font-medium mb-3">
                                        {platform === 'linkedin' && 'LinkedIn-Optimized Content'}
                                        {platform === 'twitter' && 'X/Twitter-Optimized Content'}
                                        {platform === 'blog' && 'Blog-Optimized Content'}
                                        {platform === 'email' && 'Email-Optimized Content'}
                                    </h3>
                                    <div className="max-h-96 overflow-y-auto rounded-md border p-4 bg-muted/50">
                                        {platform === 'linkedin' || platform === 'twitter' ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-muted-foreground">
                                                        <strong>Copy this directly to {platform === 'linkedin' ? 'LinkedIn' : 'X/Twitter'}:</strong>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => copyToClipboard(optimizeMutation.data.optimized.content)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                        Copy Content
                                                    </Button>
                                                </div>
                                                <div className="bg-background border rounded-lg p-4">
                                                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                                                        {optimizeMutation.data.optimized.content}
                                                    </pre>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    💡 <strong>AI Optimization:</strong> This content is structured for better AI discoverability and engagement on {platform === 'linkedin' ? 'LinkedIn' : 'X/Twitter'}.
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-muted-foreground">
                                                        <strong>Optimized content for {platform === 'blog' ? 'your website' : 'your email platform'}:</strong>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => copyToClipboard(optimizeMutation.data.optimized.content)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                        Copy Content
                                                    </Button>
                                                </div>
                                                <div className="bg-background border rounded-lg p-4">
                                                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                                                        {optimizeMutation.data.optimized.content}
                                                    </pre>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="border-t pt-6">
                            <div className="text-center space-y-4">
                                <h3 className="text-lg font-semibold">What's Next?</h3>
                                <p className="text-muted-foreground">
                                    Your content is optimized! You can now copy it directly to {platform === 'linkedin' ? 'LinkedIn' : platform === 'twitter' ? 'X/Twitter' : platform === 'blog' ? 'your website' : 'your email platform'}.
                                </p>
                                <Button
                                    onClick={moveToNextStep}
                                    size="lg"
                                    className="px-8"
                                >
                                    Continue to Preview <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Preview Section */}
            {currentStep === 'preview' && (optimizeMutation.data || boostToolMutation.data) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            {platform === 'linkedin' || platform === 'twitter' ? 'Preview & Copy' : 'Preview & Validation'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {platform === 'linkedin' || platform === 'twitter' ? (
                            <div className="space-y-4">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                        {platform === 'linkedin' ? (
                                            <div className="w-8 h-8 bg-blue-600 rounded-sm"></div>
                                        ) : (
                                            <div className="w-8 h-8 bg-black rounded-sm"></div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold">
                                        {platform === 'linkedin' ? 'LinkedIn' : 'X/Twitter'} Content Ready!
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Your content is optimized for {platform === 'linkedin' ? 'LinkedIn' : 'X/Twitter'} with AI-friendly structure and engagement hooks.
                                    </p>
                                </div>

                                <div className="border rounded-lg p-4 bg-white">
                                    <div className="text-sm text-muted-foreground mb-2">
                                        {platform === 'linkedin' ? 'LinkedIn Post Preview:' : 'X/Twitter Post Preview:'}
                                    </div>
                                    <div className="whitespace-pre-wrap text-sm">
                                        {contentType === 'tool' && boostToolMutation.data ?
                                            boostToolMutation.data.snippet :
                                            optimizeMutation.data?.optimized.content || ''
                                        }
                                    </div>
                                </div>

                                <div className="flex gap-2 justify-center">
                                    <Button
                                        onClick={() => copyToClipboard(
                                            contentType === 'tool' && boostToolMutation.data ?
                                                boostToolMutation.data.snippet :
                                                optimizeMutation.data?.optimized.content || ''
                                        )}
                                        className="flex-1 max-w-xs"
                                    >
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy to Clipboard
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {contentType === 'tool' && boostToolMutation.data && (
                                    <HtmlPreview
                                        html={`<h1>${tool.name}</h1><p>${tool.description || tool.tagline}</p>`}
                                        jsonLd={boostToolMutation.data.jsonld.softwareApplication}
                                    />
                                )}

                                {contentType === 'content' && optimizeMutation.data && (
                                    <HtmlPreview
                                        html={optimizeMutation.data.optimized.content}
                                        jsonLd={optimizeMutation.data.original.details}
                                    />
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Deploy Section */}
            {currentStep === 'deploy' && (optimizeMutation.data || boostToolMutation.data) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Ready to Deploy to {platform === 'linkedin' ? 'LinkedIn' : platform === 'twitter' ? 'X/Twitter' : platform === 'blog' ? 'Blog/Website' : 'Email'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center space-y-4">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                            <h3 className="text-xl font-semibold">
                                Your {platform === 'linkedin' ? 'LinkedIn post' : platform === 'twitter' ? 'X/Twitter post' : platform === 'blog' ? 'blog content' : 'email content'} is AI-optimized!
                            </h3>
                            <p className="text-muted-foreground">
                                {platform === 'linkedin' || platform === 'twitter'
                                    ? `Copy the generated content directly to ${platform === 'linkedin' ? 'LinkedIn' : 'X/Twitter'} for maximum AI discoverability and engagement.`
                                    : 'Copy the generated code and markup to your website for maximum AI discoverability.'
                                }
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => copyToClipboard(
                                    contentType === 'tool' && boostToolMutation.data ?
                                        boostToolMutation.data.snippet :
                                        optimizeMutation.data?.optimized.content || ''
                                )}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                {platform === 'linkedin' || platform === 'twitter' ? 'Copy Content' : 'Copy All Code'}
                            </Button>
                            {platform === 'blog' && (
                                <Button variant="outline" className="w-full">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Files
                                </Button>
                            )}
                            {platform === 'linkedin' || platform === 'twitter' ? (
                                <Button variant="outline" className="w-full" onClick={() => {
                                    const platformUrl = platform === 'linkedin' ? 'https://linkedin.com' : 'https://twitter.com'
                                    window.open(platformUrl, '_blank')
                                }}>
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    Go to {platform === 'linkedin' ? 'LinkedIn' : 'X/Twitter'}
                                </Button>
                            ) : (
                                <Button variant="outline" className="w-full">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Files
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
