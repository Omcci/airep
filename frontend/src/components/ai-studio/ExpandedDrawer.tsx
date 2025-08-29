import AnalysisResultsDisplay from '@/components/ai-studio/AnalysisResultsDisplay'

type PlatformInfo = {
    name: string
    icon: React.ReactNode
    color: string
}

interface ExpandedDrawerProps {
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

export default function ExpandedDrawer(props: ExpandedDrawerProps) {
    const {
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
    } = props

    return (
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar transition-all duration-500 p-8">
            <div className="transition-all duration-500 max-w-6xl mx-auto space-y-8">
                <AnalysisResultsDisplay
                    isExpanded={true}
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
            </div>
        </div>
    )
}



