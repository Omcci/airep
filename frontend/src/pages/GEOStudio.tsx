import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useGeoAnalysis } from '@/hooks/useGeoAnalysis'
import AIInsights from '@/components/geo-visualization/AIInsights'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const CONTENT_TYPES = ['tool', 'article', 'documentation', 'api'] as const
type ContentType = typeof CONTENT_TYPES[number]
type InputType = 'url' | 'content'

const PLACEHOLDER_TEXT = {
    tool: `Enter your tool's description, including:
- What problem it solves
- Key features and capabilities
- Target audience
- Use cases
- Technical details (if relevant)`,
    article: `Enter the article content here...`,
    documentation: `Enter your documentation content, including:
- Overview
- Installation/Setup
- Usage examples
- API reference (if applicable)
- Best practices`,
    api: `Enter your API description, including:
- Purpose and functionality
- Endpoints
- Request/Response formats
- Authentication methods
- Usage examples`
}

export default function GEOStudio() {
    const [content, setContent] = useState('')
    const [url, setUrl] = useState('')
    const [contentType, setContentType] = useState<ContentType>('article')
    const [inputType, setInputType] = useState<InputType>('content')

    const { data: analysis, isLoading, error } = useGeoAnalysis(
        inputType === 'url' ? url : content,
        contentType,
        inputType === 'url'
    )

    const handleContentTypeChange = (type: ContentType) => {
        setContentType(type)
        if (type !== 'article') {
            setInputType('content')
        }
    }

    return (
        <div className="mx-auto max-w-6xl p-6 space-y-8 pb-32">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">AI Visibility Studio</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Analyze and improve how your content is perceived by AI models.
                </p>
            </div>

            {/* Content Input */}
            <Card>
                <CardHeader>
                    <CardTitle>What would you like to analyze?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Content Type Selection */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Content Type</label>
                        <div className="flex gap-2">
                            {CONTENT_TYPES.map(type => (
                                <Button
                                    key={type}
                                    variant={contentType === type ? "default" : "outline"}
                                    onClick={() => handleContentTypeChange(type)}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Input Type Selection */}
                    {contentType === 'article' && (
                        <div className="space-y-4">
                            <label className="text-sm font-medium">Input Method</label>
                            <div className="flex gap-2">
                                <Button
                                    variant={inputType === 'url' ? "default" : "outline"}
                                    onClick={() => setInputType('url')}
                                >
                                    URL
                                </Button>
                                <Button
                                    variant={inputType === 'content' ? "default" : "outline"}
                                    onClick={() => setInputType('content')}
                                >
                                    Direct Content
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* URL or Content Input */}
                    {inputType === 'url' ? (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Article URL</label>
                            <div className="relative">
                                <Input
                                    type="url"
                                    placeholder="Enter the article URL..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={isLoading}
                                />
                                {isLoading && inputType === 'url' && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Enter the full URL of the article you want to analyze.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content</label>
                            <Textarea
                                placeholder={PLACEHOLDER_TEXT[contentType]}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[200px]"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Analysis Results */}
            {(isLoading || analysis) && (
                <Card>
                    <CardContent className="pt-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-[400px] w-full" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-[200px]" />
                                    <Skeleton className="h-[200px]" />
                                </div>
                            </div>
                        ) : analysis ? (
                            <AIInsights analysis={analysis} />
                        ) : null}
                    </CardContent>
                </Card>
            )}

            {/* Error Display */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>
                        {error instanceof Error ? error.message : 'Failed to analyze content'}
                        {inputType === 'url' && error instanceof Error && error.message.includes('fetch') && (
                            <div className="mt-2">
                                <p>This could be because:</p>
                                <ul className="list-disc ml-4 mt-2">
                                    <li>The URL is invalid or the page doesn't exist</li>
                                    <li>The website blocks content fetching</li>
                                    <li>The article requires authentication</li>
                                </ul>
                                <p className="mt-2">Try copying the article content and using the "Direct Content" input method instead.</p>
                            </div>
                        )}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}