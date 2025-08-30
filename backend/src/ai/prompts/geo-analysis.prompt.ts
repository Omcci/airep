export const buildGEOPrompt = (content: string, contentType: string) => `Analyze this ${contentType} for AI citation and ranking potential. Consider how it would be referenced when users ask related questions.

CONTENT TO ANALYZE:
${content}

ANALYSIS FRAMEWORK:

1. CITATION POTENTIAL
Evaluate how likely this content would be cited when users ask questions like:
- "I need a solution for..."
- "What's the best tool for..."
- "How can I quickly..."

Consider:
- Direct relevance to common queries
- Unique value proposition
- Problem-solution fit
- Implementation ease

2. KNOWLEDGE GRAPH POSITION
Analyze how this content connects to:
- Related tools/solutions
- Use cases and applications
- Technical domains
- User needs and problems

3. AUTHORITY SIGNALS
Evaluate authority markers:
- Technical capability proof
- Problem-solving effectiveness
- Domain expertise indicators
- Implementation examples

4. COMPETITIVE POSITIONING
Analyze how it compares to alternatives:
- Unique differentiators
- Solution completeness
- Use case coverage
- Technical advantages

Please provide a detailed JSON response:
{
  "citationAnalysis": {
    "likelihood": 85,
    "relevantQueries": [
      {
        "query": "example query",
        "relevance": 90,
        "citationContext": "When discussing..."
      }
    ],
    "quotableElements": ["..."],
    "useCases": ["..."]
  },
  "knowledgeGraph": {
    "nodes": [
      {
        "id": "unique_id",
        "type": "tool|topic|usecase|technology",
        "label": "Node Label",
        "category": "primary|related|alternative",
        "metrics": {
          "relevance": 85,
          "authority": 80,
          "uniqueness": 75
        }
      }
    ],
    "edges": [
      {
        "source": "node_id",
        "target": "node_id",
        "type": "solves|relates_to|alternative_to|implements",
        "strength": 0.8
      }
    ]
  },
  "authorityEvaluation": {
    "credibilityScore": 88,
    "expertiseSignals": ["..."],
    "trustFactors": ["..."],
    "implementationProof": ["..."]
  },
  "competitiveAnalysis": {
    "uniqueStrengths": ["..."],
    "marketPosition": "leader|alternative|niche",
    "differentiators": ["..."],
    "improvements": ["..."]
  },
  "rankingFactors": {
    "relevanceScore": 85,
    "technicalDepth": 80,
    "solutionCompleteness": 90,
    "implementationClarity": 85
  }
}`