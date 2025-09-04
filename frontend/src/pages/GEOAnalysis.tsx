import { useState } from 'react'
import { useGeoAnalysis } from '@/hooks/useGeoAnalysis'
import KnowledgeGraph from '@/components/geo-visualization/KnowledgeGraph'
import AIInsights from '@/components/geo-visualization/AIInsights'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MetricsRadar from '@/components/geo-visualization/MetricsRadar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { APINode, APIEdge } from '@/types/geo'

export default function GEOAnalysis() {
    const [content, setContent] = useState('')
    const [contentType, setContentType] = useState<'tool' | 'article' | 'documentation'>('tool')

    const { data: analysis } = useGeoAnalysis(content, contentType)

    const handleNodeClick = (node: APINode) => {
        console.log('Node clicked:', node)
    }

    const handleEdgeClick = (edge: APIEdge) => {
        console.log('Edge clicked:', edge)
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>GEO Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Textarea
                            placeholder="Enter your content to analyze..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[200px]"
                        />
                        <div className="flex justify-between items-center">
                            <div className="space-x-2">
                                <Button
                                    variant={contentType === 'tool' ? 'default' : 'outline'}
                                    onClick={() => setContentType('tool')}
                                >
                                    Tool
                                </Button>
                                <Button
                                    variant={contentType === 'article' ? 'default' : 'outline'}
                                    onClick={() => setContentType('article')}
                                >
                                    Article
                                </Button>
                                <Button
                                    variant={contentType === 'documentation' ? 'default' : 'outline'}
                                    onClick={() => setContentType('documentation')}
                                >
                                    Documentation
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {analysis && (
                <Tabs defaultValue="insights" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="insights">AI Insights</TabsTrigger>
                        <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="insights" className="mt-6">
                        <AIInsights analysis={analysis} />
                    </TabsContent>
aa
                    <TabsContent value="technical" className="mt-6">
                        <div className="space-y-6">
                            <KnowledgeGraph
                                nodes={analysis.knowledgeGraph.nodes}
                                edges={analysis.knowledgeGraph.edges}
                                onNodeClick={handleNodeClick}
                                onEdgeClick={handleEdgeClick}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Ranking Factors</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <MetricsRadar
                                            title="Ranking Factors"
                                            metrics={analysis.rankingFactors}
                                            showLegend={true}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Competitive Analysis</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="p-3 bg-muted rounded-lg">
                                                <p className="font-medium">Market Position</p>
                                                <p className="text-sm capitalize">{analysis.competitiveAnalysis.marketPosition}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium mb-2">Unique Strengths</p>
                                                <div className="space-y-2">
                                                    {analysis.competitiveAnalysis.uniqueStrengths.map((strength, index) => (
                                                        <div key={index} className="text-sm p-2 bg-primary/10 rounded">
                                                            {strength}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}