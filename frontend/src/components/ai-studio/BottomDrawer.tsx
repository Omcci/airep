import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Copy, Download, TrendingUp, Target, CheckCircle, ChevronUp } from 'lucide-react'

interface BottomDrawerProps {
    isOpen: boolean
    onToggle: () => void
    platform: 'linkedin' | 'twitter' | 'blog' | 'email'
    contentType: 'url' | 'content' | 'tool'
    optimizationResult?: any
    tool?: any
    analysisData?: any
}

export default function BottomDrawer({
    isOpen,
    onToggle,
    platform,
    contentType,
    optimizationResult,
    tool,
    analysisData
}: BottomDrawerProps) {
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

    const getOptimizedContent = () => {
        if (contentType === 'tool') {
            return optimizationResult?.snippet || 'No tool snippet available'
        }
        return optimizationResult?.optimized?.content || 'No optimized content available'
    }

    const getOriginalContent = () => {
        if (contentType === 'tool') {
            return tool?.description || tool?.tagline || 'No tool description available'
        }
        // For content optimization, get from the original input
        if (contentType === 'content') {
            return optimizationResult?.originalContent || 'No original content available'
        }
        if (contentType === 'url') {
            return optimizationResult?.originalContent || 'No original content available'
        }
        return 'No original content available'
    }

    const content = getOptimizedContent()
    const originalContent = getOriginalContent()

    // Get scores from analysis data
    const originalScore = analysisData?.score || 0
    const potentialScore = Math.min(100, originalScore + 15) // Estimate potential improvement

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
                                    +{potentialScore - originalScore} points
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
                    <SheetHeader className="border-b pb-4">
                        <SheetTitle className="flex items-center gap-2">
                            <span className="text-lg">{platformInfo.icon}</span>
                            <span className={platformInfo.color}>Preview & Copy</span>
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* Score Section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/30 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-muted-foreground">{originalScore}/100</div>
                                <div className="text-sm text-muted-foreground">Original Score</div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
                                <div className="text-2xl font-bold text-green-600">{potentialScore}/100</div>
                                <div className="text-sm text-green-600">Potential Score</div>
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
                                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm font-medium">{improvement.area}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">{improvement.suggestions?.[0] || 'Improve this area'}</span>
                                                <span className="text-sm font-bold text-green-600">+{improvement.priority} pts</span>
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
                                    <h4 className="text-sm font-medium text-muted-foreground">Original Content</h4>
                                    <div className="bg-muted/30 rounded-lg p-3 border max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                        <pre className="whitespace-pre-wrap text-sm text-foreground">
                                            {originalContent}
                                        </pre>
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
                                    <h4 className="text-sm font-medium text-muted-foreground">Optimized Content</h4>
                                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 dark:scrollbar-thumb-green-600 scrollbar-track-transparent">
                                        <pre className="whitespace-pre-wrap text-sm text-foreground">
                                            {content}
                                        </pre>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => copyToClipboard(content)}
                                            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                            title="Copy optimized content"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const blob = new Blob([content], { type: 'text/plain' })
                                    const url = URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = url
                                    a.download = `${platform}-optimized-content.txt`
                                    a.click()
                                    URL.revokeObjectURL(url)
                                }}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
