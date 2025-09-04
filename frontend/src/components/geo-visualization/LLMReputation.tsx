import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MetricsRadar from './MetricsRadar'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CitationAnalysis {
    likelihood: number
    quotableElements?: string[]
    citationContexts?: string[]
    metrics?: {
        citationLikelihood: number
        knowledgeIntegration: number
        authorityScore: number
        uniquenessValue: number
        referenceQuality: number
    }
}

interface CitationNetworkProps {
    analysis: CitationAnalysis
}

const METRICS_DESCRIPTIONS = {
    'Citation Likelihood': 'Probability of being cited by other content',
    'Knowledge Integration': 'How well the content connects with existing knowledge',
    'Authority Score': 'Perceived authority and credibility',
    'Uniqueness Value': 'Originality and unique contribution',
    'Reference Quality': 'Quality and reliability of citations and references'
}

export default function CitationNetwork({ analysis }: CitationNetworkProps) {
    // If no meaningful data, show guidance
    const hasQuotableElements = analysis.quotableElements && analysis.quotableElements.length > 0
    const hasCitationContexts = analysis.citationContexts && analysis.citationContexts.length > 0
    const hasMetrics = analysis.metrics && !Object.values(analysis.metrics).every(v => v === 50)

    if (!hasQuotableElements && !hasCitationContexts && !hasMetrics) {
        return (
            <div className="space-y-6">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        No detailed citation analysis available yet. This could be because:
                        <ul className="list-disc pl-4 mt-2 space-y-1">
                            <li>The content is too short or lacks substantial information</li>
                            <li>The content needs more specific technical details or references</li>
                            <li>The content type might not be suitable for citation analysis</li>
                        </ul>
                    </AlertDescription>
                </Alert>

                <Card>
                    <CardHeader>
                        <CardTitle>Citation Potential</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Overall Likelihood</span>
                                <span className="text-lg font-bold">{analysis.likelihood}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{ width: `${analysis.likelihood}%` }}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Base likelihood of being cited by other content
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Transform metrics for radar chart
    const metrics = analysis.metrics ? {
        'Citation Likelihood': analysis.metrics.citationLikelihood,
        'Knowledge Integration': analysis.metrics.knowledgeIntegration,
        'Authority Score': analysis.metrics.authorityScore,
        'Uniqueness Value': analysis.metrics.uniquenessValue,
        'Reference Quality': analysis.metrics.referenceQuality
    } : null

    return (
        <div className="space-y-6">
            {/* Citation Metrics */}
            {metrics && (
                <Card>
                    <CardHeader>
                        <CardTitle>Citation Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px]">
                            <MetricsRadar
                                title="Citation Analysis"
                                metrics={metrics}
                                maxValue={100}
                                showLegend={false}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Metrics Explanations */}
            {metrics && (
                <Card>
                    <CardHeader>
                        <CardTitle>Understanding Citation Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(metrics).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{key}</span>
                                        <span className="text-lg font-bold">{value}/100</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${value}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {METRICS_DESCRIPTIONS[key as keyof typeof METRICS_DESCRIPTIONS]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quotable Elements */}
            {hasQuotableElements && (
                <Card>
                    <CardHeader>
                        <CardTitle>Quotable Elements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {analysis.quotableElements?.map((element, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-muted rounded-lg text-sm"
                                >
                                    {element}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Citation Contexts */}
            {hasCitationContexts && (
                <Card>
                    <CardHeader>
                        <CardTitle>Citation Contexts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {analysis.citationContexts?.map((context, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-muted rounded-lg text-sm"
                                >
                                    {context}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}