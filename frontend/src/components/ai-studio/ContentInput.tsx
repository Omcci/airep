import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles } from 'lucide-react'

interface ContentInputProps {
    contentType: 'url' | 'content' | 'tool'
    onContentTypeChange: (type: 'url' | 'content' | 'tool') => void
    content: string
    onContentChange: (content: string) => void
    url: string
    onUrlChange: (url: string) => void
    onAnalyze: (e: React.FormEvent) => void
    isAnalyzing: boolean
    tool: any
    onToolChange: (tool: any) => void
    platform: 'linkedin' | 'twitter' | 'blog' | 'email'
}

export default function ContentInput({
    contentType,
    onContentTypeChange,
    content,
    onContentChange,
    url,
    onUrlChange,
    onAnalyze,
    isAnalyzing,
    tool,
    onToolChange,
    platform
}: ContentInputProps) {
    // Simple visibility map per platform
    const tabsByPlatform: Record<'linkedin' | 'twitter' | 'blog' | 'email', Array<'url' | 'content' | 'tool'>> = {
        linkedin: ['content'],
        twitter: ['content'],
        blog: ['content', 'url', 'tool'],
        email: ['content']
    }
    const availableTabs = tabsByPlatform[platform] ?? ['content', 'url']

    // Ensure selected contentType remains valid when platform changes
    useEffect(() => {
        if (!availableTabs.includes(contentType)) {
            onContentTypeChange(availableTabs[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [platform])

    const handleTabChange = (value: string) => {
        const newType = value as 'url' | 'content' | 'tool'
        onContentTypeChange(availableTabs.includes(newType) ? newType : availableTabs[0])
    }

    const handleToolChange = (field: string, value: string) => {
        onToolChange({ ...tool, [field]: value })
    }

    return (
        <Tabs value={contentType} onValueChange={handleTabChange} className="w-full">
            <TabsList className={`grid w-full ${availableTabs.length === 3 ? 'grid-cols-3' : availableTabs.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {availableTabs.includes('content') && (
                    <TabsTrigger value="content">Text Content</TabsTrigger>
                )}
                {availableTabs.includes('url') && (
                    <TabsTrigger value="url">URL</TabsTrigger>
                )}
                {availableTabs.includes('tool') && (
                    <TabsTrigger value="tool">Tool</TabsTrigger>
                )}
            </TabsList>

            <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">
                        {platform === 'twitter' ? 'Paste your tweet or thread here' : 'Paste your content here'}
                    </label>
                    <Textarea
                        id="content"
                        placeholder={platform === 'twitter'
                            ? "Paste your tweet or thread content here...\nFor threads, you can:\n• Paste all tweets separated by new lines\n• Use '---' to separate tweets\n• Or paste as one continuous text"
                            : "Enter your content to analyze and optimize..."
                        }
                        value={content}
                        onChange={(e) => onContentChange(e.target.value)}
                        className="min-h-[120px] text-sm"
                    />
                </div>
                <Button
                    onClick={onAnalyze}
                    disabled={!content.trim() || isAnalyzing}
                    className="w-full"
                >
                    {isAnalyzing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Analyze & Optimize Content
                        </>
                    )}
                </Button>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="url" className="text-sm font-medium">
                        Enter URL to analyze
                    </label>
                    <Input
                        id="url"
                        type="url"
                        placeholder="https://example.com/article"
                        value={url}
                        onChange={(e) => onUrlChange(e.target.value)}
                    />
                </div>
                <Button
                    onClick={onAnalyze}
                    disabled={!url.trim() || isAnalyzing}
                    className="w-full"
                >
                    {isAnalyzing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Analyze & Optimize URL
                        </>
                    )}
                </Button>
            </TabsContent>

            <TabsContent value="tool" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="tool-name" className="text-sm font-medium">
                            Tool Name
                        </label>
                        <Input
                            id="tool-name"
                            placeholder="e.g., URL Shortener"
                            value={tool.name}
                            onChange={(e) => handleToolChange('name', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="tool-homepage" className="text-sm font-medium">
                            Homepage URL
                        </label>
                        <Input
                            id="tool-homepage"
                            type="url"
                            placeholder="https://example.com"
                            value={tool.homepage}
                            onChange={(e) => handleToolChange('homepage', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="tool-tagline" className="text-sm font-medium">
                        Tagline
                    </label>
                    <Input
                        id="tool-tagline"
                        placeholder="Brief description of what the tool does"
                        value={tool.tagline}
                        onChange={(e) => handleToolChange('tagline', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="tool-description" className="text-sm font-medium">
                        Detailed Description
                    </label>
                    <Textarea
                        id="tool-description"
                        placeholder="Explain what your tool does, its features, and benefits..."
                        value={tool.description}
                        onChange={(e) => handleToolChange('description', e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="tool-categories" className="text-sm font-medium">
                            Categories (one per line)
                        </label>
                        <Textarea
                            id="tool-categories"
                            placeholder="Productivity&#10;Developer Tools&#10;Web Utilities"
                            value={tool.categories}
                            onChange={(e) => handleToolChange('categories', e.target.value)}
                            className="min-h-[80px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="tool-pricing" className="text-sm font-medium">
                            Pricing
                        </label>
                        <Input
                            id="tool-pricing"
                            placeholder="Free, $9/month, etc."
                            value={tool.pricing}
                            onChange={(e) => handleToolChange('pricing', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="tool-examples" className="text-sm font-medium">
                        Use Cases (one per line)
                    </label>
                    <Textarea
                        id="tool-examples"
                        placeholder="Shorten long URLs for social media&#10;Create clean links for presentations&#10;Track click analytics"
                        value={tool.examples}
                        onChange={(e) => handleToolChange('examples', e.target.value)}
                        className="min-h-[80px]"
                    />
                </div>

                <Button
                    onClick={onAnalyze}
                    disabled={!tool.name.trim() || isAnalyzing}
                    className="w-full"
                >
                    {isAnalyzing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Optimizing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Optimize Tool
                        </>
                    )}
                </Button>
            </TabsContent>
        </Tabs>
    )
}
