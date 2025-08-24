interface CircularProgressProps {
    value: number
    max: number
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'success' | 'warning' | 'danger'
    showValue?: boolean
    className?: string
}

export default function CircularProgress({
    value,
    max,
    size = 'md',
    color = 'primary',
    showValue = true,
    className = ''
}: CircularProgressProps) {
    const percentage = (value / max) * 100
    const strokeWidth = size === 'lg' ? 3 : size === 'md' ? 2.5 : 2
    const dimensions = size === 'lg' ? 96 : size === 'md' ? 80 : 64

    const colorClasses = {
        primary: 'text-slate-600 dark:text-slate-400',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        danger: 'text-red-600 dark:text-red-400'
    }

    const bgColorClasses = {
        primary: 'text-slate-200 dark:text-slate-700',
        success: 'text-green-200 dark:text-green-800',
        warning: 'text-yellow-200 dark:text-yellow-800',
        danger: 'text-red-200 dark:text-red-800'
    }

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            {/* Circular Progress Ring */}
            <svg
                className={`transform -rotate-90 transition-all duration-500`}
                width={dimensions}
                height={dimensions}
                viewBox="0 0 36 36"
            >
                {/* Background circle */}
                <path
                    className={bgColorClasses[color]}
                    stroke="currentColor"
                    strokeWidth={strokeWidth.toString()}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Progress circle */}
                <path
                    className={`${colorClasses[color]} transition-all duration-1500 ease-out`}
                    stroke="currentColor"
                    strokeWidth={strokeWidth.toString()}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    strokeDasharray={`${percentage}, 100`}
                    style={{
                        strokeDasharray: `${percentage}, 100`,
                        animation: 'progressAnimation 1.5s ease-out'
                    }}
                />
            </svg>

            {/* Value Text */}
            {showValue && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-bold text-slate-700 dark:text-slate-300 transition-all duration-500 ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg'
                        }`}>
                        {value}
                    </span>
                </div>
            )}
        </div>
    )
}
