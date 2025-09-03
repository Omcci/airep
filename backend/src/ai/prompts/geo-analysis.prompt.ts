export const buildGEOPrompt = (content: string, contentType: string) => {
    const isNewsArticle = contentType === 'article'

    return `Analyze this ${contentType} for AI citation and ranking potential. ${isNewsArticle ? 'This is a news article, so focus on extracting key facts, quotes, and newsworthy elements that would be cited by others.' : ''}

CONTENT TO ANALYZE:
${content}

ANALYSIS FRAMEWORK:

1. CITATION POTENTIAL
${isNewsArticle ? `
Evaluate how this news article would be cited in contexts like:
- Reporting on similar events or related issues
- Analysis of social movements and protests
- Policy discussions and governance
- Historical documentation
- Social impact studies

Consider:
- Key facts and statistics
- Official statements and quotes
- Event chronology and details
- Social and political implications
- International relevance`
            : `
Evaluate how likely this content would be cited when users ask questions like:
- "I need a solution for..."
- "What's the best tool for..."
- "How can I quickly..."

Consider:
- Direct relevance to common queries
- Unique value proposition
- Problem-solution fit
- Implementation ease`}

2. KNOWLEDGE GRAPH POSITION
${isNewsArticle ? `
Analyze how this article connects to:
- Related events and developments
- Key individuals and organizations
- Geographic locations
- Social and political themes
- Policy and governance issues`
            : `
Analyze how this content connects to:
- Related tools/solutions
- Use cases and applications
- Technical domains
- User needs and problems`}

3. AUTHORITY SIGNALS
${isNewsArticle ? `
Evaluate news authority markers:
- Source credibility (e.g., BBC)
- Official statements and quotes
- First-hand accounts
- Expert commentary
- Factual accuracy and detail`
            : `
Evaluate authority markers:
- Technical capability proof
- Problem-solving effectiveness
- Domain expertise indicators
- Implementation examples`}

4. QUOTABLE ELEMENTS
${isNewsArticle ? `
Extract ACTUAL quotable elements from the content:
- Specific numbers, statistics, and data points
- Direct quotes from officials, witnesses, or experts
- Concrete event details and descriptions
- Policy statements and announcements
- Key facts that would be cited by other sources
IMPORTANT: Extract the actual text/data from the article, not suggestions for what could be added.`
            : `
Extract ACTUAL quotable elements from the content:
- Specific technical details or capabilities
- Concrete implementation approaches
- Unique features or benefits mentioned
- Problem-solving insights described
IMPORTANT: Extract actual content from the text, not suggestions for improvement.`}

Please provide a detailed JSON response:
{
  "citationAnalysis": {
    "likelihood": 85,
    "quotableElements": [
      "EXTRACT ACTUAL QUOTES, FACTS, AND DATA FROM THE CONTENT",
      "Include specific numbers, statistics, or statements found in the text",
      "Do NOT include suggestions or recommendations - only existing content"
    ],
    "citationContexts": [
      "Event coverage and breaking news",
      "Historical documentation",
      "Policy analysis and discussion",
      "Social impact studies"
    ]
  },
  "knowledgeGraph": {
    "nodes": [
      {
        "id": "unique_id",
        "type": "event|person|location|topic",
        "label": "Node Label",
        "category": "primary|related|context",
        "metrics": {
          "relevance": 85,
          "authority": 80,
          "freshness": 90
        }
      }
    ],
    "edges": [
      {
        "source": "node_id",
        "target": "node_id",
        "type": "involves|relates_to|impacts|leads_to",
        "strength": 0.8
      }
    ]
  },
  "authorityEvaluation": {
    "credibilityScore": 88,
    "expertiseSignals": ["Source authority indicators"],
    "trustFactors": ["Credibility factors"],
    "implementationProof": ["Verification elements"]
  },
  "competitiveAnalysis": {
    "uniqueStrengths": ["Distinctive aspects"],
    "marketPosition": "leader|alternative|niche",
    "differentiators": ["Key distinguishing factors"],
    "improvements": ["Potential enhancements"]
  },
  "rankingFactors": {
    "relevanceScore": 85,
    "technicalDepth": 80,
    "solutionCompleteness": 90,
    "implementationClarity": 85
  }
}`
}