import { Button } from '@/components/ui/button'

interface PlatformSelectorProps {
    platform: 'linkedin' | 'twitter' | 'blog' | 'email'
    onPlatformChange: (platform: 'linkedin' | 'twitter' | 'blog' | 'email') => void
}

export default function PlatformSelector({ platform, onPlatformChange }: PlatformSelectorProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-3">Target Platform</label>
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={platform === 'linkedin' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPlatformChange('linkedin')}
                    className="flex items-center gap-2"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                </Button>
                <Button
                    variant={platform === 'twitter' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPlatformChange('twitter')}
                    className="flex items-center gap-2"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X/Twitter
                </Button>
                <Button
                    variant={platform === 'blog' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPlatformChange('blog')}
                    className="flex items-center gap-2"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5zM19 19.09H5V4.91h14v14.18zM6 15h12v2H6zm0-4h12v2H6zm0-4h12v2H6z" />
                    </svg>
                    Blog/Website
                </Button>
                <Button
                    variant={platform === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPlatformChange('email')}
                    className="flex items-center gap-2"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    Email Newsletter
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
                {platform === 'linkedin' && 'Optimized for LinkedIn posts (no HTML, AI-friendly structure)'}
                {platform === 'twitter' && 'Optimized for X/Twitter threads (character limits, engagement hooks)'}
                {platform === 'blog' && 'Full HTML optimization with JSON-LD markup and structured data'}
                {platform === 'email' && 'Email-friendly optimization with limited HTML support'}
            </p>
        </div>
    )
}
