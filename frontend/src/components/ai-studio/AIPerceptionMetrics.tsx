interface AIPerceptionData {
    authority: number
    credibility: number
    expertise: number
    freshness: number
    rankingPotential: number
}

interface AIPerceptionMetricsProps {
    aiPerception: AIPerceptionData
    isExpanded?: boolean
}

export default function AIPerceptionMetrics({ aiPerception, isExpanded = false }: AIPerceptionMetricsProps) {
    const metrics = [
        { key: 'authority', label: 'Authority', emoji: '👑', color: 'blue' },
        { key: 'credibility', label: 'Credibility', emoji: '🔒', color: 'green' },
        { key: 'expertise', label: 'Expertise', emoji: '🧠', color: 'purple' },
        { key: 'freshness', label: 'Freshness', emoji: '🆕', color: 'orange' },
        { key: 'rankingPotential', label: 'Ranking', emoji: '🚀', color: 'red' }
    ]

    const getColorClasses = (color: string) => {
        const colorMap = {
            blue: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-blue-600 dark:text-blue-400',
            green: 'from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-green-600 dark:text-green-400',
            purple: 'from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-purple-600 dark:text-purple-400',
            orange: 'from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-orange-600 dark:text-orange-400',
            red: 'from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-red-600 dark:text-red-400'
        }
        return colorMap[color as keyof typeof colorMap] || colorMap.blue
    }

    const averageScore = Math.round((aiPerception.authority + aiPerception.credibility + aiPerception.expertise + aiPerception.freshness + aiPerception.rankingPotential) / 5)

    return (
        <div className={`space-y-4 transition-all duration-500 ${isExpanded ? 'space-y-6' : 'space-y-4'}`}>
            <div className="text-center">
                <h4 className={`font-semibold mb-3 transition-all duration-500 ${isExpanded ? 'text-xl' : 'text-lg'}`}>
                    🎯 AI Authority Assessment
                </h4>
                <p className={`text-muted-foreground transition-all duration-500 ${isExpanded ? 'text-base' : 'text-sm'}`}>
                    How AI systems perceive your content's authority and ranking potential
                </p>
            </div>

            {/* AI Perception Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
                {metrics.map((metric) => {
                    const colorClasses = getColorClasses(metric.color)
                    const [bgClasses, borderClasses, textClasses, labelClasses] = colorClasses.split(' ')

                    return (
                        <div key={metric.key} className={`bg-gradient-to-br ${bgClasses} border ${borderClasses} rounded-xl p-3 text-center transition-all duration-500 ${isExpanded ? 'p-4' : 'p-3'}`}>
                            <div className={`text-2xl mb-2 transition-all duration-500 ${isExpanded ? 'text-3xl' : 'text-2xl'}`}>{metric.emoji}</div>
                            <div className={`font-bold ${textClasses} transition-all duration-500 ${isExpanded ? 'text-xl' : 'text-lg'}`}>
                                {aiPerception[metric.key as keyof AIPerceptionData]}
                            </div>
                            <div className={`text-xs ${labelClasses} transition-all duration-500 ${isExpanded ? 'text-sm' : 'text-xs'}`}>{metric.label}</div>
                        </div>
                    )
                })}
            </div>

            {/* AI Perception Summary */}
            <div className={`text-center p-3 bg-slate-50 dark:bg-slate-950/30 rounded-lg border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto transition-all duration-500 ${isExpanded ? 'p-4 rounded-xl' : 'p-3 rounded-lg'}`}>
                <p className={`text-slate-700 dark:text-slate-300 transition-all duration-500 ${isExpanded ? 'text-base' : 'text-sm'}`}>
                    <strong>AI Authority Score:</strong> {averageScore}/100
                </p>
                <p className={`text-slate-600 dark:text-slate-400 transition-all duration-500 ${isExpanded ? 'text-sm' : 'text-xs'} mt-1`}>
                    This indicates how well AI systems will recognize and rank your content
                </p>
            </div>
        </div>
    )
}
