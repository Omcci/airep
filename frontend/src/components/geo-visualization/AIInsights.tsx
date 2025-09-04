import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Star, Lightbulb, ArrowUpRight, BarChart2 } from 'lucide-react'
import { useState } from 'react'
import MetricsRadar from './MetricsRadar'

interface AIInsightsProps {
    analysis: {
        citationAnalysis: {
            likelihood: number
            quotableElements: string[]
            citationContexts: string[]
            metrics: {
                citationLikelihood: number
                knowledgeIntegration: number
                authorityScore: number
                uniquenessValue: number
                referenceQuality: number
            }
        }
        knowledgeSynthesis: {
            integrationScore: number
            uniqueValue: string[]
            topicConnections: string[]
        }
        authorityEvaluation: {
            credibilityScore: number
            expertiseSignals: string[]
            trustFactors: string[]
        }
        geoRecommendations: {
            contentOptimization: string[]
            authorityEnhancement: string[]
            citationImprovement: string[]
        }
        aiPerceptionMetrics: {
            citationLikelihood: number
            knowledgeIntegration: number
            authorityScore: number
            uniquenessValue: number
            referenceQuality: number
        }
        overallAssessment: {
            strengths: string[]
            improvements: string[]
            potentialImpact: string
        }
        knowledgeGraph: {
            nodes: Array<{
                id: string
                label: string
                type: string
                score: number
                metrics: {
                    authority: number
                    relevance: number
                    freshness: number
                }
            }>
            edges: Array<{
                source: string
                target: string
                type?: string
                strength?: number
            }>
        }
    }
}

export default function AIInsights({ analysis }: AIInsightsProps) {
    const [showTechnical, setShowTechnical] = useState(false)

    // Provide fallback values for missing properties
    const knowledgeSynthesis = analysis.knowledgeSynthesis || {
        integrationScore: 0,
        uniqueValue: [],
        topicConnections: []
    }

    const authorityEvaluation = analysis.authorityEvaluation || {
        credibilityScore: 0,
        expertiseSignals: [],
        trustFactors: []
    }

    const overallAssessment = analysis.overallAssessment || {
        strengths: [],
        improvements: [],
        potentialImpact: 'moderate'
    }

    // Extract key elements
    const keyFacts = analysis.citationAnalysis.quotableElements
        .filter(el => !el.includes('"')) // Filter out quotes
        .slice(0, 3)

    const quotes = analysis.citationAnalysis.quotableElements
        .filter(el => el.includes('"'))
        .slice(0, 2)

    const useCases = analysis.citationAnalysis.citationContexts
        .slice(0, 3)

    return (
        <div className="space-y-6">
            {/* AI Perception Metrics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart2 className="h-5 w-5 text-primary" />
                        AI Perception Metrics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[500px]">
                        <MetricsRadar
                            title="AI Perception"
                            metrics={{
                                'Citation Likelihood': analysis.aiPerceptionMetrics.citationLikelihood,
                                'Knowledge Integration': analysis.aiPerceptionMetrics.knowledgeIntegration,
                                'Authority Score': analysis.aiPerceptionMetrics.authorityScore,
                                'Uniqueness Value': analysis.aiPerceptionMetrics.uniquenessValue,
                                'Reference Quality': analysis.aiPerceptionMetrics.referenceQuality
                            }}
                            maxValue={100}
                            showLegend={false}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Primary Use Cases */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-primary" />
                            How LLMs Will Use Your Content
                        </CardTitle>
                        <Badge variant="outline" className="text-sm">
                            {analysis.citationAnalysis.likelihood}% Citation Likelihood
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {useCases.map((useCase, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <ArrowUpRight className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <span>{useCase}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Most Citable Elements */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        Most Citable Elements
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {keyFacts.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="font-medium text-sm text-muted-foreground">Key Facts</h3>
                                <div className="space-y-2">
                                    {keyFacts.map((fact, index) => (
                                        <div key={index} className="p-2 bg-muted/50 rounded-lg text-sm">
                                            {fact}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {quotes.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="font-medium text-sm text-muted-foreground">Notable Quotes</h3>
                                <div className="space-y-2">
                                    {quotes.map((quote, index) => (
                                        <div key={index} className="p-2 bg-muted/50 rounded-lg text-sm">
                                            {quote}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {keyFacts.length === 0 && quotes.length === 0 && (
                            <div className="text-sm text-muted-foreground text-center py-4">
                                No citable elements found in the content.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Improvement Suggestions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        Improvement Suggestions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {analysis.geoRecommendations.contentOptimization.slice(0, 3).map((suggestion, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                                <span className="text-sm">{suggestion}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Technical Analysis Toggle */}
            <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowTechnical(!showTechnical)}
            >
                {showTechnical ? (
                    <ChevronUp className="h-4 w-4 mr-2" />
                ) : (
                    <ChevronDown className="h-4 w-4 mr-2" />
                )}
                {showTechnical ? "Hide Technical Analysis" : "View Technical Analysis"}
            </Button>

            {/* Technical Analysis */}
            {showTechnical && (
                <div className="space-y-6">
                    {/* Technical Metrics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Technical Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Knowledge Synthesis */}
                            <div>
                                <h3 className="font-medium mb-2">Knowledge Synthesis</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>Integration Score</span>
                                        <span className="font-medium">{knowledgeSynthesis.integrationScore}%</span>
                                    </div>
                                    {knowledgeSynthesis.uniqueValue.length > 0 && (
                                        <div className="space-y-1">
                                            <span className="text-sm text-muted-foreground">Unique Value Points</span>
                                            <ul className="list-disc list-inside">
                                                {knowledgeSynthesis.uniqueValue.map((point, i) => (
                                                    <li key={i} className="text-sm">{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Authority Evaluation */}
                            <div>
                                <h3 className="font-medium mb-2">Authority Evaluation</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>Credibility Score</span>
                                        <span className="font-medium">{authorityEvaluation.credibilityScore}%</span>
                                    </div>
                                    {authorityEvaluation.expertiseSignals.length > 0 && (
                                        <div className="space-y-1">
                                            <span className="text-sm text-muted-foreground">Expertise Signals</span>
                                            <ul className="list-disc list-inside">
                                                {authorityEvaluation.expertiseSignals.map((signal, i) => (
                                                    <li key={i} className="text-sm">{signal}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Overall Assessment */}
                            <div>
                                <h3 className="font-medium mb-2">Overall Assessment</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>Potential Impact</span>
                                        <span className="font-medium capitalize">{overallAssessment.potentialImpact}</span>
                                    </div>
                                    {overallAssessment.strengths.length > 0 && (
                                        <div className="space-y-1">
                                            <span className="text-sm text-muted-foreground">Strengths</span>
                                            <ul className="list-disc list-inside">
                                                {overallAssessment.strengths.map((strength, i) => (
                                                    <li key={i} className="text-sm">{strength}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {overallAssessment.improvements.length > 0 && (
                                        <div className="space-y-1">
                                            <span className="text-sm text-muted-foreground">Areas for Improvement</span>
                                            <ul className="list-disc list-inside">
                                                {overallAssessment.improvements.map((improvement, i) => (
                                                    <li key={i} className="text-sm">{improvement}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
