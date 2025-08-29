import { Copy, Download, TrendingUp, CheckCircle } from 'lucide-react'
import AIPerceptionMetrics from '@/components/ai-studio/AIPerceptionMetrics'

type PlatformInfo = {
    name: string
    icon: React.ReactNode
    color: string
}

interface AnalysisResultsDisplayProps {
    isExpanded: boolean
    platformInfo: PlatformInfo
    originalScore: number
    potentialScore: number
    improvements: any[]
    originalContent: string
    currentContent: string
    content: string
    copyToClipboard: (text: string) => void
    handleRedoOptimization: () => void
    isGenerating: boolean
    renderToneButtons: () => React.ReactElement[]
    analysisData?: any
}

export default function AnalysisResultsDisplay({
    isExpanded,
    platformInfo,
    originalScore,
    potentialScore,
    improvements,
    originalContent,
    currentContent,
    content,
    copyToClipboard,
    handleRedoOptimization,
    isGenerating,
    renderToneButtons,
    analysisData
}: AnalysisResultsDisplayProps) {
    return (
        <div className={`transition-all duration-500 ${isExpanded ? 'p-8' : 'p-6'} ${isExpanded ? 'max-w-6xl mx-auto space-y-8' : 'space-y-6'}`}>
            {/* Score Section - Only show when there's actual improvement */}
            {potentialScore > originalScore && (
                <div className={`space-y-4 transition-all duration-500 ${isExpanded ? 'space-y-6' : 'space-y-4'}`}>
                    <div className="text-center">
                        <h3 className={`font-semibold mb-2 transition-all duration-500 ${isExpanded ? 'text-2xl' : 'text-lg'}`}>
                            Content Optimization Results
                        </h3>
                        <p className={`text-muted-foreground transition-all duration-500 ${isExpanded ? 'text-lg' : 'text-sm'}`}>
                            Your content has been analyzed and optimized for {platformInfo.name}
                        </p>
                    </div>

                    {/* Score Cards - Responsive Grid */}
                    <div className="flex justify-center">
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-500 ${isExpanded ? 'gap-6 max-w-3xl' : 'gap-4 max-w-2xl'}`}>
                            {/* Original Score Card */}
                            <div className={`bg-card border border-border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-500 ${isExpanded ? 'p-6 rounded-2xl shadow-lg hover:shadow-xl' : 'p-4 rounded-xl shadow-sm hover:shadow-md'}`}>
                                <div className={`relative inline-flex items-center justify-center mx-auto mb-3 transition-all duration-500 ${isExpanded ? 'w-24 h-24 mb-4' : 'w-20 h-20 mb-3'}`}>
                                    {/* Circular Progress Ring */}
                                    <svg className={`transform -rotate-90 transition-all duration-500 ${isExpanded ? 'w-24 h-24' : 'w-20 h-20'}`} viewBox="0 0 36 36">
                                        <path
                                            className="text-slate-200 dark:text-slate-700"
                                            stroke="currentColor"
                                            strokeWidth={isExpanded ? "3" : "2.5"}
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-slate-600 dark:text-slate-400 transition-all duration-1500 ease-out"
                                            stroke="currentColor"
                                            strokeWidth={isExpanded ? "3" : "2.5"}
                                            strokeLinecap="round"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            strokeDasharray={`${(originalScore / 100) * 100}, 100`}
                                            style={{
                                                strokeDasharray: `${(originalScore / 100) * 100}, 100`,
                                                animation: 'progressAnimation 1.5s ease-out'
                                            }}
                                        />
                                    </svg>
                                    {/* Score Text */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className={`font-bold text-slate-700 dark:text-slate-300 transition-all duration-500 ${isExpanded ? 'text-2xl' : 'text-xl'}`}>
                                            {originalScore}
                                        </span>
                                    </div>
                                </div>
                                <div className={`font-medium text-slate-600 dark:text-slate-400 transition-all duration-500 ${isExpanded ? 'text-lg' : 'text-sm'}`}>
                                    Original Score
                                </div>
                                <div className={`text-muted-foreground mt-1 transition-all duration-500 ${isExpanded ? 'text-sm' : 'text-xs'}`}>
                                    Baseline assessment
                                </div>
                            </div>

                            {/* Optimized Score Card */}
                            <div className={`bg-card border border-border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-500 relative ${isExpanded ? 'p-6 rounded-2xl shadow-lg hover:shadow-xl' : 'p-4 rounded-xl shadow-sm hover:shadow-md'}`}>
                                {/* Improvement Badge */}
                                <div className={`absolute text-white font-bold rounded-full shadow-lg transition-all duration-500 ${isExpanded ? '-top-3 -right-3 bg-green-500 text-sm px-3 py-1' : '-top-2 -right-2 bg-green-500 text-xs px-2 py-1'}`}>
                                    +{potentialScore - originalScore}
                                </div>

                                <div className={`relative inline-flex items-center justify-center mx-auto mb-3 transition-all duration-500 ${isExpanded ? 'w-24 h-24 mb-4' : 'w-20 h-20 mb-3'}`}>
                                    {/* Circular Progress Ring */}
                                    <svg className={`transform -rotate-90 transition-all duration-500 ${isExpanded ? 'w-24 h-24' : 'w-20 h-20'}`} viewBox="0 0 36 36">
                                        <path
                                            className="text-green-200 dark:text-green-800"
                                            stroke="currentColor"
                                            strokeWidth={isExpanded ? "3" : "2.5"}
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-green-600 dark:text-green-400 transition-all duration-1500 ease-out"
                                            stroke="currentColor"
                                            strokeWidth={isExpanded ? "3" : "2.5"}
                                            strokeLinecap="round"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            strokeDasharray={`${(potentialScore / 100) * 100}, 100`}
                                            style={{
                                                strokeDasharray: `${(potentialScore / 100) * 100}, 100`,
                                                animation: 'progressAnimation 1.5s ease-out'
                                            }}
                                        />
                                    </svg>
                                    {/* Score Text */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className={`font-bold text-green-700 dark:text-green-300 transition-all duration-500 ${isExpanded ? 'text-2xl' : 'text-xl'}`}>
                                            {potentialScore}
                                        </span>
                                    </div>
                                </div>
                                <div className={`font-medium text-green-600 dark:text-green-400 transition-all duration-500 ${isExpanded ? 'text-lg' : 'text-sm'}`}>
                                    Optimized Score
                                </div>
                                <div className={`text-muted-foreground mt-1 transition-all duration-500 ${isExpanded ? 'text-sm' : 'text-xs'}`}>
                                    AI enhanced
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Score Summary Message */}
                    <div className={`text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto transition-all duration-500 ${isExpanded ? 'p-4 rounded-xl max-w-3xl' : 'p-3 rounded-lg max-w-2xl'}`}>
                        <p className={`text-blue-800 dark:text-blue-200 transition-all duration-500 ${isExpanded ? 'text-lg' : 'text-sm'}`}>
                            <strong>Great improvement!</strong> Your content score increased by {potentialScore - originalScore} points through AI optimization.
                        </p>
                    </div>

                    {/* AI Perception Metrics (blog/email only) */}
                    {analysisData?.aiPerception && (platformInfo.name === 'Blog/Website' || platformInfo.name === 'Email') && (
                        <div className="mt-3">
                            <AIPerceptionMetrics
                                aiPerception={analysisData.aiPerception}
                                isExpanded={isExpanded}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* No Improvement Message - Show when score didn't improve */}
            {potentialScore <= originalScore && (
                <div className="text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-full mb-4">
                        <span className="text-2xl">🎉</span>
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                        Your Content is Already High Quality!
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                        The AI couldn't significantly improve your score because your content already demonstrates excellent quality for {platformInfo.name}.
                    </p>
                </div>
            )}

            {/* Priority Improvements */}
            {improvements.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        Priority Improvements
                    </h3>
                    <div className="space-y-2">
                        {improvements.slice(0, 3).map((improvement: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm font-medium">{improvement.area}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground max-w-28 truncate">{improvement.suggestions?.[0] || 'Improve this area'}</span>
                                    <span className="text-sm font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">+{improvement.priority} pts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Comparison */}
            <div className="space-y-3">
                <h3 className="text-base font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {platformInfo.name} Content Analysis
                </h3>

                {/* Context Message - Only show when score didn't improve */}
                {potentialScore <= originalScore && (
                    <div className="flex items-center justify-center gap-3 py-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">AI Suggestions Available:</span> Even though your score couldn't be improved, the AI has provided optimization suggestions below for your consideration.
                        </p>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* Original Content */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            Original Content
                        </h4>
                        <div className="w-full h-24 bg-muted/30 rounded-lg p-2 border overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                            <pre className="whitespace-pre-wrap text-xs text-foreground m-0">{originalContent}</pre>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => copyToClipboard(originalContent)}
                                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                title="Copy original content"
                            >
                                <Copy className="h-3 w-3" />
                            </button>
                        </div>
                    </div>

                    {/* Optimized Content */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            Optimized Content
                        </h4>
                        <div className="w-full h-24 bg-muted/30 rounded-lg p-2 border overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                            <pre className="whitespace-pre-wrap text-xs text-foreground m-0">{currentContent}</pre>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => copyToClipboard(content)}
                                    className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                    title="Copy optimized content"
                                >
                                    <Copy className="h-3 w-3" />
                                </button>
                                <button
                                    onClick={handleRedoOptimization}
                                    className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                    title="Redo optimization"
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        const blob = new Blob([content], { type: 'text/plain' })
                                        const url = URL.createObjectURL(blob)
                                        const a = document.createElement('a')
                                        a.href = url
                                        a.download = `${platformInfo.name.toLowerCase()}-optimized-content.txt`
                                        a.click()
                                        URL.revokeObjectURL(url)
                                    }}
                                    className="p-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                                    title="Download as TXT"
                                >
                                    <Download className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-1 text-xs text-muted-foreground">
                            {isGenerating ? (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs">Generating...</span>
                                </div>
                            ) : (
                                <>
                                    <span className="text-xs text-muted-foreground font-bold mr-1">Try different tones:</span>
                                    {renderToneButtons()}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Stats */}
            <div className="space-y-3 pt-3 border-t">
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{content.split(' ').length}</div>
                        <div className="text-sm text-muted-foreground">Words</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{content.length}</div>
                        <div className="text-sm text-muted-foreground">Characters</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{Math.ceil(content.split(' ').length / 200 * 100)}%</div>
                        <div className="text-sm text-muted-foreground">Readability</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

