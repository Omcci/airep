import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

function Hero() {
    return (
        <div className="text-center space-y-8 py-12">
            <div className="space-y-4">
                <Badge className="px-4 py-2 text-sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Next-Gen SEO for AI
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    Optimize Your Content for
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {' '}AI Search
                    </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Transform your content to be discoverable, understandable, and valuable to conversational AI systems.
                    Get found by the AI-powered search engines of tomorrow.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/studio">
                    <Button size="lg" className="group">
                        <Target className="mr-2 h-5 w-5" />
                        Start AI SEO Studio
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
                <Link to="/report">
                    <Button variant="outline" size="lg">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Learn AI SEO
                    </Button>
                </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Free AI Content Analysis
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Actionable Optimization Tips
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    AI-Friendly Content Templates
                </div>
            </div>
        </div>
    )
}

export default Hero


