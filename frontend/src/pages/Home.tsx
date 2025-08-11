import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Reveal from '@/components/Reveal'
import Hero from '@/components/Hero'
import { ArrowRight, Target, Sparkles, TrendingUp, Zap, Users, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="mx-auto max-w-6xl p-6 space-y-12">
      <Hero />

      <Reveal>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Why AI SEO Matters</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Traditional SEO focuses on Google rankings. AI SEO optimizes your content for the new era of conversational AI,
            ensuring your content is discoverable, understandable, and valuable to AI systems that power modern search.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Reveal>
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">AI Content Audit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Analyze your existing content for AI optimization. Get specific scores and actionable recommendations.
              </p>
              <Link to="/audit" className="inline-flex items-center text-sm text-primary hover:underline group-hover:gap-1 transition-all">
                Run Audit <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal>
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Content Optimizer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Transform your content to be AI-friendly. Get optimized versions with structured data and AI-optimized elements.
              </p>
              <Link to="/audit" className="inline-flex items-center text-sm text-primary hover:underline group-hover:gap-1 transition-all">
                Optimize Now <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal>
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">AI Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Ensure your content appears in AI responses. Build authority and get cited by conversational AI systems.
              </p>
              <Link to="/report" className="inline-flex items-center text-sm text-primary hover:underline group-hover:gap-1 transition-all">
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      <Reveal>
        <div className="bg-muted/50 rounded-2xl p-8 text-center space-y-6">
          <h3 className="text-2xl font-bold">Ready to Optimize for AI?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start with a free AI SEO audit of your content. Get actionable insights and see how AI systems will discover and present your information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/audit">
              <Badge className="px-6 py-3 text-base hover:scale-105 transition-transform cursor-pointer">
                <Zap className="mr-2 h-4 w-4" />
                Start Free Audit
              </Badge>
            </Link>
            <Link to="/checklist">
              <Badge variant="secondary" className="px-6 py-3 text-base hover:scale-105 transition-transform cursor-pointer">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Checklist
              </Badge>
            </Link>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Who This Is For
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <div className="font-medium">Content Creators</div>
                  <div className="text-sm text-muted-foreground">Bloggers, writers, and marketers who want their content discovered by AI</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <div className="font-medium">Business Owners</div>
                  <div className="text-sm text-muted-foreground">Companies looking to improve their AI search visibility and authority</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <div className="font-medium">SEO Professionals</div>
                  <div className="text-sm text-muted-foreground">Experts adapting their strategies for the AI-powered search era</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Key Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <div className="font-medium">AI Discovery</div>
                  <div className="text-sm text-muted-foreground">Get found by conversational AI systems and chatbots</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <div className="font-medium">Better Attribution</div>
                  <div className="text-sm text-muted-foreground">AI systems will properly cite and link to your content</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <div className="font-medium">Future-Proof</div>
                  <div className="text-sm text-muted-foreground">Stay ahead as AI becomes the primary way people find information</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  )
}

export default HomePage


