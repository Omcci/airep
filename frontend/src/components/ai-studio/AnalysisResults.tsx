import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'

interface AnalysisResultsProps {
    analysisData: any
    isVisible: boolean
}

export default function AnalysisResults({
    analysisData,
    isVisible
}: AnalysisResultsProps) {
    if (!isVisible || !analysisData) return null

    const getScoreDescription = (scoreType: string) => {
        switch (scoreType) {
            case 'readability':
                return 'How easy your content is to read and understand. Higher scores indicate clearer, more accessible writing.'
            case 'engagement':
                return 'How likely your content is to capture and hold attention. Includes factors like hooks, storytelling, and interactive elements.'
            case 'seo':
                return 'Search engine optimization score. Measures keyword usage, structure, and technical SEO elements.'
            case 'ai_friendly':
                return 'How well your content is structured for AI systems to understand and cite. Includes clear headings, structured data, and semantic markup.'
            case 'authority':
                return 'Credibility and expertise indicators. Higher scores suggest content that builds trust and demonstrates knowledge.'
            case 'conversational':
                return 'How naturally conversational and engaging your content feels. Important for social media and AI interactions.'
            default:
                return 'This score measures an aspect of your content quality and optimization.'
        }
    }

    return (
        <TooltipProvider>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        📊 Analysis Results
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Score Display */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="text-4xl font-bold text-primary">{analysisData.score}/100</div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-5 w-5 text-muted-foreground cursor-help hover:text-primary transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>Your overall AI optimization score. This combines all individual metrics to give you a comprehensive view of how well your content is optimized for AI systems and search engines.</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="text-sm text-muted-foreground">AI Optimization Score</div>
                    </div>

                    {/* Score Breakdown */}
                    {analysisData.details && (
                        <div className="space-y-4">
                            <h3 className="font-medium">Score Breakdown</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(analysisData.details).map(([key, detail]: [string, any]) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex justify-between text-sm items-center">
                                            <span>{detail.label}</span>
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium">{detail.value}/{detail.max}</span>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help hover:text-primary transition-colors" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-xs">
                                                        <p>{getScoreDescription(key)}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(detail.value / detail.max) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Insights and Recommendations - MODERN SHADCN DESIGN */}
                    <div className="mt-6">
                        <div className="text-sm text-muted-foreground mb-4">
                            Based on AI analysis, here are the key insights and recommendations:
                        </div>

                        {/* Modern Card-based Layout */}
                        <div className="space-y-6">
                            {/* AI Insights - Table Format */}
                            {analysisData.insights && analysisData.insights.length > 0 && (
                                <div className="space-y-3">
                                    <div className="border-b pb-2">
                                        <h4 className="text-sm font-semibold text-foreground">
                                            Key Insights
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            AI analysis of your content performance
                                        </p>
                                    </div>

                                    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                                        <table className="w-full">
                                            <thead className="bg-muted/50 border-b border-border">
                                                <tr>
                                                    <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                        #
                                                    </th>
                                                    <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                        Insight
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analysisData.insights.map((insight: string, index: number) => (
                                                    <tr key={`insight-${index}`} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-default">
                                                        <td className="p-4 text-sm text-muted-foreground font-mono w-12">
                                                            {index + 1}
                                                        </td>
                                                        <td className="p-4 text-sm text-card-foreground leading-relaxed">
                                                            {insight}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* AI Recommendations - Modern Grid Layout */}
                            {analysisData.recommendations && analysisData.recommendations.length > 0 && (
                                <div className="space-y-4">
                                    <div className="border-b pb-2">
                                        <h4 className="text-sm font-semibold text-foreground">
                                            Actionable Recommendations
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Implement these suggestions to improve your content
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {analysisData.recommendations.map((rec: string, index: number) => (
                                            <div key={`rec-${index}`} className="p-4 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all hover:border-primary/20">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <div className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wide">
                                                            Step {index + 1}
                                                        </div>
                                                        <p className="text-sm text-card-foreground leading-relaxed">{rec}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Fallback Message When AI Fails */}
                            {(!analysisData.insights || analysisData.insights.length === 0) &&
                                (!analysisData.recommendations || analysisData.recommendations.length === 0) && (
                                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-destructive rounded-full" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-destructive">
                                                    Analysis Unavailable
                                                </p>
                                                <p className="text-xs text-destructive/80 mt-1">
                                                    AI analysis is currently unavailable. Please try again later.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
