import { CheckCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SuccessNotificationProps {
    message: string
    isVisible: boolean
    onClose: () => void
    autoHide?: boolean
    autoHideDelay?: number
}

export default function SuccessNotification({
    message,
    isVisible,
    onClose,
    autoHide = true,
    autoHideDelay = 3000
}: SuccessNotificationProps) {
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true)
            if (autoHide) {
                const timer = setTimeout(() => {
                    setIsAnimating(false)
                    setTimeout(onClose, 300) // Wait for animation to complete
                }, autoHideDelay)
                return () => clearTimeout(timer)
            }
        }
    }, [isVisible, autoHide, autoHideDelay, onClose])

    if (!isVisible) return null

    return (
        <div className={`fixed top-6 right-6 z-50 transition-all duration-300 ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-green-800">{message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            onClick={() => {
                                setIsAnimating(false)
                                setTimeout(onClose, 300)
                            }}
                            className="inline-flex text-green-400 hover:text-green-600 focus:outline-none"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
