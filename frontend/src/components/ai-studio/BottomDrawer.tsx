import { useEffect, useState, useRef } from 'react'
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
    const [isExpanded, setIsExpanded] = useState(false)
    const [dragProgress, setDragProgress] = useState(0)
    const drawerContentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onToggle()
        }

        // Prevent body scroll when drawer is open
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', onEsc)
        } else {
            document.body.style.overflow = 'unset'
            // Reset expanded state when drawer is closed
            setIsExpanded(false)
            setDragProgress(0)
        }

        return () => {
            document.body.style.overflow = 'unset'
            window.removeEventListener('keydown', onEsc)
        }
    }, [isOpen, onToggle])

    // Additional scroll prevention when expanded
    useEffect(() => {
        if (isExpanded) {
            // Prevent main page scroll when expanded
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.width = '100%'
        } else {
            // Restore scroll when not expanded
            document.body.style.overflow = 'hidden' // Keep hidden since drawer is open
            document.body.style.position = ''
            document.body.style.width = ''
        }

        return () => {
            // Cleanup
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.width = ''
        }
    }, [isExpanded])

    // Reset expanded state when drawer is closed via drag
    useEffect(() => {
        if (!isOpen) {
            setIsExpanded(false)
            setDragProgress(0)
        } else {
            // Ensure drawer starts in collapsed state when opened
            setIsExpanded(false)
            setDragProgress(0)
        }
    }, [isOpen])

    // Handle scroll events within the drawer
    useEffect(() => {
        const drawerContent = drawerContentRef.current
        if (!drawerContent || !isOpen) return

        const preventScrollBubble = (e: Event) => {
            e.stopPropagation()
        }

        // Prevent scroll events from bubbling to parent
        drawerContent.addEventListener('wheel', preventScrollBubble, { passive: false })
        drawerContent.addEventListener('touchmove', preventScrollBubble, { passive: false })

        return () => {
            drawerContent.removeEventListener('wheel', preventScrollBubble)
            drawerContent.removeEventListener('touchmove', preventScrollBubble)
        }
    }, [isOpen])

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
                className="text-xs hover:text-foreground transition-colors cursor-pointer px-1"
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
                    className={`transition-all duration-500 ease-out ${isExpanded
                        ? 'h-screen max-h-screen rounded-none border-0'
                        : 'h-[85vh] max-h-[85vh] rounded-t-3xl border-t-2 border-gray-200 dark:border-gray-700'
                        } p-0`}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onDragUp={() => { }} // Empty function to hide close button
                    style={{
                        transform: isExpanded ? 'translateY(0)' : 'translateY(0)',
                        height: isExpanded ? '100vh' : `${85 + (dragProgress * 15)}vh`,
                        maxHeight: isExpanded ? '100vh' : `${85 + (dragProgress * 15)}vh`,
                    }}
                >
                    {/* Drag Handle Area - Always visible at the top */}
                    <div
                        className={`px-6 py-3 border-b border-border cursor-ns-resize select-none transition-all duration-500 ${isExpanded ? 'px-8 py-4' : 'px-6 py-3'
                            }`}
                        onMouseDown={(e) => {
                            if (e.button !== 0) return
                            const startY = e.clientY

                            // Reset drag progress at start of new gesture
                            setDragProgress(0)

                            const handleMouseMove = (e: MouseEvent) => {
                                if (isExpanded) {
                                    // When expanded, dragging down should collapse
                                    const deltaY = e.clientY - startY
                                    const progress = Math.min(Math.max(deltaY / 100, 0), 1)
                                    setDragProgress(1 - progress)

                                    if (deltaY > 100) {
                                        setIsExpanded(false)
                                        setDragProgress(0)
                                        document.removeEventListener('mousemove', handleMouseMove)
                                        document.removeEventListener('mouseup', handleMouseUp)
                                    }
                                } else {
                                    // When collapsed, check if dragging down to close or up to expand
                                    const deltaY = startY - e.clientY
                                    const upDeltaY = Math.abs(deltaY)
                                    const downDeltaY = e.clientY - startY

                                    if (deltaY > 0) {
                                        // Dragging up - expand
                                        const progress = Math.min(Math.max(upDeltaY / 100, 0), 1)
                                        setDragProgress(progress)

                                        if (upDeltaY > 100) {
                                            setIsExpanded(true)
                                            setDragProgress(1)
                                            document.removeEventListener('mousemove', handleMouseMove)
                                            document.removeEventListener('mouseup', handleMouseUp)
                                        }
                                    } else if (downDeltaY > 0) {
                                        // Dragging down - close drawer
                                        const progress = Math.min(Math.max(downDeltaY / 100, 0), 1)
                                        setDragProgress(progress)

                                        if (downDeltaY > 100) {
                                            onToggle() // Close the drawer
                                            document.removeEventListener('mousemove', handleMouseMove)
                                            document.removeEventListener('mouseup', handleMouseUp)
                                        }
                                    }
                                }
                            }

                            const handleMouseUp = () => {
                                if (isExpanded) {
                                    // When expanded, check if should collapse
                                    if (dragProgress < 0.5) {
                                        setIsExpanded(false)
                                        setDragProgress(0)
                                    } else {
                                        setDragProgress(1)
                                    }
                                } else {
                                    // When collapsed, check if should expand or close
                                    const deltaY = startY - (document.activeElement as any)?.getBoundingClientRect?.()?.top || startY
                                    if (deltaY > 0 && dragProgress > 0.5) {
                                        // Dragged up enough - expand
                                        setIsExpanded(true)
                                        setDragProgress(1)
                                    } else if (deltaY < 0 && dragProgress > 0.5) {
                                        // Dragged down enough - close
                                        onToggle()
                                    } else {
                                        // Reset progress
                                        setDragProgress(0)
                                    }
                                }
                                document.removeEventListener('mousemove', handleMouseMove)
                                document.removeEventListener('mouseup', handleMouseUp)
                            }

                            document.addEventListener('mousemove', handleMouseMove)
                            document.addEventListener('mouseup', handleMouseUp)
                        }}
                        onTouchStart={(e) => {
                            const startY = e.touches[0].clientY

                            // Reset drag progress at start of new gesture
                            setDragProgress(0)

                            const handleTouchMove = (e: TouchEvent) => {
                                if (isExpanded) {
                                    // When expanded, dragging down should collapse
                                    const deltaY = e.touches[0].clientY - startY
                                    const progress = Math.min(Math.max(deltaY / 100, 0), 1)
                                    setDragProgress(1 - progress)

                                    if (deltaY > 100) {
                                        setIsExpanded(false)
                                        setDragProgress(0)
                                        document.removeEventListener('touchmove', handleTouchMove)
                                        document.removeEventListener('touchend', handleTouchEnd)
                                    }
                                } else {
                                    // When collapsed, check if dragging down to close or up to expand
                                    const deltaY = startY - e.touches[0].clientY
                                    const upDeltaY = Math.abs(deltaY)
                                    const downDeltaY = e.touches[0].clientY - startY

                                    if (deltaY > 0) {
                                        // Dragging up - expand
                                        const progress = Math.min(Math.max(upDeltaY / 100, 0), 1)
                                        setDragProgress(progress)

                                        if (upDeltaY > 100) {
                                            setIsExpanded(true)
                                            setDragProgress(1)
                                            document.removeEventListener('touchmove', handleTouchMove)
                                            document.removeEventListener('touchend', handleTouchEnd)
                                        }
                                    } else if (downDeltaY > 0) {
                                        // Dragging down - close drawer
                                        const progress = Math.min(Math.max(downDeltaY / 100, 0), 1)
                                        setDragProgress(progress)

                                        if (downDeltaY > 100) {
                                            onToggle() // Close the drawer
                                            document.removeEventListener('touchmove', handleTouchMove)
                                            document.removeEventListener('touchend', handleTouchEnd)
                                        }
                                    }
                                }
                            }

                            const handleTouchEnd = () => {
                                if (isExpanded) {
                                    // When expanded, check if should collapse
                                    if (dragProgress < 0.5) {
                                        setIsExpanded(false)
                                        setDragProgress(0)
                                    } else {
                                        setDragProgress(1)
                                    }
                                } else {
                                    // When collapsed, check if should expand or close
                                    const deltaY = startY - (e.changedTouches[0]?.clientY || startY)
                                    if (deltaY > 0 && dragProgress > 0.5) {
                                        // Dragged up enough - expand
                                        setIsExpanded(true)
                                        setDragProgress(1)
                                    } else if (deltaY < 0 && dragProgress > 0.5) {
                                        // Dragged down enough - close
                                        onToggle()
                                    } else {
                                        // Reset progress
                                        setDragProgress(0)
                                    }
                                }
                                document.removeEventListener('touchmove', handleTouchMove)
                                document.removeEventListener('touchend', handleTouchEnd)
                            }

                            document.addEventListener('touchmove', handleTouchMove)
                            document.addEventListener('touchend', handleTouchEnd)
                        }}
                    >
                        <div className="flex items-center justify-center">
                            {/* Visual drag indicator - just the animated bar */}
                            <div className={`bg-muted-foreground/30 rounded-full overflow-hidden transition-all duration-500 ${isExpanded ? 'w-16 h-1' : 'w-20 h-1.5'
                                }`}>
                                <div
                                    className={`bg-primary rounded-full transition-all duration-150 ease-out ${isExpanded ? 'h-1' : 'h-1.5'
                                        }`}
                                    style={{
                                        width: isExpanded
                                            ? `${(1 - dragProgress) * 100}%`
                                            : `${dragProgress * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <SheetHeader className={`border-b pb-4 flex-shrink-0 px-6 pt-6 transition-all duration-500 ${isExpanded ? 'px-8 pt-8' : 'px-6 pt-6'
                        }`}>
                        <SheetTitle className="flex items-center gap-2">
                            <span className={`transition-all duration-500 ${isExpanded ? 'text-2xl' : 'text-lg'
                                }`}>{platformInfo.icon}</span>
                            <span className={`${platformInfo.color} transition-all duration-500 ${isExpanded ? 'text-2xl' : 'text-lg'
                                }`}>
                                {isExpanded ? `${platformInfo.name} Optimization Results` : 'Preview & Copy'}
                            </span>
                        </SheetTitle>
                    </SheetHeader>

                    {/* Content Container - Transforms based on expanded state */}
                    <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-500 ${isExpanded ? 'p-8' : 'p-6'
                        }`}
                        style={{
                            height: isExpanded ? 'calc(100vh - 140px)' : 'auto',
                            maxHeight: isExpanded ? 'calc(100vh - 140px)' : 'auto'
                        }}>
                        {/* Debug info - remove in production */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="text-xs text-muted-foreground mb-2">
                                Debug: isExpanded={isExpanded.toString()}, dragProgress={dragProgress.toFixed(2)}
                            </div>
                        )}
                        <div className={`transition-all duration-500 ${isExpanded ? 'max-w-6xl mx-auto space-y-8' : 'space-y-6'
                            }`}>
                            {/* Score Section */}
                            <div className={`space-y-4 transition-all duration-500 ${isExpanded ? 'space-y-6' : 'space-y-4'
                                }`}>
                                <div className="text-center">
                                    <h3 className={`font-semibold mb-2 transition-all duration-500 ${isExpanded ? 'text-2xl' : 'text-lg'
                                        }`}>Content Optimization Results</h3>
                                    <p className={`text-muted-foreground transition-all duration-500 ${isExpanded ? 'text-lg' : 'text-sm'
                                        }`}>
                                        Your content has been analyzed and optimized for {platformInfo.name}
                                    </p>
                                </div>

                                {/* Score Cards - Responsive Grid */}
                                <div className="flex justify-center">
                                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-500 ${isExpanded ? 'gap-6 max-w-3xl' : 'gap-4 max-w-2xl'
                                        }`}>
                                        {/* Original Score Card */}
                                        <div className={`bg-card border border-border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-500 ${isExpanded ? 'p-6 rounded-2xl shadow-lg hover:shadow-xl' : 'p-4 rounded-xl shadow-sm hover:shadow-md'
                                            }`}>
                                            <div className={`relative inline-flex items-center justify-center mx-auto mb-3 transition-all duration-500 ${isExpanded ? 'w-24 h-24 mb-4' : 'w-20 h-20 mb-3'
                                                }`}>
                                                {/* Circular Progress Ring */}
                                                <svg className={`transform -rotate-90 transition-all duration-500 ${isExpanded ? 'w-24 h-24' : 'w-20 h-20'
                                                    }`} viewBox="0 0 36 36">
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
                                                    <span className={`font-bold text-slate-700 dark:text-slate-300 transition-all duration-500 ${isExpanded ? 'text-2xl' : 'text-xl'
                                                        }`}>
                                                        {originalScore}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`font-medium text-slate-600 dark:text-slate-400 transition-all duration-500 ${isExpanded ? 'text-lg' : 'text-sm'
                                                }`}>Original Score</div>
                                            <div className={`text-muted-foreground mt-1 transition-all duration-500 ${isExpanded ? 'text-sm' : 'text-xs'
                                                }`}>Baseline assessment</div>
                                        </div>

                                        {/* Optimized Score Card */}
                                        <div className={`bg-card border border-border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-500 relative ${isExpanded ? 'p-6 rounded-2xl shadow-lg hover:shadow-xl' : 'p-4 rounded-xl shadow-sm hover:shadow-md'
                                            }`}>
                                            {/* Improvement Badge */}
                                            {potentialScore > originalScore && (
                                                <div className={`absolute text-white font-bold rounded-full shadow-lg transition-all duration-500 ${isExpanded ? '-top-3 -right-3 bg-green-500 text-sm px-3 py-1' : '-top-2 -right-2 bg-green-500 text-xs px-2 py-1'
                                                    }`}>
                                                    +{potentialScore - originalScore}
                                                </div>
                                            )}

                                            <div className={`relative inline-flex items-center justify-center mx-auto mb-3 transition-all duration-500 ${isExpanded ? 'w-24 h-24 mb-4' : 'w-20 h-20 mb-3'
                                                }`}>
                                                {/* Circular Progress Ring */}
                                                <svg className={`transform -rotate-90 transition-all duration-500 ${isExpanded ? 'w-24 h-24' : 'w-20 h-20'
                                                    }`} viewBox="0 0 36 36">
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
                                                    <span className={`font-bold text-green-700 dark:text-green-300 transition-all duration-500 ${isExpanded ? 'text-2xl' : 'text-xl'
                                                        }`}>
                                                        {potentialScore}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`font-medium text-green-600 dark:text-green-400 transition-all duration-500 ${isExpanded ? 'text-lg' : 'text-sm'
                                                }`}>Optimized Score</div>
                                            <div className={`text-muted-foreground mt-1 transition-all duration-500 ${isExpanded ? 'text-sm' : 'text-xs'
                                                }`}>
                                                {potentialScore > originalScore ? 'AI enhanced' : 'Quality maintained'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Score Summary Message */}
                                <div className={`text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto transition-all duration-500 ${isExpanded ? 'p-4 rounded-xl max-w-3xl' : 'p-3 rounded-lg max-w-2xl'
                                    }`}>
                                    {potentialScore > originalScore ? (
                                        <p className={`text-blue-800 dark:text-blue-200 transition-all duration-500 ${isExpanded ? 'text-lg' : 'text-sm'
                                            }`}>
                                            <strong>Great improvement!</strong> Your content score increased by {potentialScore - originalScore} points through AI optimization.
                                        </p>
                                    ) : potentialScore === originalScore ? (
                                        <p className={`text-blue-800 dark:text-blue-200 transition-all duration-500 ${isExpanded ? 'text-lg' : 'text-sm'
                                            }`}>
                                            <strong>Score maintained.</strong> Your content was already well-optimized for {platformInfo.name}!
                                        </p>
                                    ) : (
                                        <p className={`text-blue-800 dark:text-blue-200 transition-all duration-500 ${isExpanded ? 'text-lg' : 'text-sm'
                                            }`}>
                                            <strong>🎉 Congratulations! Your Content is Already High Quality!</strong> The AI couldn't significantly improve your score because your content already demonstrates excellent quality.
                                        </p>
                                    )}
                                </div>
                            </div>

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
                                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <p className="text-xs text-blue-800 dark:text-blue-200">
                                            <strong>AI Suggestions Available:</strong> Even though your score couldn't be improved, the AI has provided optimization suggestions below for your consideration.
                                        </p>
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
                                                        a.download = `${platform}-optimized-content.txt`
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
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
