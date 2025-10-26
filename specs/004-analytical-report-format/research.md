# Research: Analytical Report Format Implementation

**Feature**: 004-analytical-report-format
**Date**: 2025-10-26
**Purpose**: Document technical research findings and architectural decisions for transforming category-based reports into executive-ready analytical format.

## Research Topics

### 1. Brave Search API Integration

**Decision**: Use Brave Search Web API v2 with framework-specific query patterns

**Rationale**:
- Brave Search API provides high-quality web results with good recency filtering
- Privacy-focused (no user tracking), aligns with project values
- Reasonable rate limits (1000 queries/month free tier, then pay-as-you-go)
- REST API with straightforward authentication (API key)

**API Endpoint**: `https://api.search.brave.com/res/v1/web/search`

**Authentication**:
```typescript
headers: {
  'X-Subscription-Token': process.env.BRAVE_API_KEY,
  'Accept': 'application/json'
}
```

**Request Parameters**:
```typescript
interface BraveSearchParams {
  q: string;              // Query string (e.g., "OpenAI transparency")
  country?: string;       // Country code (default: 'US')
  count?: number;         // Results per page (1-20, default: 10)
  freshness?: string;     // 'pd' (day), 'pw' (week), 'pm' (month), 'py' (year)
  safesearch?: string;    // 'off', 'moderate', 'strict' (default: 'moderate')
  text_decorations?: boolean; // Include HTML in snippets (default: true)
}
```

**Response Structure**:
```typescript
interface BraveSearchResponse {
  web: {
    results: Array<{
      title: string;
      url: string;
      description: string;
      age?: string;           // e.g., "2 months ago"
      page_age?: string;      // ISO date
      family_friendly: boolean;
    }>;
  };
  query: {
    original: string;
    altered?: string;         // If query was modified
  };
}
```

**Implementation Approach**:
```typescript
// Query pattern for each framework category
const queryTemplates = {
  See: "{vendor} transparency OR prompt visibility OR model disclosure OR system prompts",
  Change: "{vendor} customization OR configuration OR API flexibility",
  Use: "{vendor} complexity OR learning curve OR user adoption OR ease of use",
  Adapt: "{vendor} integration OR API OR interoperability OR plugins",
  Leave: "{vendor} data export OR portability OR lock-in OR exit strategy",
  Learn: "{vendor} documentation OR tutorials OR skill transfer OR ecosystem"
};

// Example API call
async function searchBrave(vendor: string, category: string): Promise<BraveSearchResponse> {
  const query = queryTemplates[category].replace('{vendor}', vendor);
  const params = new URLSearchParams({
    q: query,
    count: '10',
    freshness: 'pm',        // Prefer last month
    text_decorations: 'false'
  });

  const response = await fetch(
    `https://api.search.brave.com/res/v1/web/search?${params}`,
    {
      headers: {
        'X-Subscription-Token': process.env.BRAVE_API_KEY,
        'Accept': 'application/json'
      }
    }
  );

  return response.json();
}
```

**Key Features Used**:
- `freshness='pm'`: Prefer results from last month (<6 months target)
- `count=10`: 10 results per query
- `text_decorations=false`: Clean text without HTML markup
- Result fields: title, url, description, age (for recency checking)
- `age` field provides human-readable recency (e.g., "2 months ago")

**Rate Limiting**:
- Implement exponential backoff: 1s, 2s, 4s delays
- Retry once on 429 (rate limit) or 503 (service unavailable)
- Cache results in LocalStorage with 7-day TTL

**Alternatives Considered**:
- Google Custom Search API: Rejected (expensive: $5 per 1000 queries, privacy concerns)
- Bing Search API: Rejected (Microsoft account dependency, less privacy-focused)
- Manual web scraping: Rejected (violates ToS, unreliable, maintenance burden)

---

### 2. Exa API Integration

**Decision**: Use Exa Search API for technical documentation and GitHub content

**Rationale**:
- Specialized in indexing technical content, documentation, and GitHub repos
- Neural search understands semantic meaning (better than keyword matching)
- Excellent for finding API docs, changelogs, architecture decisions
- Pay-as-you-go pricing ($1 per 1000 searches)

**API Endpoint**: Python SDK (exa-py) wraps `https://api.metaphor.systems` (Note: Exa was formerly "Metaphor")

**Authentication**:
```typescript
// Python SDK
from exa_py import Exa
exa = Exa(api_key=os.environ["EXA_API_KEY"])

// Or direct REST API
headers: {
  'Authorization': `Bearer ${process.env.EXA_API_KEY}`,
  'Content-Type': 'application/json'
}
```

**Request Parameters**:
```typescript
interface ExaSearchParams {
  query: string;                    // Natural language query
  num_results?: number;             // Default: 10
  type?: 'neural' | 'keyword';      // Default: 'neural' (semantic search)
  use_autoprompt?: boolean;         // Let Exa optimize query (default: false)
  include_domains?: string[];       // Whitelist domains
  exclude_domains?: string[];       // Blacklist domains
  start_published_date?: string;    // ISO date (e.g., "2024-04-01")
  end_published_date?: string;      // ISO date
  start_crawl_date?: string;        // When Exa crawled it
  end_crawl_date?: string;
  category?: 'company';             // Focus on specific data category
}
```

**Response Structure**:
```typescript
interface ExaSearchResponse {
  results: Array<{
    id: string;                     // Document ID for get_contents()
    url: string;
    title: string;
    published_date?: string;        // ISO date if available
    author?: string;
  }>;
  autoprompt_string?: string;       // Optimized query (if use_autoprompt=true)
}

// Get full content with .get_contents()
interface ExaContent {
  id: string;
  url: string;
  title: string;
  extract: string;                  // First 1000 tokens
  author?: string;
}
```

**Implementation Approach**:
```typescript
// Exa query patterns emphasize technical depth
const exaQueryTemplates = {
  See: "{vendor} API documentation transparency model visibility",
  Change: "{vendor} configuration guide API customization options",
  Use: "{vendor} getting started tutorial implementation guide",
  Adapt: "{vendor} integration guide API reference webhooks",
  Leave: "{vendor} export data migration API backup",
  Learn: "{vendor} documentation best practices examples tutorials"
};

// Example API call (using fetch for TypeScript/Node.js)
async function searchExa(vendor: string, category: string): Promise<ExaSearchResponse> {
  const query = exaQueryTemplates[category].replace('{vendor}', vendor);

  // Calculate 6 months ago for recency filter
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const response = await fetch('https://api.metaphor.systems/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.EXA_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      num_results: 10,
      type: 'neural',              // Semantic search (better than keyword)
      use_autoprompt: true,        // Let Exa optimize query
      start_published_date: sixMonthsAgo.toISOString().split('T')[0],
      include_domains: [
        'github.com',              // Prioritize GitHub
        'docs.*.com',              // Official docs
        'reddit.com',              // Community feedback
        'news.ycombinator.com'     // HN discussions
      ]
    })
  });

  return response.json();
}
```

**Key Features Used**:
- `num_results=10`: 10 results per query
- `type='neural'`: Semantic search (understands meaning, not just keywords)
- `use_autoprompt=true`: Exa optimizes query for better results
- `start_published_date`: Filter to last 6 months (preferred)
- `include_domains`: Focus on GitHub, official docs, community sites

**Recency Handling**:
- Exa provides `published_date` field (ISO format)
- Filter for <6 months in API call (`start_published_date`)
- Include >6 months only if domain is official vendor docs or GitHub
- Calculate age on client: `Math.floor((now - publishedDate) / (30 * 24 * 60 * 60 * 1000))` months

**Alternatives Considered**:
- Algolia DocSearch: Rejected (requires vendor integration, doesn't work for arbitrary vendors)
- GitHub Search API: Rejected (limited to GitHub only, misses vendor docs)
- Context7: Rejected (designed for known libraries, not ad-hoc vendor research)

---

### 3. Prompt Engineering for Synthesis

**Decision**: Two-stage prompting - Category Analysis → Cross-Category Synthesis

**Rationale**:
- Stage 1 (existing): Generate category analyses from answers
- Stage 2 (new): Synthesize Cons/Pros/Extended from category analyses + research
- Separation ensures category analyses remain auditable while synthesis adds executive view
- Prompt caching reduces cost (category analyses cached, synthesis varies)

**Synthesis Prompt Structure**:

```
System: You are an AI procurement analyst specializing in evaluating software vendors for enterprise adoption.

Context:
- Vendor: {vendorName}
- Evaluation Date: {evaluationDate}
- Completion: {completionStatus}
- Voice Mode: {no-bs | corporate}

Category Analyses:
{categoryAnalyses} // See, Change, Use, Adapt, Leave, Learn

Research Findings:
{researchFindings} // Brave + Exa results with sources

User Notes:
{userNotes} // Additional context from evaluator

Task: Generate executive-ready analysis with three sections:

1. CONS (Negatives & Why Concerning):
Synthesize negative findings across all categories. Explain business impact:
- See: Opacity → vendor lock-in, hidden costs
- Change: Rigidity → can't adapt to workflows
- Use: Complexity → low adoption, training costs
- Adapt: Closed → integration challenges
- Leave: Lock-in → exit costs, data loss risk
- Learn: Proprietary → team dependency, hiring challenges

2. PROS (Positives & Why They Matter):
Synthesize positive findings across all categories. Explain business value:
- See: Transparency → trust, predictability
- Change: Flexibility → adapt to needs
- Use: Simplicity → fast adoption, low training
- Adapt: Open → ecosystem benefits
- Leave: Portable → risk mitigation
- Learn: Transferable → team resilience

3. EXTENDED (Balanced Analysis):
Present trade-offs without firm recommendation. Acknowledge:
- When pros/cons are balanced
- Organizational factors that affect decision
- User notes providing additional nuance
- Research contradictions or gaps
- DO NOT say "I recommend" or "you should"

Output Format: {no-bs | corporate} voice mode
```

**Positive/Negative Classification Rules** (from clarifications):
- See: transparency=positive, opacity=negative
- Change: customization=positive, rigidity=negative
- Use: simplicity=positive, complexity=negative
- Adapt: integration=positive, closed=negative
- Leave: portability=positive, lock-in=negative
- Learn: transferable=positive, proprietary=negative

**Alternatives Considered**:
- Single-stage synthesis: Rejected (loses category detail, harder to debug)
- Sentiment analysis: Rejected (too simplistic, misses framework alignment)
- User tagging during evaluation: Rejected (extra user burden, breaks flow)

---

### 4. Progress Tracking Implementation

**Decision**: Server-Sent Events (SSE) from Edge Function with fallback to polling

**Rationale**:
- SSE provides real-time updates without polling overhead
- Edge Functions (Deno) support streaming responses natively
- Graceful fallback to polling if SSE fails (network issues, proxies)
- Cancel operation via AbortController

**Implementation**:

```typescript
// Edge Function: Stream progress updates
const encoder = new TextEncoder();
const stream = new ReadableStream({
  async start(controller) {
    // Phase 1: Research (0-60%)
    for (const category of categories) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
        phase: 'research',
        currentCategory: category,
        progress: calculateProgress(),
        estimatedTimeRemaining: estimate()
      })}\n\n`));

      await researchCategory(category); // Brave + Exa queries
    }

    // Phase 2: Synthesis (60-100%)
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      phase: 'synthesis',
      progress: 80,
      estimatedTimeRemaining: 60
    })}\n\n`));

    const report = await synthesizeReport();

    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
      phase: 'complete',
      progress: 100,
      report: report
    })}\n\n`));

    controller.close();
  }
});

return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  }
});
```

**Client Side**:
```typescript
const eventSource = new EventSource('/generate-report?evaluationId=...');
eventSource.onmessage = (event) => {
  const update = JSON.parse(event.data);
  setProgress(update);
};

// Cancel support
const abortController = new AbortController();
const cancel = () => {
  abortController.abort();
  eventSource.close();
  generateQuickReport(); // Fallback
};
```

**Time Estimation Algorithm**:
- Research phase: 6 categories × 2 APIs × 5-10s avg = 60-120s
- Synthesis phase: Claude API call ~30-60s
- Total: 90-180s, display "~2-3 minutes remaining"

**Alternatives Considered**:
- WebSockets: Rejected (overkill for one-way updates, connection overhead)
- Polling only: Rejected (wasteful, higher latency, more Edge Function calls)
- No progress: Rejected (5-minute wait requires user feedback per constitution)

---

### 5. Research Source Quality Assessment

**Decision**: Multi-factor scoring with domain authority, recency, and source type weighting

**Rationale**:
- Domain authority prevents spam/low-quality sites
- Recency is critical for fast-moving AI tools (from clarifications)
- Community sites (Reddit, HN) valued highly as user experience evidence

**Scoring Algorithm**:

```typescript
interface SourceQuality {
  score: number;           // 0-100
  includeInReport: boolean;
  ageWarning?: string;
}

function assessSourceQuality(result: SearchResult): SourceQuality {
  let score = 50; // baseline

  // Domain authority (+30)
  if (OFFICIAL_DOMAINS.includes(result.domain)) score += 30; // vendor.com, docs.vendor.com
  else if (TECH_NEWS.includes(result.domain)) score += 25;   // techcrunch, theverge, etc.
  else if (COMMUNITY.includes(result.domain)) score += 30;   // reddit, hackernews (VALUED HIGHLY)
  else if (GITHUB_DOMAINS.includes(result.domain)) score += 20; // github.com

  // Recency (from clarifications: prefer <6 months)
  const age = calculateAge(result.publishedDate);
  if (age < 6) score += 20;      // <6 months: strongly preferred
  else if (age < 12) score += 10; // 6-12 months: acceptable with age indicator
  else if (age >= 12) {
    // >12 months: only if foundational
    if (isFoundational(result)) {
      score -= 10; // penalty but still considered
      return {
        score,
        includeInReport: score >= 60,
        ageWarning: `Source is ${age} months old (foundational architecture decision)`
      };
    } else {
      return { score: 0, includeInReport: false }; // reject
    }
  }

  // Source type weighting
  if (result.sourceType === 'community') score += 10; // Reddit/HN valued highly
  if (result.sourceType === 'documentation') score += 5;

  return {
    score,
    includeInReport: score >= 60, // threshold
    ageWarning: age >= 6 ? `Source is ${age} months old` : undefined
  };
}

function isFoundational(result: SearchResult): boolean {
  // Heuristics for foundational content
  return result.title.toLowerCase().includes('architecture') ||
         result.title.toLowerCase().includes('design decision') ||
         result.url.includes('/blog/') && result.title.includes('announcing');
}
```

**Domain Lists**:
```typescript
const OFFICIAL_DOMAINS = [/* vendor.com, docs.vendor.com, api.vendor.com */];
const TECH_NEWS = ['techcrunch.com', 'theverge.com', 'arstechnica.com', 'wired.com'];
const COMMUNITY = ['reddit.com', 'news.ycombinator.com', 'stackoverflow.com'];
const GITHUB_DOMAINS = ['github.com'];
```

**Contradiction Detection**:
- If research finding contradicts user answer, flag for Extended section
- Example: User says "Yes" to transparency but research shows "proprietary prompts"
- Include both perspectives with clear attribution

**Alternatives Considered**:
- Trust all API results: Rejected (spam, low-quality content)
- Require multiple corroborating sources: Rejected (too strict, limits findings)
- Include all with disclaimers: Rejected (clutters report, poor signal-to-noise)

---

## Summary of Decisions

| Topic | Decision | Key Rationale |
|-------|----------|---------------|
| Research APIs | Brave Search + Exa | Brave for breadth, Exa for technical depth, both privacy-focused |
| Query Strategy | 6 framework-focused queries per API | Aligns with core principle (framework-only, no generic research) |
| Synthesis Approach | Two-stage (category → cross-category) | Preserves auditability while adding executive view |
| Progress Tracking | SSE with polling fallback | Real-time updates for 5-minute operation (UX requirement) |
| Source Quality | Multi-factor scoring (domain + recency + type) | Balances quality with availability, values community feedback |
| Recency Handling | <6 months preferred, >12 months only if foundational | Fast-moving AI tools require recent information |
| Error Recovery | Retry once, continue with partial results | Maximizes value, graceful degradation |
| Classification Logic | Framework-aligned best practices | Objective, consistent, defensible (transparency=positive, etc.) |

## Implementation Details Added

**Context7 Enhancement (2025-10-26)**:

Added complete API implementation details from official documentation:

### Brave Search API
- Endpoint: `https://api.search.brave.com/res/v1/web/search`
- Authentication: `X-Subscription-Token` header
- Parameters: `q`, `count`, `freshness`, `text_decorations`
- Response: `web.results[]` with `title`, `url`, `description`, `age`
- Freshness values: `pd` (day), `pw` (week), `pm` (month), `py` (year)

### Exa API
- Endpoint: `https://api.metaphor.systems/search` (formerly Metaphor)
- Authentication: `Bearer` token
- Parameters: `query`, `num_results`, `type`, `use_autoprompt`, `start_published_date`, `include_domains`
- Response: `results[]` with `id`, `url`, `title`, `published_date`
- Types: `neural` (semantic) or `keyword`
- Supports domain filtering and date range filtering

Both APIs documented with TypeScript interfaces, complete request/response examples, and working code snippets for Edge Function integration.

## Next Steps

1. ✅ Research complete (with implementation details from Context7)
2. ✅ Create data-model.md (Phase 1) - Already complete
3. ✅ Create contracts/ (Phase 1) - Already complete
4. ✅ Create quickstart.md (Phase 1) - Already complete
5. ⏳ Update agent context (if needed)
6. ⏳ Generate tasks.md (Phase 2 - /speckit.tasks command)

**Ready for /speckit.tasks to generate implementation task breakdown.**
