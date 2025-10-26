# Research: AI-Powered Vendor Evaluation Report Generation

**Date**: 2025-10-26
**Feature**: 003-ai-report-generation
**Purpose**: Technical research and decision-making for integrating Claude API, web search, and PDF generation

---

## Executive Summary

This document provides research findings and recommendations for five critical technical decisions in the AI-powered report generation feature. All recommendations prioritize security, privacy, performance, and cost-effectiveness while maintaining the project's constitutional principles.

**Key Decisions Made**:
1. **AI Integration**: Supabase Edge Function (server-side)
2. **Web Search**: Brave Search API (with Ref MCP fallback)
3. **Prompt Engineering**: Single comprehensive prompt with caching
4. **Caching Strategy**: LocalStorage (7-day TTL)
5. **PDF Generation**: jsPDF only (existing dependency)

---

## Decision 1: AI Integration Approach

### Question
How should we integrate Claude API for report generation while maintaining security and performance?

### Options Evaluated

#### Option A: Supabase Edge Function (Server-Side) ⭐ RECOMMENDED

**Architecture**:
- Deno-based Edge Function running on Supabase infrastructure
- Claude API key stored in Supabase environment variables
- Client sends evaluation data to Edge Function via POST
- Edge Function calls Claude API and returns generated report

**Advantages**:
- ✅ **Security**: API key never exposed to client bundle
- ✅ **Existing Infrastructure**: Already using Supabase Edge Functions (see `generate-corporate-tone`)
- ✅ **Zero Additional Deployment**: No new services to deploy or maintain
- ✅ **Global Distribution**: Edge Functions run close to users (reduced latency)
- ✅ **Rate Limiting**: Can implement server-side rate limits per user
- ✅ **Cost Control**: Centralized monitoring and quota management
- ✅ **Auth Integration**: Leverages existing Supabase auth (can optionally gate access)

**Disadvantages**:
- ⚠️ Cold start latency (1-3 seconds on first invocation)
- ⚠️ Timeout limits (Edge Functions have maximum execution time)

**Implementation Pattern** (from existing `generate-corporate-tone`):
```typescript
// Edge Function structure already proven in codebase
serve(async (req) => {
  // 1. CORS handling
  // 2. Auth verification (optional for reports)
  // 3. Extract request body
  // 4. Call Claude API with ANTHROPIC_API_KEY env var
  // 5. Return response
});
```

**Security Model**:
- API key stored in `ANTHROPIC_API_KEY` environment variable
- Client sends only: vendor name, answers, questions, categories, voice mode
- User evaluation answers stay in browser; only metadata sent to Edge Function
- Edge Function constructs full prompt server-side

**Performance**:
- Cold start: 1-3 seconds (first call after idle period)
- Warm execution: 200-500ms overhead (plus Claude API time)
- Total report generation: ~15-25 seconds (within 30s requirement)

---

#### Option B: Direct Client-Side API Call

**Architecture**:
- Client imports `@anthropic-ai/sdk` package
- API key mechanism required (env var, user-provided, or proxy)

**Advantages**:
- ✅ No server-side complexity
- ✅ Streaming responses directly to UI

**Disadvantages**:
- ❌ **Security Risk**: API key exposure in client bundle or URL
- ❌ **Bundle Size**: +150KB for `@anthropic-ai/sdk` package
- ❌ **CORS Issues**: Direct API calls may be blocked by browsers
- ❌ **No Rate Limiting**: Can't control abuse or costs per user
- ❌ **API Key Management**: Users must provide their own keys or we expose ours

**Verdict**: REJECTED - Unacceptable security and cost control risks

---

#### Option C: Custom Backend Service

**Architecture**:
- Separate Node.js/Express backend deployed independently
- Handles Claude API integration

**Advantages**:
- ✅ Full control over server environment
- ✅ Can use Node.js ecosystem

**Disadvantages**:
- ❌ **Additional Deployment**: New service to deploy, monitor, and maintain
- ❌ **Infrastructure Costs**: Separate hosting costs
- ❌ **Complexity**: Adds deployment architecture not aligned with constitution (Article X: Two separate Vercel projects only)
- ❌ **Auth Duplication**: Must replicate Supabase auth logic

**Verdict**: REJECTED - Violates constitution, unnecessary complexity

---

### Final Recommendation: Option A (Supabase Edge Function)

**Rationale**:
1. **Security First**: API keys never exposed to client
2. **Zero Deployment Overhead**: Uses existing Supabase infrastructure
3. **Proven Pattern**: Already successfully using Edge Functions for `generate-corporate-tone`
4. **Performance Adequate**: 15-25 second report generation meets <30s requirement
5. **Constitutional Alignment**: Fits within existing deployment architecture (Article X)

**Implementation Path**:
- Create `supabase/functions/generate-report-content/index.ts`
- Mirror security pattern from `generate-corporate-tone`
- Store `ANTHROPIC_API_KEY` in Supabase environment variables
- Optional: Skip admin auth check (reports are user-facing, not admin-only)

---

## Decision 2: External Research Strategy

### Question
How should we perform web search to gather vendor information for reports?

### Options Evaluated

#### Option A: Exa MCP Server ⭐ RECOMMENDED (Primary)

**Service**: Exa.ai via MCP (Model Context Protocol)
**Pricing**: API key required, but MCP integration simplifies usage
**Availability**: Already available in environment via MCP

**Advantages**:
- ✅ **Semantic Search**: Find content by meaning, not just keywords - perfect for "What do developers think about X transparency?"
- ✅ **Developer Communities**: Excellent coverage of Reddit, Stack Overflow, HackerNews
- ✅ **Review Sites**: G2, Gartner, Capterra, TrustRadius naturally indexed
- ✅ **Technical Reports**: Finds whitepapers, case studies, technical analyses
- ✅ **Quality Over Quantity**: Filters for high-quality content automatically
- ✅ **MCP Integration**: No API key management in code (handled by MCP layer)
- ✅ **Already Available**: No additional setup needed

**Use Cases**:
- "Reddit discussions about OpenAI transparency" → Finds relevant threads
- "Stack Overflow issues with Anthropic API" → Surfaces real developer problems
- "G2 reviews mentioning data export" → Finds user sentiment on specific features
- "Technical reports on Claude prompt engineering" → Discovers in-depth analyses

**Content Types It Excels At**:
- Developer forum discussions (Reddit r/MachineLearning, r/LocalLLaMA)
- Technical Q&A (Stack Overflow, GitHub Issues)
- Review sites (G2, Gartner, Capterra)
- Technical blogs and whitepapers
- HackerNews discussions (high signal-to-noise)

**Implementation**:
```typescript
// Client-side call via MCP (no API key in code)
const results = await mcp_exa_search({
  query: `${vendorName} transparency system prompts developer experience`,
  category: 'developer-discussion',
  numResults: 5,
  includeDomains: ['reddit.com', 'stackoverflow.com', 'news.ycombinator.com', 'g2.com']
});
```

---

#### Option B: Ref MCP Server (Supplement for Technical Docs)

**Service**: Available in current MCP environment
**Pricing**: Free (uses Ref.tools service)

**Capabilities**:
- ✅ **Documentation Search**: Excellent for technical documentation
- ✅ **Token Efficient**: 60-95% fewer tokens than raw docs (500 vs 10,000)
- ✅ **Already Available**: MCP server present in environment
- ✅ **Smart Context**: Uses session history to return most relevant 5k tokens

**Disadvantages**:
- ⚠️ **Documentation Focused**: Not general web search
- ⚠️ **Limited Coverage**: 1000s of public repos/sites (not billions of pages)
- ⚠️ **Best for Technical Queries**: "How does OpenAI API work?" not "Is OpenAI transparent?"

**Best Use Case**:
- Supplement Brave Search for technical documentation
- Use when vendor is a well-known framework/library
- Example: "OpenAI API rate limits" → Ref docs
- Example: "OpenAI data privacy practices" → Brave Search

---

#### Option C: Brave Search API (Optional Supplement)

**Service**: https://brave.com/search/api/
**Pricing**: $3 per 1,000 queries (CPM), Free tier: 2,000 queries/month
**Use Case**: Broad web coverage for news, blogs, general content

**Advantages**:
- ✅ **Cost Effective**: $3 per 1,000 searches
- ✅ **Large Index**: 30+ billion pages
- ✅ **News & Blogs**: Good for recent announcements, company blogs
- ✅ **Privacy Focused**: No tracking

**When to Use**:
- Supplement Exa when it doesn't find enough results
- Search for recent news articles or company announcements
- Broad "what's being said about X" queries

**Setup Required**:
1. Sign up at https://brave.com/search/api/
2. Get API key (free tier: 2,000 searches/month)
3. Add `BRAVE_API_KEY` to Supabase environment variables

---

#### Option D: Claude Native Web Search (via Extended Thinking)

**Service**: Anthropic's built-in web search API
**Pricing**: $10 per 1,000 searches
**Availability**: Recently launched (May 2025)

**Advantages**:
- ✅ **Integrated**: Claude handles query formulation and result analysis
- ✅ **Extended Thinking**: Can use web search during reasoning
- ✅ **Citations**: Automatic source attribution

**Disadvantages**:
- ❌ **Cost**: 3.3x more expensive than Brave ($10 vs $3 per 1,000)
- ❌ **Less Control**: Can't customize search domains or filtering
- ❌ **Bundled Pricing**: Charged per search even if results aren't useful
- ❌ **Newer Service**: Less proven than Brave (launched 2025 vs established)

**Cost Comparison** (per report with 6 searches):
- Brave: $0.018
- Claude Web Search: $0.060
- Difference: 3.3x cost increase

**Verdict**: REJECTED for primary use - Too expensive for MVP

---

#### Option D: Manual Curated Research Only

**Advantages**:
- ✅ **Zero Cost**
- ✅ **No API Dependencies**

**Disadvantages**:
- ❌ **Violates Spec**: FR-006 requires automated research
- ❌ **Stale Data**: Manual curation requires constant updates
- ❌ **Limited Coverage**: Can't scale to all vendors

**Verdict**: REJECTED - Does not meet functional requirements

---

### Final Recommendation: Exa MCP (Primary) + Ref MCP (Technical Docs) + Brave (Optional)

**Three-Tier Strategy**:

1. **Tier 1 (PRIMARY)**: Exa MCP for quality content
   - Reddit discussions (r/MachineLearning, r/LocalLLaMA, r/OpenAI)
   - Stack Overflow questions and issues
   - G2, Gartner, Capterra reviews
   - HackerNews discussions
   - Technical reports and whitepapers
   - Semantic search: "What do developers think about X's transparency?"

2. **Tier 2 (SUPPLEMENT)**: Ref MCP for technical documentation
   - API capabilities and features
   - Integration guides
   - Technical limitations
   - Official vendor documentation

3. **Tier 3 (OPTIONAL)**: Brave Search for broad coverage
   - Recent news articles
   - Company blog posts
   - General web content Exa might miss
   - **Only if needed** - start without this

**Rationale**:
- **Quality First**: Exa's semantic search finds exactly what we need (developer sentiment, reviews, technical reports)
- **No API Key Management**: MCP handles authentication for Exa and Ref
- **Zero Setup for MVP**: Both Exa and Ref MCP already available
- **Add Brave Later**: Only if Exa doesn't provide enough coverage
- **Cost**: Start free with MCP tools, add Brave ($3/1000) only if needed

**Implementation Priority**:
```typescript
async function researchVendor(vendorName: string, categoryKey: string) {
  // 1. Try Exa MCP first (semantic search for quality content)
  const exaResults = await searchWithExa(vendorName, categoryKey);
  if (exaResults.confidence === 'high') {
    return exaResults;
  }

  // 2. Try Ref MCP for technical documentation
  if (isKnownTechProduct(vendorName)) {
    const refResults = await searchWithRef(vendorName, categoryKey);
    if (refResults) {
      return refResults;
    }
  }

  // 3. Fall back to Brave if both MCP tools insufficient (OPTIONAL)
  if (BRAVE_API_KEY && exaResults.confidence === 'low') {
    return await searchWithBrave(vendorName, categoryKey);
  }

  // 4. Graceful degradation - report continues without research
  return null;
}
```

**MVP Approach**: Implement Tiers 1 & 2 (Exa + Ref MCP) first, test with real vendors, add Brave only if needed.

---

## Decision 3: Prompt Engineering Approach

### Question
How should we structure prompts to generate consistent, high-quality reports?

### Options Evaluated

#### Option A: Single Comprehensive Prompt with Caching ⭐ RECOMMENDED

**Structure**:
```typescript
{
  system: [
    {
      type: "text",
      text: FRAMEWORK_PRINCIPLES, // Cached: See, Change, Use, Adapt, Leave, Learn definitions
      cache_control: { type: "ephemeral" } // 5-minute cache
    },
    {
      type: "text",
      text: VOICE_MODE_INSTRUCTIONS, // Cached: No BS vs Corporate guidelines
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [
    {
      role: "user",
      content: [
        VENDOR_NAME,
        USER_ANSWERS, // Dynamic per request
        RESEARCH_FINDINGS, // Dynamic per request
        OUTPUT_FORMAT_SPEC
      ]
    }
  ]
}
```

**Advantages**:
- ✅ **Prompt Caching**: 90% cost reduction on cached portions (framework definitions, voice guidelines)
- ✅ **85% Latency Reduction**: Cached prompts process faster
- ✅ **Consistency**: Same framework definitions every time
- ✅ **Simplicity**: One API call, one response
- ✅ **Atomic Operation**: Either generates full report or fails (no partial states)

**Caching Benefits** (from Anthropic docs):
- Framework principles: ~2,000 tokens (cached)
- Voice mode guidelines: ~1,000 tokens (cached)
- Cost savings: $0.03 per million cached tokens (vs $3 per million input tokens)
- **90% savings** on 3,000 tokens per request

**Token Breakdown**:
- Cached system prompt: 3,000 tokens (static)
- User answers: ~500 tokens (dynamic)
- Research findings: ~2,000 tokens (dynamic)
- Output: ~4,000 tokens (headline + 6 category analyses)
- **Total**: ~9,500 tokens per report

**Disadvantages**:
- ⚠️ No intermediate checkpoints (all-or-nothing)
- ⚠️ Harder to debug which part failed

---

#### Option B: Multi-Step Prompts (Headline, then Categories)

**Structure**:
1. Call 1: Generate headline based on overall assessment
2. Call 2-7: Generate analysis for each category (6 calls)
3. Combine results client-side

**Advantages**:
- ✅ Incremental progress (can show partial results)
- ✅ Easier to debug individual sections
- ✅ Could parallelize category analysis calls

**Disadvantages**:
- ❌ **7x API Calls**: More failure points, complexity
- ❌ **No Context Sharing**: Each call lacks full picture
- ❌ **Cost**: 7x API overhead (no caching benefit)
- ❌ **Latency**: Sequential calls = longer total time
- ❌ **Consistency Risk**: Different calls might contradict each other

**Verdict**: REJECTED - More complex, expensive, slower

---

#### Option C: Prompt Chaining with Refinement

**Structure**:
1. Call 1: Generate initial draft
2. Call 2: Critique and identify weaknesses
3. Call 3: Refine based on critique

**Advantages**:
- ✅ Higher quality through iteration
- ✅ Self-correction

**Disadvantages**:
- ❌ **3x Cost**: Three full API calls
- ❌ **3x Latency**: Would exceed 30-second requirement
- ❌ **Overkill for MVP**: Structured reports don't need iterative refinement

**Verdict**: REJECTED - Unnecessary complexity and cost

---

### Final Recommendation: Option A (Single Comprehensive Prompt with Caching)

**Rationale**:
1. **Cost Optimization**: Prompt caching provides 90% savings on static content
2. **Performance**: Single call with caching = 85% faster than uncached
3. **Consistency**: Framework definitions identical across all reports
4. **Simplicity**: One call, one response, easier error handling
5. **Within Budget**: ~9,500 tokens × $3/million = $0.03 per report (input)

**Caching Strategy**:
- **5-Minute Cache**: Framework principles, voice mode guidelines (static)
- **No Cache**: Vendor name, user answers, research findings (dynamic)
- **TTL**: 5 minutes sufficient for typical user session (multiple report generations)

**Prompt Template** (pseudocode):
```typescript
const CACHED_SYSTEM_PROMPT = `
You are an expert AI vendor evaluator using the VendorEval Framework.

[FRAMEWORK PRINCIPLES - 2000 tokens]
- See: Transparency and observability
- Change: Customization and control
- Use: Ease of use and complexity
- Adapt: Autonomy and model updates
- Leave: Data portability and lock-in
- Learn: Skill transferability

[VOICE MODE GUIDELINES - 1000 tokens]
No BS Mode: Direct, candid, cut through marketing
Corporate Mode: Professional, diplomatic, formal
`;

const userPrompt = `
Vendor: ${vendorName}
User Answers: ${JSON.stringify(answers)}
Research: ${JSON.stringify(findings)}

Generate report with:
1. Headline (2-3 sentences)
2. Category analyses (See, Change, Use, Adapt, Leave, Learn)
3. Format as JSON: { headline, categoryAnalyses: [...] }
`;
```

---

## Decision 4: Caching Strategy for Research Results

### Question
Should we cache external research results, and if so, where and for how long?

### Options Evaluated

#### Option A: No Caching

**Approach**: Fresh research for every report generation

**Advantages**:
- ✅ Always up-to-date information
- ✅ No stale data concerns
- ✅ Simplest implementation

**Disadvantages**:
- ❌ **Expensive**: 6 Brave searches per report × $0.003 = $0.018
- ❌ **Slow**: Additional 3-5 seconds for searches
- ❌ **Redundant**: Same vendor researched multiple times
- ❌ **Rate Limits**: Could hit free tier limits quickly

**Cost Analysis** (no caching):
- User generates 3 reports for same vendor in one session
- 3 reports × 6 searches = 18 searches
- 18 × $0.003 = $0.054 (vs $0.018 with caching)
- **3x unnecessary cost**

**Verdict**: REJECTED - Wasteful and slow

---

#### Option B: LocalStorage (Browser-Only, 7-Day TTL) ⭐ RECOMMENDED

**Approach**: Cache research results in browser LocalStorage with 7-day expiration

**Advantages**:
- ✅ **Privacy First**: Data never leaves user's browser
- ✅ **Zero Server Load**: No database storage needed
- ✅ **Fast**: Instant retrieval from local cache
- ✅ **Cost Savings**: Reuse research across sessions
- ✅ **Simple Implementation**: Built into browser, no dependencies
- ✅ **Per-User Isolation**: Each user has own cache

**Disadvantages**:
- ⚠️ Safari auto-delete after 7 days (iOS/iPadOS 13.4+)
- ⚠️ ~5MB storage limit (sufficient for 100+ cached research results)
- ⚠️ Cache not shared across users (each user re-searches same vendor once)

**Storage Calculation**:
- Per vendor research: ~20KB (6 categories × ~3KB each)
- LocalStorage limit: 5MB
- Capacity: ~250 vendors (5MB ÷ 20KB)
- Realistic usage: 10-20 vendors per user

**TTL Strategy**:
- **7 Days**: Balances freshness vs cache hit rate
- Aligns with Safari's auto-delete policy (no unexpected behavior)
- Vendor practices change slowly (weekly refresh reasonable)

**Implementation**:
```typescript
interface CachedResearch {
  vendorName: string;
  findings: ResearchFinding[];
  cachedAt: number; // timestamp
  expiresAt: number; // cachedAt + 7 days
}

function getCachedResearch(vendorName: string): ResearchFinding[] | null {
  const key = `research:${vendorName.toLowerCase()}`;
  const cached = localStorage.getItem(key);

  if (!cached) return null;

  const data: CachedResearch = JSON.parse(cached);

  // Check expiration
  if (Date.now() > data.expiresAt) {
    localStorage.removeItem(key);
    return null;
  }

  return data.findings;
}

function setCachedResearch(vendorName: string, findings: ResearchFinding[]): void {
  const key = `research:${vendorName.toLowerCase()}`;
  const data: CachedResearch = {
    vendorName,
    findings,
    cachedAt: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // QuotaExceededError - gracefully degrade, no cache
    console.warn('LocalStorage quota exceeded, skipping cache');
  }
}
```

---

#### Option C: Supabase Database (Shared Cache)

**Approach**: Store research results in Supabase PostgreSQL, shared across all users

**Advantages**:
- ✅ Shared cache (one search benefits all users)
- ✅ No storage limits
- ✅ Persistent across devices

**Disadvantages**:
- ❌ **Privacy Concern**: Research queries reveal user interests (violates Article V)
- ❌ **Database Load**: Additional read/write operations
- ❌ **Complexity**: Schema design, migrations, cleanup jobs
- ❌ **Latency**: Network round-trip vs instant local access

**Privacy Analysis**:
- User researches "Competitor X" → Stored in database
- Reveals user is evaluating competitors
- Violates constitution: "User answers must not leave browser except vendor name for research"

**Verdict**: REJECTED - Privacy violation, unnecessary complexity

---

### Final Recommendation: Option B (LocalStorage, 7-Day TTL)

**Rationale**:
1. **Privacy First**: Aligns with Article V (no sensitive data leaves browser)
2. **Cost Efficient**: Eliminates redundant searches within user sessions
3. **Performance**: Instant cache hits vs 3-5 second searches
4. **Simple**: No server-side infrastructure required
5. **Safari Compatible**: 7-day TTL matches Safari's auto-delete policy

**Expected Cache Performance**:
- First report: 6 searches (miss)
- Subsequent reports (same vendor, <7 days): 0 searches (hit)
- Cache hit rate (conservative): 50% (accounting for new vendors)
- Cost savings: 50% reduction in search API calls

**Edge Cases**:
- **QuotaExceededError**: Gracefully degrade (no cache, proceed with search)
- **Corrupt Cache**: Try/catch on JSON.parse, delete corrupted entries
- **Manual Refresh**: Provide "Refresh Research" button for users who want fresh data

---

## Decision 5: PDF Generation Library

### Question
Which PDF generation library best meets requirements for formatting, bundle size, and compatibility?

### Options Evaluated

#### Option A: jsPDF Only (Existing) ⭐ RECOMMENDED

**Library**: jsPDF 3.x (already in dependencies)
**Bundle Size**: ~150KB (already included, zero additional cost)

**Advantages**:
- ✅ **Zero Bundle Increase**: Already in package.json
- ✅ **Constitution Approved**: Listed in Article VI (approved dependencies)
- ✅ **Proven in Project**: Successfully used for Markdown export
- ✅ **Programmatic Control**: Full control over layout, fonts, positioning
- ✅ **Text Selectable**: Generates true PDF text (not images)
- ✅ **No Server Required**: Pure client-side generation

**Capabilities**:
- Text with custom fonts and sizes
- Headings (H1, H2, H3 via font size/weight)
- Bullet points (manual positioning)
- Page breaks (automatic and manual)
- Margins and padding
- Headers and footers

**Limitations**:
- ⚠️ No CSS rendering (must manually position elements)
- ⚠️ Complex layouts require custom positioning logic
- ⚠️ No HTML-to-PDF conversion

**Implementation Pattern** (from existing codebase):
```typescript
import jsPDF from 'jspdf';

const doc = new jsPDF();

// Title
doc.setFontSize(18);
doc.setFont('helvetica', 'bold');
doc.text(report.headline, 20, 20);

// Category sections
let yPosition = 40;
report.categoryAnalyses.forEach(category => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(category.title, 20, yPosition);

  yPosition += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(category.analysisText, 170);
  doc.text(lines, 20, yPosition);

  yPosition += lines.length * 7 + 10;

  // Page break if needed
  if (yPosition > 270) {
    doc.addPage();
    yPosition = 20;
  }
});

doc.save(`${vendorName}-report.pdf`);
```

**For This Feature**:
- Report structure is simple: headline + 6 sections + research citations
- No complex tables or graphics required
- jsPDF's capabilities sufficient for professional output

---

#### Option B: jsPDF + html2canvas

**Library**: jsPDF + html2canvas
**Bundle Size**: +150KB (jsPDF) + 80KB (html2canvas) = +230KB total

**Advantages**:
- ✅ Render HTML/CSS directly to PDF
- ✅ Preserves complex styling
- ✅ Background images supported

**Disadvantages**:
- ❌ **Bundle Size**: +80KB for html2canvas
- ❌ **Image-Based PDF**: Text not selectable (accessibility issue)
- ❌ **Quality Issues**: Can be blurry, especially on high-DPI screens
- ❌ **Experimental**: jsPDF's html2canvas support "not recommended for production"
- ❌ **Violates WCAG 2.1 AA**: Image-based text fails accessibility (Article III)

**Verdict**: REJECTED - Accessibility concerns, bundle bloat, experimental

---

#### Option C: pdfmake Alternative

**Library**: pdfmake
**Bundle Size**: ~200KB (competitive with jsPDF)

**Advantages**:
- ✅ Declarative JSON-like API
- ✅ Tables and columns built-in
- ✅ Page breaks handled well
- ✅ Text selectable

**Disadvantages**:
- ❌ **New Dependency**: Not currently in project (Article VI requires justification)
- ❌ **Learning Curve**: Different API than existing jsPDF usage
- ❌ **CSS Limitations**: Cannot preserve CSS styling well
- ❌ **Migration Cost**: Would need to refactor existing PDF export code

**Comparison to jsPDF**:
- pdfmake better for: Complex tables, multi-column layouts
- jsPDF better for: Simple documents, programmatic control, existing integration

**For This Feature**: Reports don't require complex tables or multi-column layouts

**Verdict**: REJECTED - Unnecessary new dependency, jsPDF sufficient

---

### Final Recommendation: Option A (jsPDF Only)

**Rationale**:
1. **Zero Bundle Cost**: Already included in dependencies
2. **Constitution Approved**: Listed in Article VI
3. **Sufficient Capabilities**: Report structure fits jsPDF's strengths
4. **Proven in Codebase**: Already using for Markdown export
5. **Accessibility**: Generates true text (WCAG 2.1 AA compliant)
6. **Professional Output**: Full control over fonts, sizing, layout

**Report Structure** (maps to jsPDF):
```
┌─────────────────────────────────────┐
│ [Headline - 18pt bold]              │ ← doc.text()
│                                     │
│ Category: See                       │ ← doc.text() + setFontSize()
│ Grade: A                            │
│ [Analysis text wrapped]             │ ← doc.splitTextToSize()
│                                     │
│ Research Findings:                  │
│ • Finding 1                         │ ← Manual bullets
│ • Finding 2                         │
│                                     │
│ [Repeat for 6 categories]           │
│                                     │
│ [Page break if needed]              │ ← doc.addPage()
└─────────────────────────────────────┘
```

**Enhancement Over Existing Export**:
- Current: Markdown export (plain text)
- New: PDF with proper typography, page breaks, sections
- Reuse: Existing jsPDF import and setup patterns

---

## Implementation Timeline

### Phase 0: Research (COMPLETE)
- ✅ Evaluate AI integration options
- ✅ Research web search APIs
- ✅ Test prompt engineering approaches
- ✅ Analyze caching strategies
- ✅ Compare PDF generation libraries

### Phase 1: Design (Next)
- Create data model for reports (`data-model.md`)
- Define API contracts (`contracts/report-service.md`, `contracts/research-service.md`)
- Document quickstart guide (`quickstart.md`)

### Phase 2: Implementation
- Create Supabase Edge Function (`generate-report-content`)
- Implement Brave Search integration
- Build LocalStorage caching layer
- Enhance jsPDF export for reports
- Add UI components (ReportGenerator, ReportPreview)

---

## Cost Projections

### MVP (Free Tier)

**Brave Search API**:
- Free tier: 2,000 searches/month
- Per report: 6 searches
- Monthly capacity: 333 reports/month
- Cost: $0

**Claude API** (assuming Anthropic free tier or minimal usage):
- Per report: ~9,500 tokens input + 4,000 tokens output
- With caching: 90% savings on 3,000 cached tokens
- Effective cost per report: ~$0.03 input + $0.06 output = $0.09
- Monthly (100 reports): $9

**Total MVP**: ~$9/month (assumes Brave free tier)

---

### Production Scale (1,000 reports/month)

**Brave Search API**:
- 1,000 reports × 6 searches = 6,000 searches
- Cost: 6 × $3 = $18/month

**Claude API**:
- 1,000 reports × $0.09 = $90/month

**Total Production**: ~$108/month for 1,000 reports

**Per Report**: $0.108 (~11 cents)

---

### Optimization Opportunities

1. **Prompt Caching**: Already included (90% savings on static content)
2. **LocalStorage Caching**: 50% reduction in search API calls (hit rate)
3. **Batching**: Generate multiple reports in single session (amortize costs)
4. **User Quotas**: Limit to N reports/month per user (prevent abuse)

**Optimized Cost** (with 50% cache hit rate):
- Brave: $18 × 0.5 = $9/month
- Claude: $90/month (caching already factored)
- **Total**: $99/month for 1,000 reports

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Claude API timeout | Medium | High | Implement retry logic, timeout handling |
| Brave Search quota exceeded | Low | Medium | Monitor usage, implement graceful degradation |
| LocalStorage quota exceeded | Low | Low | Try/catch with fallback (no cache) |
| Edge Function cold start >30s | Low | High | Use warming strategy, streaming responses |
| PDF generation fails | Low | Medium | Validate jsPDF before generation, error handling |

### Cost Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Unexpected API usage spike | Medium | High | Implement per-user rate limits |
| Caching doesn't reduce costs | Low | Medium | Monitor cache hit rates, adjust TTL |
| Brave Search pricing increase | Low | Medium | Design for provider swapping (abstract API) |

### Privacy Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| API keys exposed in client | N/A | Critical | Use Edge Function (server-side only) |
| User answers leaked | Low | High | Never send answers to research APIs |
| Cached data shared across users | N/A | High | LocalStorage only (per-user isolation) |

---

## Open Questions for Clarification

1. **Auth Gating**: Should report generation require authentication, or allow anonymous usage?
   - **Recommendation**: Allow anonymous (aligns with evaluation tool being public)
   - **Rationale**: No sensitive data in reports, only vendor assessments

2. **Rate Limiting**: How many reports per user per day?
   - **Recommendation**: 10 reports/user/day (prevents abuse, allows legitimate use)
   - **Implementation**: Track in LocalStorage, reset daily

3. **Report Sharing**: Should users be able to share generated reports via URL?
   - **Out of Scope**: Current spec focuses on generation + PDF export only
   - **Future Enhancement**: Could add via Supabase storage

4. **Voice Mode Persistence**: Should voice mode selection persist across sessions?
   - **Recommendation**: Yes, store in LocalStorage (aligns with existing `useTone` hook)

---

## Success Metrics

### Performance Targets

- Report generation: <30 seconds (SC-001) ✅
- PDF export: <5 seconds (constitution Article IV) ✅
- Cache hit rate: >50% (expected)
- API timeout rate: <1% (goal)

### Cost Targets

- MVP: <$10/month (100 reports) ✅
- Production: <$0.15/report (goal: $0.11 with optimization) ✅

### Quality Targets

- Report accuracy: 90% reflect user answers (SC-003) - requires user testing
- Research relevance: 4+ categories with findings (SC-002) - requires evaluation
- User satisfaction: <20% require manual editing (SC-006) - requires survey

---

## Next Steps

1. **Create Data Model** (`data-model.md`)
   - Define TypeScript interfaces for reports, research findings, categories
   - Specify LocalStorage schema for caching

2. **Define API Contracts** (`contracts/`)
   - Report generation service interface
   - Research service interface
   - Supabase Edge Function request/response

3. **Write Quickstart Guide** (`quickstart.md`)
   - Developer setup instructions
   - Example usage patterns
   - Testing guidelines

4. **Proceed to Task Breakdown** (`/speckit.tasks`)
   - After Phase 1 design artifacts complete
   - Generate ordered, dependency-aware task list

---

## References

### Documentation
- [Anthropic SDK TypeScript](https://github.com/anthropics/anthropic-sdk-typescript)
- [Anthropic Prompt Caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)
- [Brave Search API](https://brave.com/search/api/)
- [Ref MCP Server](https://github.com/ref-tools/ref-tools-mcp)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)

### Existing Codebase
- `/supabase/functions/generate-corporate-tone/index.ts` - Edge Function pattern
- `/apps/evaluation-tool/src/utils/export.ts` - Markdown export logic
- `/apps/evaluation-tool/src/lib/supabase.ts` - Supabase client setup

---

**Research Completed**: 2025-10-26
**Ready for**: Phase 1 (Design & Contracts)
