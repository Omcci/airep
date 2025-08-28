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
    platform?: 'linkedin' | 'twitter' | 'blog' | 'email'
}

export default function AIPerceptionMetrics({ aiPerception, isExpanded = false }: AIPerceptionMetricsProps) {
    const metrics = [
        { key: 'authority', label: 'Authority', emoji: '👑', tip: 'Clear expertise and leadership signals.' },
        { key: 'credibility', label: 'Credibility', emoji: '🔒', tip: 'Trust from evidence, sources, consistency.' },
        { key: 'expertise', label: 'Expertise', emoji: '🧠', tip: 'Depth, specificity, and accurate terminology.' },
        { key: 'freshness', label: 'Freshness', emoji: '🆕', tip: 'Current, timely, and relevant context.' },
        { key: 'rankingPotential', label: 'Ranking', emoji: '🚀', tip: 'Overall discoverability and shareability.' }
    ] as const

    // Neutral, consistent palette
    const containerClass = 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/30 border border-slate-200 dark:border-slate-800'
    const valueClass = 'text-slate-800 dark:text-slate-200'
    const labelClass = 'text-slate-600 dark:text-slate-400'

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

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
                {metrics.map((metric) => (
                    <div key={metric.key} className={`${containerClass} rounded-xl p-3 text-center transition-all duration-500 ${isExpanded ? 'p-4' : 'p-3'}`}>
                        <div className={`text-2xl mb-2 transition-all duration-500 ${isExpanded ? 'text-3xl' : 'text-2xl'}`}>{metric.emoji}</div>
                        <div className={`font-bold ${valueClass} transition-all duration-500 ${isExpanded ? 'text-xl' : 'text-lg'}`}>
                            {aiPerception[metric.key as keyof AIPerceptionData]}
                        </div>
                        <div className={`text-xs ${labelClass} transition-all duration-500 ${isExpanded ? 'text-sm' : 'text-xs'}`}>{metric.label}</div>
                        <div className={`mt-1 text-[10px] ${labelClass} opacity-80`}>Tip: {metric.tip}</div>
                    </div>
                ))}
            </div>

            <div className={`text-center p-3 bg-slate-50 dark:bg-slate-950/30 rounded-lg border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto transition-all duration-500 ${isExpanded ? 'p-4 rounded-xl' : 'p-3 rounded-lg'}`}>
                <p className={`text-slate-700 dark:text-slate-300 transition-all duration-500 ${isExpanded ? 'text-base' : 'text-sm'}`}>
                    <strong>AI Authority Score:</strong> {averageScore}/100
                </p>
                <p className={`text-slate-600 dark:text-slate-400 transition-all duration-500 ${isExpanded ? 'text-sm' : 'text-xs'} mt-1`}>
                    Use these signals to increase trust, clarity, and discoverability.
                </p>
            </div>
        </div>
    )
}
