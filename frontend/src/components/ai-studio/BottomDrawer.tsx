import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Copy, Download, TrendingUp, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { TONE_OPTIONS, type ToneValue } from '@/lib/constants'
import ExpandedDrawer from '@/components/ai-studio/ExpandedDrawer'
import AIPerceptionMetrics from '@/components/ai-studio/AIPerceptionMetrics'
import AnalysisResultsDisplay from '@/components/ai-studio/AnalysisResultsDisplay'
import { useNavigate } from 'react-router-dom'

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

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onToggle()
        }

        if (isOpen) {
            window.addEventListener('keydown', onEsc)
        } else {
            // Reset expanded state when drawer is closed
            setIsExpanded(false)
            setDragProgress(0)
        }

        return () => {
            window.removeEventListener('keydown', onEsc)
        }
    }, [isOpen, onToggle])

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

    if (analysisData?.blocked || analysisData?.securityWarnings?.length > 0) {
        return null
    }

    if (analysisData?.score < 20) {
        return null
    }

    if (originalContent.length < 20 || !optimizationResult?.optimized?.content) {
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
                            {potentialScore > originalScore ? (
                                <div className="text-right">
                                    <div className="text-sm font-medium text-white">
                                        Score: {originalScore}/100 → {potentialScore}/100
                                    </div>
                                    <div className="text-xs text-slate-300">
                                        +{potentialScore - originalScore} points
                                    </div>
                                </div>
                            ) : (
                                <div className="text-right">
                                    <div className="text-sm font-medium text-white">
                                        Content Analyzed
                                    </div>
                                    <div className="text-xs text-slate-300">
                                        Already optimized
                                    </div>
                                </div>
                            )}
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
                        } p-0 flex flex-col`}
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
                        className={`px-6 py-3 cursor-ns-resize select-none transition-all duration-500 ${isExpanded ? 'px-8 py-4' : 'px-6 py-3'
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
                                {platformInfo.name} Optimization Results
                            </span>
                        </SheetTitle>
                    </SheetHeader>
                    {/* Content Container - moved scroll handling to ExpandedDrawer */}
                    {isExpanded ? (
                        <ExpandedDrawer
                            platformInfo={platformInfo}
                            originalScore={originalScore}
                            potentialScore={potentialScore}
                            improvements={improvements}
                            originalContent={originalContent}
                            currentContent={currentContent}
                            content={content}
                            copyToClipboard={copyToClipboard}
                            handleRedoOptimization={handleRedoOptimization}
                            isGenerating={isGenerating}
                            renderToneButtons={renderToneButtons}
                            analysisData={analysisData}
                        />
                    ) : (
                        <AnalysisResultsDisplay
                            isExpanded={false}
                            platformInfo={platformInfo}
                            originalScore={originalScore}
                            potentialScore={potentialScore}
                            improvements={improvements}
                            originalContent={originalContent}
                            currentContent={currentContent}
                            content={content}
                            copyToClipboard={copyToClipboard}
                            handleRedoOptimization={handleRedoOptimization}
                            isGenerating={isGenerating}
                            renderToneButtons={renderToneButtons}
                            analysisData={analysisData}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
