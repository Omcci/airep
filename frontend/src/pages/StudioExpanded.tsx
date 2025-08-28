import { useLocation, useNavigate } from 'react-router-dom'
import ExpandedDrawer from '@/components/ai-studio/ExpandedDrawer'

export default function StudioExpanded() {
    const navigate = useNavigate()
    const location = useLocation() as any

    const state = location.state || {}

    const {
        platform = 'linkedin',
        analysisData,
        optimizationResult,
        originalContent = '',
    } = state

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
                return { name: 'Platform', icon: null, color: 'text-gray-600 dark:text-gray-400' }
        }
    }

    const platformInfo = getPlatformInfo()

    const originalScore = analysisData?.score || 0
    const optimizedScore = optimizationResult?.optimized?.score || originalScore
    const potentialScore = optimizedScore

    const improvements = optimizationResult?.improvements || []
    const content = optimizationResult?.optimized?.content || ''

    // Fallback: derive aiPerception from optimization payload if missing on analysisData
    const mergedAnalysisData = analysisData && !analysisData.aiPerception
        ? { ...analysisData, aiPerception: optimizationResult?.consensus?.aiPerception || optimizationResult?.aiPerception }
        : analysisData

    const handleBack = () => navigate(-1)

    const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

    const handleRedoOptimization = () => { }

    const renderToneButtons = () => []

    return (
        <div className="min-h-[calc(100vh-64px)] p-4">
            <div className="max-w-6xl mx-auto">
                <button onClick={handleBack} className="mb-4 text-sm text-muted-foreground hover:text-foreground">← Back</button>
                <ExpandedDrawer
                    platformInfo={platformInfo}
                    originalScore={originalScore}
                    potentialScore={potentialScore}
                    improvements={improvements}
                    originalContent={originalContent}
                    currentContent={content}
                    content={content}
                    copyToClipboard={copyToClipboard}
                    handleRedoOptimization={handleRedoOptimization}
                    isGenerating={false}
                    renderToneButtons={renderToneButtons}
                    analysisData={mergedAnalysisData}
                />
            </div>
        </div>
    )
}
