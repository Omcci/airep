import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Copy, Download, TrendingUp, Target, CheckCircle, ChevronUp, Palette } from 'lucide-react'
import { api } from '@/lib/api'
import { TONE_OPTIONS, type ToneValue } from '@/lib/constants'

interface BottomDrawerProps {
    isOpen: boolean
    onToggle: () => void
    platform: 'linkedin' | 'twitter' | 'blog' | 'email'
    contentType: 'url' | 'content' | 'tool'
    optimizationResult?: any
    tool?: any
    analysisData?: any
    originalContent?: string
}

export default function BottomDrawer({
    isOpen,
    onToggle,
    platform,
    contentType,
    optimizationResult,
    tool,
    analysisData,
    originalContent: passedOriginalContent
}: BottomDrawerProps) {
    const [currentContent, setCurrentContent] = useState(optimizationResult?.optimized?.content || '')
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onToggle()
        }
        if (isOpen) window.addEventListener('keydown', onEsc)
        return () => window.removeEventListener('keydown', onEsc)
    }, [isOpen, onToggle])

    const getPlatformInfo = () => {
        switch (platform) {
            case 'linkedin':
                return {
                    name: 'LinkedIn',
                    icon: (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    ),
                    color: 'text-blue-600 dark:text-blue-400'
                }
            case 'twitter':
                return {
                    name: 'X/Twitter',
                    icon: (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    ),
                    color: 'text-gray-900 dark:text-gray-100'
                }
            case 'blog':
                return {
                    name: 'Blog/Website',
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    ),
                    color: 'text-green-600 dark:text-green-400'
                }
            case 'email':
                return {
                    name: 'Email',
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    ),
                    color: 'text-purple-600 dark:text-purple-400'
                }
            default:
                return {
                    name: 'Platform',
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                    ),
                    color: 'text-gray-600 dark:text-gray-400'
                }
        }
    }

    const platformInfo = getPlatformInfo()

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        // Could add a toast notification here
    }

    // Utility function to render tone buttons
    const renderToneButtons = () => (
        TONE_OPTIONS.map(({ label, tone }) => (
            <button
                key={tone}
                className="hover:text-foreground transition-colors cursor-pointer"
                onClick={() => handleToneVariation(tone)}
            >
                {label}
            </button>
        ))
    )

    const handleToneVariation = async (tone: ToneValue) => {
        if (!passedOriginalContent) return

        setIsGenerating(true)
        try {
            const result = await api.generateToneVariation({
                content: passedOriginalContent,
                platform,
                tone
            })

            if (result.optimized?.content) {
                setCurrentContent(result.optimized.content)
                // Update the optimization result to reflect the new tone
                if (optimizationResult) {
                    optimizationResult.optimized.content = result.optimized.content
                    optimizationResult.optimized.tone = tone
                }
            }
        } catch (error) {
            console.error('Failed to generate tone variation:', error)
            // Could add error notification here
        } finally {
            setIsGenerating(false)
        }
    }

    const handleRedoOptimization = async () => {
        if (!passedOriginalContent) return

        setIsGenerating(true)
        try {
            const result = await api.redoOptimization({
                content: passedOriginalContent,
                platform,
                tone: optimizationResult?.optimized?.tone || 'professional'
            })

            if (result.optimized?.content) {
                setCurrentContent(result.optimized.content)
                // Update the optimization result
                if (optimizationResult) {
                    optimizationResult.optimized.content = result.optimized.content
                    optimizationResult.original = result.original
                    optimizationResult.improvements = result.optimized.improvements
                }
            }
        } catch (error) {
            console.error('Failed to redo optimization:', error)
            // Could add error notification here
        } finally {
            setIsGenerating(false)
        }
    }

    const getOptimizedContent = () => {
        if (contentType === 'tool') {
            return optimizationResult?.snippet || 'No tool snippet available'
        }
        return optimizationResult?.optimized?.content || 'No optimized content available'
    }

    const getOriginalContent = () => {
        if (contentType === 'tool') {
            return passedOriginalContent || tool?.description || tool?.tagline || 'No tool description available'
        }
        // For content optimization, get from the original input
        if (contentType === 'content') {
            return passedOriginalContent ||
                optimizationResult?.originalContent ||
                optimizationResult?.original?.content ||
                optimizationResult?.input ||
                'No original content available'
        }
        if (contentType === 'url') {
            return passedOriginalContent ||
                optimizationResult?.originalContent ||
                optimizationResult?.original?.content ||
                optimizationResult?.input ||
                'No original content available'
        }
        return 'No original content available'
    }

    const content = getOptimizedContent()
    const originalContent = getOriginalContent()

    // Debug logging to see what's available
    console.log('Content Type:', contentType)
    console.log('Optimization Result:', optimizationResult)
    console.log('Tool:', tool)
    console.log('Original Content:', originalContent)
    console.log('Optimized Content:', content)

    // Get scores from analysis data
    const originalScore = analysisData?.score || 0
    const optimizedScore = optimizationResult?.optimized?.score || originalScore
    const potentialScore = optimizedScore // Use real optimized score instead of fake +15

    // Get improvements from optimization result
    const improvements = optimizationResult?.improvements || []

    // Don't render anything if there's no content to show
    if (!optimizationResult && !analysisData) {
        return null
    }

    return (
        <>
            {/* Clickable bottom bar - only visible when there's content */}
            <div
                className="fixed bottom-0 left-0 right-0 z-40 cursor-pointer"
                onClick={onToggle}
            >
                <div className="bg-slate-700/80 dark:bg-slate-800/80 border border-slate-600 dark:border-slate-700/50 rounded-t-2xl shadow-2xl mx-4 mb-4 p-4 hover:bg-slate-600/90 dark:hover:bg-slate-700/90 transition-all duration-300 overflow-hidden">
                    {/* Animated arrow in center top */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-10">
                        <div className="animate-bounce">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-slate-600 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                {platformInfo.icon}
                            </div>
                            <div>
                                <div className="font-medium text-white">
                                    {platformInfo.name} Optimization Results
                                </div>
                                <div className="text-sm text-slate-300">
                                    Click to view and copy optimized content
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-sm font-medium text-white">
                                    Score: {originalScore}/100 → {potentialScore}/100
                                </div>
                                <div className="text-xs text-slate-300">
                                    {potentialScore > originalScore ? `+${potentialScore - originalScore} points` : 'Score maintained'}
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="text-white text-xs font-medium">Click to view</div>
                                <div className="w-4 h-4 bg-slate-600 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full drawer content */}
            <Sheet open={isOpen} onOpenChange={onToggle}>
                <SheetContent
                    side="bottom"
                    className="h-[85vh] max-h-[85vh] overflow-hidden rounded-t-3xl border-t-2 border-gray-200 dark:border-gray-700"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <SheetHeader className="border-b pb-4 flex-shrink-0">
                        <SheetTitle className="flex items-center gap-2">
                            <span className="text-lg">{platformInfo.icon}</span>
                            <span className={platformInfo.color}>Preview & Copy</span>
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ scrollbarWidth: 'thin', maxHeight: 'calc(85vh - 80px)' }}>

                        {/* Score Section - IMPROVED WITH BETTER EXPLANATIONS */}
                        <div className="space-y-4">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">Content Optimization Results</h3>
                                <p className="text-sm text-muted-foreground">
                                    Your content has been analyzed and optimized for {platformInfo.name}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{originalScore}/100</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Original Score</div>
                                    <div className="w-full bg-slate-300 dark:bg-slate-600 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-slate-600 dark:bg-slate-400 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${originalScore}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 text-center relative">
                                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">{(potentialScore)}/100</div>
                                    <div className="text-sm text-green-600 dark:text-green-400">Optimized Score</div>

                                    {/* Score Improvement Indicator */}
                                    {potentialScore > originalScore && (
                                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                            +{potentialScore - originalScore}
                                        </div>
                                    )}

                                    {/* Score Adjustment Indicator */}
                                    {potentialScore < originalScore && (
                                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                            Adjusted
                                        </div>
                                    )}

                                    <div className="w-full bg-green-300 dark:bg-green-600 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${potentialScore}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Score Explanation */}
                            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    {potentialScore > originalScore ? (
                                        <><strong>Great improvement!</strong> Your content score increased by {potentialScore - originalScore} points through AI optimization.</>
                                    ) : potentialScore === originalScore ? (
                                        <><strong>Score maintained.</strong> Your content was already well-optimized for {platformInfo.name}!</>
                                    ) : (
                                        <><strong>Score adjustment.</strong> AI analysis provided different insights for better optimization. The new score reflects improved content structure and engagement.</>
                                    )}
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                                    Scores are based on platform-specific criteria including engagement, structure, and optimization best practices.
                                </p>
                            </div>
                        </div>

                        {/* Priority Improvements */}
                        {improvements.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-500" />
                                    Priority Improvements
                                </h3>
                                <div className="space-y-2">
                                    {improvements.slice(0, 5).map((improvement: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="text-sm font-medium">{improvement.area}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground max-w-32 truncate">{improvement.suggestions?.[0] || 'Improve this area'}</span>
                                                <span className="text-sm font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">+{improvement.priority} pts</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Content Comparison */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                {platformInfo.name}-Optimized Content
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Original Content */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                        Original Content
                                    </h4>
                                    <div className="w-full h-48 bg-muted/30 rounded-lg p-3 border overflow-y-auto">
                                        <pre className="whitespace-pre-wrap text-sm text-foreground m-0">{originalContent}</pre>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => copyToClipboard(originalContent)}
                                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                            title="Copy original content"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Optimized Content */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Optimized Content
                                    </h4>
                                    <div className="w-full h-48 bg-muted/30 rounded-lg p-3 border overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                                        <pre className="whitespace-pre-wrap text-sm text-foreground m-0">{currentContent}</pre>
                                    </div>
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => copyToClipboard(content)}
                                            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                            title="Copy optimized content"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={handleRedoOptimization}
                                            className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                            title="Redo optimization"
                                            disabled={isGenerating}
                                        >
                                            {isGenerating ? (
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                a.download = `${platform}-optimized-content.txt`
                                                a.click()
                                                URL.revokeObjectURL(url)
                                            }}
                                            className="p-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                                            title="Download as TXT"
                                        >
                                            <Download className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                        {isGenerating ? (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                <span>Generating...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-xs text-muted-foreground font-bold mr-2">Try different tones:</span>
                                                {renderToneButtons()}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Stats */}
                        <div className="space-y-4 pt-4 border-t">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-muted/30 rounded-lg">
                                    <div className="text-lg font-bold text-blue-600">{content.split(' ').length}</div>
                                    <div className="text-xs text-muted-foreground">Words</div>
                                </div>
                                <div className="text-center p-3 bg-muted/30 rounded-lg">
                                    <div className="text-lg font-bold text-purple-600">{content.length}</div>
                                    <div className="text-xs text-muted-foreground">Characters</div>
                                </div>
                                <div className="text-center p-3 bg-muted/30 rounded-lg">
                                    <div className="text-lg font-bold text-green-600">{Math.ceil(content.split(' ').length / 200 * 100)}%</div>
                                    <div className="text-xs text-muted-foreground">Readability</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
