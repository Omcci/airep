import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Hero from '@/components/Hero'
import Reveal from '@/components/Reveal'

function Home() {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge>AI SEO</Badge>
          <span className="text-sm text-gray-500">SEO for conversational AI (LLMs)</span>
        </div>
        <Hero />
      </header>

      <Reveal>
        <Card>
          <CardHeader>
            <CardTitle>Why it’s different</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              Unlike classic search, LLMs synthesize. To be quoted, publish clear, structured content with citations and authority.
            </p>
            <ul className="list-disc pl-6">
              <li>LLM‑friendly structure (headings, short paragraphs, lists, glossary)</li>
              <li>Be highly specific (numbers, concrete examples, studies)</li>
              <li>Make pages accessible and indexable (sitemap, meta, Schema.org)</li>
              <li>Build topical authority via consistent publishing</li>
            </ul>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  )
}

export default Home


