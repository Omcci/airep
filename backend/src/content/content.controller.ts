import { Controller, Get } from '@nestjs/common'

@Controller('content')
export class ContentController {
  @Get('report')
  getReport() {
    return {
      title: 'Next‑gen AI SEO for conversational assistants',
      sections: [
        {
          id: 'llm-how-it-works',
          title: 'How LLMs find and present information',
          paragraphs: [
            'Unlike classic search, LLMs synthesize. You get a single, reasoned answer, not ten blue links.',
            'They rely on three pillars: pretraining data (if your content is public and indexed), real‑time sources (via integrated web search/browsing), and reasoning/summarization skills.',
            'Implication: to be surfaced and cited, your content must be structured, unambiguous, properly cited, and trusted.',
          ],
          bullets: [
            'Pretraining coverage: public, crawlable pages are more likely to be represented',
            'Real‑time retrieval: models prefer authoritative, recent, well‑structured sources',
            'Reasoning: clear chunking, headings, and summaries help the model extract quotable answers',
          ],
        },
        {
          id: 'optimize-for-llms',
          title: 'Make your content LLM‑friendly',
          paragraphs: [
            'Use explicit structure, specific claims, and machine‑readable context so models can quote and attribute you.',
          ],
          bullets: [
            'Structure: clear H1/H2/H3, short paragraphs, bullet lists for steps/benefits, on‑page glossary if needed',
            'Specificity: include numbers, examples, studies; the more precise, the more quotable',
            'Accessibility: no paywalls or robot blocks; ship sitemap; optimize meta; add Schema.org structured data',
            'Authority: expert but approachable tone; cite reputable sources; publish consistently on a focused topic',
          ],
        },
        {
          id: 'llm-content-strategies',
          title: 'LLM‑specific content strategies',
          bullets: [
            'Q&A/FAQ pages: direct question→answer format maps well to LLM retrieval',
            'Articles with upfront summaries: increases chance the model reuses your phrasing',
            'Multimodal content (text + image + video): increasingly used by models',
            'Conversational keywords: “how to X”, “best way to Y”, “step‑by‑step”, etc.',
          ],
        },
        {
          id: 'distribution',
          title: 'Distribution and external signals',
          bullets: [
            'Publish on high‑authority domains (guest posts, partnerships)',
            'Earn media coverage and press mentions; LLMs often trust these sources',
            'Encourage direct citations on blogs/forums with proper links',
          ],
        },
        {
          id: 'measure-and-iterate',
          title: 'Measure and iterate',
          bullets: [
            'Test multiple AIs: ask “What is the best resource for … ?” and check if you appear',
            'Track traffic from AI engines (e.g., Perplexity stats when available)',
            'Tune pages to match the exact questions users ask',
          ],
        },
      ],
    }
  }

  @Get('checklist')
  getChecklist() {
    return {
      title: 'LLM‑SEO checklist',
      groups: [
        {
          id: 'structure',
          title: 'Structure',
          items: [
            'Use descriptive H1/H2/H3',
            'Short paragraphs with one clear idea each',
            'Bullet lists for steps/benefits',
            'Add an on‑page glossary for advanced terms if needed',
          ],
        },
        {
          id: 'specificity',
          title: 'Specificity',
          items: [
            'Add numbers, examples, benchmarks, and study links',
            'Write quotable, concise sentences with unambiguous claims',
          ],
        },
        {
          id: 'accessibility',
          title: 'Accessibility & crawlability',
          items: [
            'Avoid paywalls/robot blocks; ensure fast load',
            'Provide a sitemap and optimized meta tags',
            'Implement Schema.org (FAQPage, Article, HowTo where relevant)',
          ],
        },
        {
          id: 'authority',
          title: 'Authority',
          items: [
            'Expert, pedagogical tone; transparent authorship',
            'Cite reputable external sources; link out where relevant',
            'Publish consistently on a focused topic cluster',
          ],
        },
      ],
    }
  }

  @Get('faq')
  getFAQ() {
    return [
      {
        question: 'How do LLMs pick sources?',
        answer:
          'They combine pretraining coverage, real‑time web retrieval, and perceived reliability (structure, citations, authority).',
      },
      {
        question: 'What page formats work best?',
        answer:
          'FAQ/Q&A pages, articles with upfront summaries, multimodal content, and conversational queries.',
      },
      {
        question: 'How can I get quoted verbatim?',
        answer: 'Be specific, include numbers, and craft short, precise, unambiguous sentences.',
      },
    ]
  }

  @Get('glossary')
  getGlossary() {
    return [
      { term: 'AI SEO (LLM‑SEO)', definition: 'Optimizing content to be discoverable, quotable, and trusted by large language models and AI search.' },
      { term: 'RAG (Retrieval‑Augmented Generation)', definition: 'A pattern where the model retrieves external documents at query time and grounds its answer on them.' },
      { term: 'Structured data (Schema.org)', definition: 'Machine‑readable markup (e.g., FAQPage, Article, HowTo) that clarifies entities and page intent.' },
      { term: 'E‑E‑A‑T', definition: 'Experience, Expertise, Authoritativeness, Trustworthiness — signals that drive perceived credibility.' },
      { term: 'Conversational keywords', definition: 'Natural language queries like “how to…”, “best way to…”, or “step‑by‑step…”.' },
      { term: 'Source attribution', definition: 'Explicit linking/quoting of original sources used to ground the answer.' },
      { term: 'Answer chunking', definition: 'Structuring content into concise, self‑contained blocks the model can lift verbatim.' },
      { term: 'Passage ranking', definition: 'Ranking at a paragraph/section level; structuring helps retrieval systems locate the best passage.' },
      { term: 'Canonical URL', definition: 'A tag that indicates the preferred version of a page to avoid duplication and dilution.' },
      { term: 'Sitemap', definition: 'An XML map of site URLs to improve discovery and crawling.' },
      { term: 'FAQPage markup', definition: 'Schema.org type for Q&A content that improves LLM extraction and answer formatting.' },
      { term: 'Citations grounding', definition: 'Providing references so the model can ground claims and increase trust.' },
    ]
  }
}


