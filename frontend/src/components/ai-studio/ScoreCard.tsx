import CircularProgress from '@/components/ui/circular-progress'

interface ScoreCardProps {
    score: number
    maxScore: number
    title: string
    subtitle: string
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'success' | 'warning' | 'danger'
    showImprovement?: boolean
    improvement?: number
    className?: string
}

export default function ScoreCard({
    score,
    maxScore,
    title,
    subtitle,
    size = 'md',
    color = 'primary',
    showImprovement = false,
    improvement = 0,
    className = ''
}: ScoreCardProps) {
    const sizeClasses = {
        sm: 'p-4 rounded-xl shadow-sm hover:shadow-md',
        md: 'p-4 rounded-xl shadow-sm hover:shadow-md',
        lg: 'p-6 rounded-2xl shadow-lg hover:shadow-xl'
    }

    const progressSize = size === 'lg' ? 'lg' : size === 'md' ? 'md' : 'sm'
    const marginBottom = size === 'lg' ? 'mb-4' : 'mb-3'
    const titleSize = size === 'lg' ? 'text-lg' : 'text-sm'
    const subtitleSize = size === 'lg' ? 'text-sm' : 'text-xs'

    return (
        <div className={`bg-card border border-border ${sizeClasses[size]} text-center shadow-sm hover:shadow-md transition-all duration-500 relative ${className}`}>
            {/* Improvement Badge */}
            {showImprovement && improvement > 0 && (
                <div className={`absolute text-white font-bold rounded-full shadow-lg transition-all duration-500 ${size === 'lg' ? '-top-3 -right-3 bg-green-500 text-sm px-3 py-1' : '-top-2 -right-2 bg-green-500 text-xs px-2 py-1'
                    }`}>
                    +{improvement}
                </div>
            )}

            <div className={`relative inline-flex items-center justify-center mx-auto ${marginBottom} transition-all duration-500`}>
                <CircularProgress
                    value={score}
                    max={maxScore}
                    size={progressSize}
                    color={color}
                    showValue={true}
                />
            </div>

            <div className={`font-medium ${titleSize} ${color === 'success' ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} transition-all duration-500`}>
                {title}
            </div>
            <div className={`text-muted-foreground mt-1 ${subtitleSize} transition-all duration-500`}>
                {subtitle}
            </div>
        </div>
    )
}
