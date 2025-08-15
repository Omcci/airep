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

                    {/* Insights and Recommendations */}
                    <div className="mt-6">
                        <div className="text-sm text-muted-foreground mb-3">
                            Based on AI analysis, here are the key insights and recommendations:
                        </div>

                        {/* Insights */}
                        <div className="space-y-4">
                            {analysisData.insights?.map((insight: string, index: number) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                    <p className="text-sm">{insight}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recommendations */}
                        {analysisData.recommendations && analysisData.recommendations.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-sm font-medium mb-3">Recommendations for improvement:</h4>
                                <div className="space-y-2">
                                    {analysisData.recommendations.map((rec: string, index: number) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                            <p className="text-sm text-blue-800 dark:text-blue-200">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
