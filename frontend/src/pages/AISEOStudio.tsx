import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import PlatformSelector from '../components/ai-studio/PlatformSelector'
import ContentInput from '../components/ai-studio/ContentInput'
import AnalysisResults from '../components/ai-studio/AnalysisResults'
import BottomDrawer from '../components/ai-studio/BottomDrawer'
import FloatingActionButton from '../components/ai-studio/FloatingActionButton'
import ProgressIndicator from '../components/ai-studio/ProgressIndicator'
import SuccessNotification from '../components/ai-studio/SuccessNotification'

type WorkflowStep = 'analyze' | 'preview' | 'deploy'

export default function AISEOStudio() {
    const [currentStep, setCurrentStep] = useState<WorkflowStep>('analyze')
    const [contentType, setContentType] = useState<'url' | 'content' | 'tool'>('content')
    const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'blog' | 'email'>('linkedin')

    // Success notification state
    const [showSuccessNotification, setShowSuccessNotification] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false)

    // URL/Content analysis state
    const [url, setUrl] = useState('')
    const [content, setContent] = useState('')

    // Tool optimization state
    const [tool, setTool] = useState({
        name: '',
        homepage: '',
        tagline: '',
        description: '',
        categories: '',
        pricing: '',
        signupUrl: '',
        endpoints: '',
        examples: '',
    })

    // Mutations - now combined analysis + optimization
    const auditMutation = useMutation({
        mutationFn: api.auditEvaluate,
        onSuccess: () => {
            setSuccessMessage('Content analysis completed! Opening results...')
            setShowSuccessNotification(true)
            // Auto-advance to preview step after analysis
            setTimeout(() => setCurrentStep('preview'), 500)
        }
    })

    const optimizeMutation = useMutation({
        mutationFn: api.optimizeContent,
        onSuccess: () => {
            setSuccessMessage('Content optimization completed! Opening results...')
            setShowSuccessNotification(true)
            // Auto-advance to preview step after optimization
            setTimeout(() => setCurrentStep('preview'), 500)
        }
    })

    const boostToolMutation = useMutation({
        mutationFn: api.boostTool,
        onSuccess: () => {
            setSuccessMessage('Tool optimization completed! Opening results...')
            setShowSuccessNotification(true)
            // Auto-advance to preview step after tool optimization
            setTimeout(() => setCurrentStep('preview'), 500)
        }
    })

    // Refs for smooth scrolling
    const analysisRef = useRef<HTMLDivElement>(null)
    const previewRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to new content
    useEffect(() => {
        if (auditMutation.data && analysisRef.current) {
            setTimeout(() => {
                analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        }
    }, [auditMutation.data])

    useEffect(() => {
        if (currentStep === 'preview' && previewRef.current) {
            setTimeout(() => {
                previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        }
    }, [currentStep])

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault()

        if (contentType === 'url' && url) {
            // For URL content, analyze first then optimize
            const analysisResult = await auditMutation.mutateAsync({ url, platform })
            if (analysisResult) {
                // Automatically optimize after analysis
                await optimizeMutation.mutateAsync({ content: url, platform })
            }
        } else if (contentType === 'content' && content) {
            // For text content, analyze first then optimize
            const analysisResult = await auditMutation.mutateAsync({ content, platform })
            if (analysisResult) {
                // Automatically optimize after analysis
                await optimizeMutation.mutateAsync({ content, platform })
            }
        }
    }

    const handleToolOptimize = (e: React.FormEvent) => {
        e.preventDefault()
        if (contentType === 'tool') {
            const toolData = {
                name: tool.name,
                description: tool.description || tool.tagline || '',
                url: tool.homepage,
                category: tool.categories.split('\n').map(s => s.trim()).filter(Boolean).join(', '),
                useCases: tool.examples.split('\n').map(s => s.trim()).filter(Boolean).join(', '),
                pricing: tool.pricing || 'Free'
            }
            boostToolMutation.mutate(toolData)
        }
    }

    const steps: { key: WorkflowStep; label: string; description: string }[] = [
        { key: 'analyze', label: 'Analyze & Optimize', description: 'Check and improve your content for AI optimization' },
        { key: 'preview', label: 'Preview', description: 'See your optimized content and copy it' },
        { key: 'deploy', label: 'Deploy', description: 'Get ready-to-use code and markup' },
    ]

    return (
        <div className="mx-auto max-w-6xl p-6 space-y-8 pb-32">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">AI SEO Studio</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Complete AI SEO workflow: analyze, optimize, preview, and deploy your content for maximum AI discoverability.
                </p>
            </div>

            {/* Progress Indicator */}
            <ProgressIndicator
                currentStep={currentStep}
                steps={steps}
            />

            {/* Main Content Area - Everything flows inline */}
            <div className="space-y-8">
                {/* Step 1: Content Input & Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle>What are you optimizing?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <PlatformSelector
                            platform={platform}
                            onPlatformChange={setPlatform}
                        />

                        <ContentInput
                            contentType={contentType}
                            onContentTypeChange={setContentType}
                            content={content}
                            onContentChange={setContent}
                            url={url}
                            onUrlChange={setUrl}
                            onAnalyze={contentType === 'tool' ? handleToolOptimize : handleAnalyze}
                            isAnalyzing={auditMutation.isPending || optimizeMutation.isPending || boostToolMutation.isPending}
                            tool={tool}
                            onToolChange={setTool}
                        />
                    </CardContent>
                </Card>

                {/* Step 2: Analysis Results - Show inline immediately */}
                {auditMutation.data && (
                    <div ref={analysisRef}>
                        <AnalysisResults
                            analysisData={auditMutation.data}
                            isVisible={true}
                        />
                    </div>
                )}

                {/* Step 3: Preview - Show inline when ready */}
                {currentStep === 'preview' && (optimizeMutation.data || boostToolMutation.data) && (
                    <div ref={previewRef}>
                    </div>
                )}
            </div>

            {/* Floating Action Button - Always visible next action */}
            <FloatingActionButton
                currentStep={currentStep}
                onAction={() => {
                    if (currentStep === 'analyze') {
                        if (contentType === 'url' && url) {
                            handleAnalyze({ preventDefault: () => { } } as any)
                        } else if (contentType === 'content' && content) {
                            handleAnalyze({ preventDefault: () => { } } as any)
                        } else if (contentType === 'tool') {
                            handleToolOptimize({ preventDefault: () => { } } as any)
                        }
                    } else if (currentStep === 'preview') {
                        setBottomDrawerOpen(true)
                    }
                }}
                isDisabled={
                    (currentStep === 'analyze' && !content && !url && contentType !== 'tool') ||
                    (currentStep === 'analyze' && contentType === 'tool' && !tool.name)
                }
                isLoading={
                    auditMutation.isPending ||
                    optimizeMutation.isPending ||
                    boostToolMutation.isPending
                }
                contentType={contentType}
            />

            {/* Success Notifications */}
            <SuccessNotification
                message={successMessage}
                isVisible={showSuccessNotification}
                onClose={() => setShowSuccessNotification(false)}
                autoHide={true}
                autoHideDelay={3000}
            />

            {/* Bottom Drawer for Results */}
            {(optimizeMutation.data || boostToolMutation.data) && (
                <BottomDrawer
                    isOpen={bottomDrawerOpen}
                    onToggle={() => setBottomDrawerOpen(!bottomDrawerOpen)}
                    platform={platform}
                    contentType={contentType}
                    optimizationResult={contentType === 'tool' ? boostToolMutation.data : optimizeMutation.data}
                    tool={tool}
                    analysisData={auditMutation.data}
                    originalContent={contentType === 'tool' ? tool.description || tool.tagline : contentType === 'content' ? content : url}
                />
            )}
        </div>
    )
}
