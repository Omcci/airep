import { CheckCircle, Target, CircleAlert } from 'lucide-react'

interface ProgressIndicatorProps {
    currentStep: 'analyze' | 'preview' | 'deploy'
    steps: { key: string; label: string; description: string }[]
}

export default function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
    const getStepStatus = (step: string) => {
        const stepOrder = ['analyze', 'preview', 'deploy']
        const currentIndex = stepOrder.indexOf(currentStep)
        const stepIndex = stepOrder.indexOf(step)

        if (stepIndex < currentIndex) return 'completed'
        if (stepIndex === currentIndex) return 'current'
        return 'upcoming'
    }

    const getStepIcon = (status: string) => {
        if (status === 'completed') return <CheckCircle className="h-5 w-5 text-green-500" />
        if (status === 'current') return <Target className="h-5 w-5 text-primary" />
        return <CircleAlert className="h-5 w-5 text-muted-foreground" />
    }

    return (
        <div className="flex justify-center mb-8">
            <div className="flex space-x-8">
                {steps.map((step, index) => {
                    const status = getStepStatus(step.key)
                    return (
                        <div key={step.key} className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background">
                                {getStepIcon(status)}
                            </div>
                            <div className="text-sm">
                                <div className="font-medium">{step.label}</div>
                                <div className="text-muted-foreground">{step.description}</div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-8 h-0.5 transition-colors duration-300 ${status === 'completed' ? 'bg-green-500' : 'bg-muted'
                                    }`} />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
