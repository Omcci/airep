import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Loader2, Rocket, FileJson, MessageSquare } from 'lucide-react'

function JsonBlock({ data }: { data: unknown }) {
    return (
        <pre className="whitespace-pre-wrap text-xs bg-muted/50 p-3 rounded-md border max-h-80 overflow-auto">
            {JSON.stringify(data, null, 2)}
        </pre>
    )
}

export default function BoostPage() {
    const [active, setActive] = useState('tool')

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

    const [article, setArticle] = useState({
        title: '',
        url: '',
        body: '',
        summary: '',
        authorName: '',
        datePublished: '',
    })

    const boostTool = useMutation({ mutationFn: api.boostTool })
    const boostArticle = useMutation({ mutationFn: api.boostArticle })

    const toArray = (raw: string) => raw.split('\n').map(s => s.trim()).filter(Boolean)

    const onSubmitTool = (e: React.FormEvent) => {
        e.preventDefault()
        boostTool.mutate({
            ...tool,
            categories: toArray(tool.categories),
            endpoints: toArray(tool.endpoints).map(line => {
                const m = line.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(\S+)\s+-\s+(.+)/i)
                return m ? { method: m[1], path: m[2], description: m[3] } : { method: 'GET', path: line, description: '' }
            }),
            examples: toArray(tool.examples).map(t => ({ title: t })),
        })
    }

    const onSubmitArticle = (e: React.FormEvent) => {
        e.preventDefault()
        boostArticle.mutate(article)
    }

    const copy = (text: string) => navigator.clipboard.writeText(text)

    return (
        <div className="mx-auto max-w-5xl p-6 space-y-6">
            <div className="text-center space-y-3">
                <h1 className="text-3xl font-bold">LLM Boost</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Generate LLM-friendly snippets and JSON-LD so your tools rank higher and your articles get cited by AI.
                </p>
            </div>

            <Tabs value={active} onValueChange={setActive}>
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="tool" className="flex items-center gap-2"><Rocket className="h-4 w-4" /> Tool Booster</TabsTrigger>
                    <TabsTrigger value="article" className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Article Booster</TabsTrigger>
                </TabsList>

                <TabsContent value="tool" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tool Booster</CardTitle>
                            <p className="text-sm text-muted-foreground">Create a snippet pack and SoftwareApplication JSON-LD</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onSubmitTool} className="grid gap-3 sm:grid-cols-2">
                                <Input placeholder="Name" value={tool.name} onChange={e => setTool({ ...tool, name: e.target.value })} required />
                                <Input placeholder="Homepage (https://...)" value={tool.homepage} onChange={e => setTool({ ...tool, homepage: e.target.value })} required />
                                <Input placeholder="Tagline" value={tool.tagline} onChange={e => setTool({ ...tool, tagline: e.target.value })} />
                                <Input placeholder="Pricing (Free, $9/mo, etc.)" value={tool.pricing} onChange={e => setTool({ ...tool, pricing: e.target.value })} />
                                <Input placeholder="Signup URL" value={tool.signupUrl} onChange={e => setTool({ ...tool, signupUrl: e.target.value })} />
                                <Input placeholder="Categories (one per line)" value={tool.categories} onChange={e => setTool({ ...tool, categories: e.target.value })} />
                                <Textarea className="sm:col-span-2" placeholder="Description" value={tool.description} onChange={e => setTool({ ...tool, description: e.target.value })} rows={3} />
                                <Textarea className="sm:col-span-2" placeholder="Endpoints (e.g. GET /api/minify - Minify a URL)" value={tool.endpoints} onChange={e => setTool({ ...tool, endpoints: e.target.value })} rows={4} />
                                <Textarea className="sm:col-span-2" placeholder="Examples (one per line)" value={tool.examples} onChange={e => setTool({ ...tool, examples: e.target.value })} rows={3} />
                                <div className="sm:col-span-2">
                                    <Button type="submit" disabled={boostTool.isPending}>{boostTool.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Generate</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {boostTool.data && (
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">LLM Snippet <Badge variant="secondary">Copy for docs</Badge></CardTitle>
                                    <Button size="sm" variant="outline" onClick={() => copy(boostTool.data.snippet)}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                                </CardHeader>
                                <CardContent>
                                    <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded-md border max-h-80 overflow-auto">{boostTool.data.snippet}</pre>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><FileJson className="h-5 w-5" /> JSON-LD</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <div className="text-sm font-medium mb-1">SoftwareApplication</div>
                                        <JsonBlock data={boostTool.data.jsonld.softwareApplication} />
                                    </div>
                                    {boostTool.data.jsonld.faq && (
                                        <div>
                                            <div className="text-sm font-medium mb-1">FAQPage</div>
                                            <JsonBlock data={boostTool.data.jsonld.faq} />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="article" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Article Booster</CardTitle>
                            <p className="text-sm text-muted-foreground">Generate TL;DR, Q&A, quotes, and JSON-LD (Article/FAQ/HowTo)</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onSubmitArticle} className="grid gap-3">
                                <Input placeholder="Title" value={article.title} onChange={e => setArticle({ ...article, title: e.target.value })} required />
                                <Input placeholder="URL" value={article.url} onChange={e => setArticle({ ...article, url: e.target.value })} required />
                                <Textarea placeholder="Body (markdown or plain text)" value={article.body} onChange={e => setArticle({ ...article, body: e.target.value })} rows={8} required />
                                <div className="grid sm:grid-cols-3 gap-3">
                                    <Input placeholder="TL;DR (optional)" value={article.summary} onChange={e => setArticle({ ...article, summary: e.target.value })} />
                                    <Input placeholder="Author (optional)" value={article.authorName} onChange={e => setArticle({ ...article, authorName: e.target.value })} />
                                    <Input placeholder="Date published (optional)" value={article.datePublished} onChange={e => setArticle({ ...article, datePublished: e.target.value })} />
                                </div>
                                <div>
                                    <Button type="submit" disabled={boostArticle.isPending}>{boostArticle.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Generate</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {boostArticle.data && (
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>LLM Answer Snippet</CardTitle>
                                    <Button size="sm" variant="outline" onClick={() => copy(boostArticle.data.snippet)}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                                </CardHeader>
                                <CardContent>
                                    <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded-md border max-h-80 overflow-auto">{boostArticle.data.snippet}</pre>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><FileJson className="h-5 w-5" /> JSON-LD</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <div className="text-sm font-medium mb-1">Article</div>
                                        <JsonBlock data={boostArticle.data.jsonld.article} />
                                    </div>
                                    {boostArticle.data.jsonld.faq && (
                                        <div>
                                            <div className="text-sm font-medium mb-1">FAQPage</div>
                                            <JsonBlock data={boostArticle.data.jsonld.faq} />
                                        </div>
                                    )}
                                    {boostArticle.data.jsonld.howTo && (
                                        <div>
                                            <div className="text-sm font-medium mb-1">HowTo</div>
                                            <JsonBlock data={boostArticle.data.jsonld.howTo} />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>LLM Retrieval Feed Chunk</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <JsonBlock data={boostArticle.data.feed} />
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
