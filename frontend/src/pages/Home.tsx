import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function Home() {
  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge>AI SEO</Badge>
          <span className="text-sm text-gray-500">Référencement pour IA conversationnelles</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">SEO nouvelle génération</h1>
        <p className="text-gray-600">
          Structure, spécificité, accessibilité et autorité pour être cité par les LLMs.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Pourquoi c’est différent ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700">
          <p>
            Contrairement aux moteurs classiques, un LLM synthétise les informations. Pour émerger dans ses réponses,
            publie un contenu structuré, clair, cité et reconnu.
          </p>
          <ul className="list-disc pl-6">
            <li>Contenu "LLM‑friendly" (titres, paragraphes courts, listes, glossaire)</li>
            <li>Être ultra‑spécifique (chiffres, exemples, études)</li>
            <li>Pages accessibles et indexables (sitemap, meta, schema.org)</li>
            <li>Construire une autorité thématique via des publications régulières</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default Home


