import ScoreCard from './ScoreCard'

interface ScoreSectionProps {
    originalScore: number
    optimizedScore: number
    isExpanded: boolean
    className?: string
}

export default function ScoreSection({
    originalScore,
    optimizedScore,
    isExpanded,
    className = ''
}: ScoreSectionProps) {
    const improvement = optimizedScore - originalScore
    const size = isExpanded ? 'lg' : 'md'
    const spaceY = isExpanded ? 'space-y-6' : 'space-y-4'
    const titleSize = isExpanded ? 'text-2xl' : 'text-lg'
    const subtitleSize = isExpanded ? 'text-lg' : 'text-sm'
    const summarySize = isExpanded ? 'text-lg' : 'text-sm'
    const summaryPadding = isExpanded ? 'p-4 rounded-xl max-w-3xl' : 'p-3 rounded-lg max-w-2xl'

    return (
        <div className={`space-y-4 transition-all duration-500 ${spaceY} ${className}`}>
            <div className="text-center">
                <h3 className={`font-semibold mb-2 transition-all duration-500 ${titleSize}`}>
                    Content Optimization Results
                </h3>
                <p className={`text-muted-foreground transition-all duration-500 ${subtitleSize}`}>
                    Your content has been analyzed and optimized
                </p>
            </div>

            {/* Score Cards - Responsive Grid */}
            <div className="flex justify-center">
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-500 ${isExpanded ? 'gap-6 max-w-3xl' : 'gap-4 max-w-2xl'}`}>
                    {/* Original Score Card */}
                    <ScoreCard
                        score={originalScore}
                        maxScore={100}
                        title="Original Score"
                        subtitle="Baseline assessment"
                        size={size}
                        color="primary"
                        showImprovement={false}
                    />

                    {/* Optimized Score Card */}
                    <ScoreCard
                        score={optimizedScore}
                        maxScore={100}
                        title="Optimized Score"
                        subtitle={optimizedScore > originalScore ? 'AI enhanced' : 'Quality maintained'}
                        size={size}
                        color="success"
                        showImprovement={true}
                        improvement={improvement > 0 ? improvement : 0}
                    />
                </div>
            </div>

            {/* Score Summary Message */}
            <div className={`text-center ${summaryPadding} bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto transition-all duration-500`}>
                {optimizedScore > originalScore ? (
                    <p className={`text-blue-800 dark:text-blue-200 transition-all duration-500 ${summarySize}`}>
                        <strong>Great improvement!</strong> Your content score increased by {improvement} points through AI optimization.
                    </p>
                ) : optimizedScore === originalScore ? (
                    <p className={`text-blue-800 dark:text-blue-200 transition-all duration-500 ${summarySize}`}>
                        <strong>Score maintained.</strong> Your content was already well-optimized!
                    </p>
                ) : (
                    <p className={`text-blue-800 dark:text-blue-200 transition-all duration-500 ${summarySize}`}>
                        <strong>🎉 Congratulations! Your Content is Already High Quality!</strong> The AI couldn't significantly improve your score because your content already demonstrates excellent quality.
                    </p>
                )}
            </div>
        </div>
    )
}
