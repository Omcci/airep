import { Button } from '@/components/ui/button'
import { Sparkles, Eye, CheckCircle, ArrowRight } from 'lucide-react'

interface FloatingActionButtonProps {
    currentStep: 'analyze' | 'preview' | 'deploy'
    onAction: () => void
    isDisabled?: boolean
    isLoading?: boolean
    contentType: 'url' | 'content' | 'tool'
}

export default function FloatingActionButton({
    currentStep,
    onAction,
    isDisabled = false,
    isLoading = false,
    contentType
}: FloatingActionButtonProps) {
    const getButtonConfig = () => {
        switch (currentStep) {
            case 'analyze':
                return {
                    icon: <Sparkles className="w-4 h-4" />,
                    text: contentType === 'tool' ? 'Optimize Tool' : 'Analyze & Optimize',
                    variant: 'default' as const,
                    className: 'bg-primary hover:bg-primary/90'
                }
            case 'preview':
                return {
                    icon: <Eye className="h-4 w-4" />,
                    text: 'View Results',
                    variant: 'default' as const,
                    className: 'bg-green-600 hover:bg-green-700'
                }
            case 'deploy':
                return {
                    icon: <CheckCircle className="h-4 w-4" />,
                    text: 'All Done!',
                    variant: 'outline' as const,
                    className: 'bg-green-50 border-green-200 text-green-800'
                }
            default:
                return {
                    icon: <ArrowRight className="h-4 w-4" />,
                    text: 'Continue',
                    variant: 'default' as const,
                    className: 'bg-primary hover:bg-primary/90'
                }
        }
    }

    const config = getButtonConfig()

    if (currentStep === 'deploy') {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg border p-3">
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Optimization Complete!</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Button
                onClick={onAction}
                disabled={isDisabled || isLoading}
                size="lg"
                variant={config.variant}
                className={`${config.className} rounded-full shadow-lg px-6 py-3 text-white`}
            >
                {isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing...
                    </>
                ) : (
                    <>
                        {config.icon}
                        <span className="ml-2">{config.text}</span>
                    </>
                )}
            </Button>
        </div>
    )
}
