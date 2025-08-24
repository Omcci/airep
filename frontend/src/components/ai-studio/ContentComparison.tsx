import { Copy, Download } from 'lucide-react'

interface ContentComparisonProps {
    originalContent: string
    optimizedContent: string
    platform: string
    isGenerating: boolean
    onCopy: (text: string) => void
    onRedo: () => void
    onDownload: (content: string, filename: string) => void
    renderToneButtons: () => React.ReactNode
    className?: string
}

export default function ContentComparison({
    originalContent,
    optimizedContent,
    platform,
    isGenerating,
    onCopy,
    onRedo,
    onDownload,
    renderToneButtons,
    className = ''
}: ContentComparisonProps) {
    return (
        <div className={`space-y-3 ${className}`}>
            <h3 className="text-base font-semibold flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {platform} Content Analysis
            </h3>

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
                            onClick={() => onCopy(originalContent)}
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
                        <pre className="whitespace-pre-wrap text-xs text-foreground m-0">{optimizedContent}</pre>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onCopy(optimizedContent)}
                                className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                title="Copy optimized content"
                            >
                                <Copy className="h-3 w-3" />
                            </button>
                            <button
                                onClick={onRedo}
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
                                onClick={() => onDownload(optimizedContent, `${platform}-optimized-content.txt`)}
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
    )
}
