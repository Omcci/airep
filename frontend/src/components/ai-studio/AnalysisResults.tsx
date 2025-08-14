import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AnalysisResultsProps {
    analysisData: any
    isVisible: boolean
}

export default function AnalysisResults({
    analysisData,
    isVisible
}: AnalysisResultsProps) {
    if (!isVisible || !analysisData) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    📊 Analysis Results
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{analysisData.score}/100</div>
                    <div className="text-sm text-muted-foreground">AI Optimization Score</div>
                </div>

                {/* Score Breakdown */}
                {analysisData.details && (
                    <div className="space-y-4">
                        <h3 className="font-medium">Score Breakdown</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(analysisData.details).map(([key, detail]: [string, any]) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>{detail.label}</span>
                                        <span className="font-medium">{detail.value}/{detail.max}</span>
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
    )
}
