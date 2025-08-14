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
                return { name: 'LinkedIn', icon: '💼', color: 'text-blue-600' }
            case 'twitter':
                return { name: 'X/Twitter', icon: '🐦', color: 'text-blue-400' }
            case 'blog':
                return { name: 'Blog/Website', icon: '📝', color: 'text-green-600' }
            case 'email':
                return { name: 'Email', icon: '📧', color: 'text-purple-600' }
            default:
                return { name: 'Platform', icon: '🌐', color: 'text-gray-600' }
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
        return optimizationResult?.original?.content || 'No original content available'
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
                <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-t-2xl shadow-lg mx-4 mb-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{platformInfo.icon}</span>
                            <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                    {platformInfo.name} Optimization Results
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Click to view and copy optimized content
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Score: {originalScore}/100 → {potentialScore}/100
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    +{potentialScore - originalScore} points
                                </div>
                            </div>
                            <ChevronUp className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Full drawer content */}
            <Sheet open={isOpen} onOpenChange={onToggle}>
                <SheetContent
                    side="bottom"
                    className="h-[85vh] max-h-[85vh] overflow-hidden rounded-t-3xl border-t-2 border-gray-200 dark:border-gray-700 [&>button]:hidden"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    {/* Toggle area at the top - click to close */}
                    <div
                        className="cursor-pointer p-2 -m-2 mb-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        onClick={onToggle}
                    >
                        <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                            <span className="text-sm">Click to close</span>
                            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        </div>
                    </div>

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
                                    <div className="bg-muted/30 rounded-lg p-3 border max-h-40 overflow-auto">
                                        <pre className="whitespace-pre-wrap text-sm text-foreground">
                                            {originalContent}
                                        </pre>
                                    </div>
                                </div>

                                {/* Optimized Content */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">Optimized Content</h4>
                                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800 max-h-40 overflow-auto">
                                        <pre className="whitespace-pre-wrap text-sm text-foreground">
                                            {content}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t">
                            <Button
                                onClick={() => copyToClipboard(content)}
                                className="flex-1"
                                variant="default"
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Optimized Content
                            </Button>

                            <Button
                                onClick={() => copyToClipboard(originalContent)}
                                variant="outline"
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Original
                            </Button>

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

                        {/* Platform-specific tips */}
                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                                💡 {platformInfo.name} Optimization Tips
                            </h4>
                            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                {platform === 'linkedin' && (
                                    <>
                                        <li>• Use professional language and industry-specific terms</li>
                                        <li>• Include relevant hashtags for discoverability</li>
                                        <li>• Keep paragraphs short and scannable</li>
                                    </>
                                )}
                                {platform === 'twitter' && (
                                    <>
                                        <li>• Optimize for character limits</li>
                                        <li>• Use engaging hooks and clear calls-to-action</li>
                                        <li>• Include relevant hashtags and mentions</li>
                                    </>
                                )}
                                {platform === 'blog' && (
                                    <>
                                        <li>• Structure with clear headings and subheadings</li>
                                        <li>• Include meta descriptions and keywords</li>
                                        <li>• Optimize for readability and SEO</li>
                                    </>
                                )}
                                {platform === 'email' && (
                                    <>
                                        <li>• Use clear subject lines and greetings</li>
                                        <li>• Keep content concise and actionable</li>
                                        <li>• Include professional signatures</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
