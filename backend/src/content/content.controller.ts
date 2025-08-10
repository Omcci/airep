import { Controller, Get } from '@nestjs/common'

@Controller('content')
export class ContentController {
  @Get('report')
  getReport() {
    return {
      title: 'SEO nouvelle génération pour les IA conversationnelles',
      sections: [
        {
          id: 'llm-fonctionnement',
          title: 'Comprendre comment les LLM trouvent et présentent l’info',
          paragraphs: [
            'Contrairement à Google, un LLM ne liste pas 10 liens bleus : il synthétise.',
            'Il s’appuie sur ses données d’entraînement, des sources consultées en temps réel et sa capacité de raisonnement et de résumé.',
            'Conclusion : pour ressortir, ton contenu doit être structuré, clair, cité, et reconnu comme source fiable.',
          ],
        },
        {
          id: 'optimiser-contenu',
          title: 'Optimiser ton contenu pour les LLMs',
          paragraphs: ['Recette pratique pour rendre ton contenu “LLM‑friendly”.'],
          bullets: [
            'Titres clairs (H1, H2, H3), paragraphes courts, listes à puces, glossaire',
            'Être ultra‑spécifique: chiffres, exemples concrets, études',
            'Pages accessibles et indexables: pas de paywall, sitemap, meta, schema.org',
            'Optimiser pour être cité comme autorité: ton d’expert, sources reconnues, publication régulière',
          ],
        },
        {
          id: 'strategies',
          title: 'Stratégies spécifiques GEO',
          bullets: [
            'Pages Q&A (FAQ) — format préféré des LLMs',
            'Articles avec résumés en début',
            'Contenu multimodal: texte + image + vidéo',
            'Mots‑clés conversationnels: “comment faire X”, “meilleure méthode pour Y”',
          ],
        },
        {
          id: 'diffusion',
          title: 'Diffusion et signaux externes',
          bullets: [
            'Publier sur des sites à forte autorité',
            'Mentions dans communiqués / médias',
            'Encourager des citations directes sur blogs/forums',
          ],
        },
        {
          id: 'mesure',
          title: 'Mesurer et ajuster',
          bullets: [
            'Tester avec plusieurs IA (ChatGPT, Perplexity, Claude)',
            'Surveiller trafic issus de moteurs IA',
            'Ajuster les pages selon les questions des utilisateurs',
          ],
        },
      ],
    }
  }

  @Get('checklist')
  getChecklist() {
    return {
      title: 'Checklist LLM‑SEO',
      groups: [
        {
          id: 'structure',
          title: 'Structure',
          items: [
            'H1/H2/H3 clairs et descriptifs',
            'Paragraphes courts et idées claires',
            'Listes à puces pour étapes/avantages',
            'Glossaire des termes clés',
          ],
        },
        {
          id: 'specificite',
          title: 'Spécificité',
          items: [
            'Chiffres, exemples, études',
            'Formulations précises pour citations',
          ],
        },
        {
          id: 'accessibilite',
          title: 'Accessibilité',
          items: [
            'Pas de paywall / blocage robots',
            'Sitemap et meta optimisées',
            'Schema.org pour contexte',
          ],
        },
        {
          id: 'autorite',
          title: 'Autorité',
          items: [
            'Ton d’expert, pédagogique',
            'Sources reconnues citées',
            'Publication régulière sur le même sujet',
          ],
        },
      ],
    }
  }

  @Get('faq')
  getFAQ() {
    return [
      {
        question: 'Comment un LLM choisit‑il les sources ?',
        answer:
          'En combinant données d’entraînement, navigation temps réel et fiabilité perçue (structure, citations, autorité).',
      },
      {
        question: 'Quel format de page fonctionne le mieux ?',
        answer: 'FAQ/Q&A, articles avec résumés, contenu multimodal, questions conversationnelles.',
      },
      {
        question: 'Comment être cité textuellement ?',
        answer: 'Être spécifique, fournir chiffres et formulations claires et concises.',
      },
    ]
  }

  @Get('glossary')
  getGlossary() {
    return [
      { term: 'LLM', definition: 'Large Language Model, modèle génératif de texte.' },
      { term: 'Schema.org', definition: 'Vocabulaire de données structurées pour décrire le contenu.' },
      { term: 'FAQ', definition: 'Foire Aux Questions, format de questions/réponses.' },
    ]
  }
}


