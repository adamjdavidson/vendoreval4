# Research: Multi-Stage AI Research Pipeline

**Feature**: 005-ai-research-pipeline
**Date**: 2025-10-26

## Overview

This document captures technology choices, architecture decisions, and best practices for implementing the multi-stage AI research pipeline that intelligently filters and analyzes vendor evaluation research.

---

## Technology Stack Decisions

### Primary Language & Runtime

**Decision**: TypeScript with Node.js (existing stack)

**Rationale**:
- Existing codebase uses TypeScript with strict mode
- Edge Functions run on Deno (TypeScript-first)
- Type safety critical for multi-stage pipeline with complex data flow
- Constitution mandates TypeScript for all application code

**Alternatives Considered**:
- Python (more AI/ML libraries but requires new runtime)
- Keep JavaScript (rejected - constitution requires TypeScript)

---

### AI Integration: Gemini Flash 2.0

**Decision**: Use official `@google/generative-ai` SDK for Node.js

**Rationale**:
- Official SDK provides type-safe TypeScript interfaces
- Handles authentication, request formatting, error handling, retries automatically
- Direct support for Gemini Flash 2.0 model specification
- Actively maintained by Google with latest API features
- Supports streaming responses and safety settings

**Key Features Needed**:
- Large context window (1M tokens) for processing 240-300 search results
- Structured output for filtered results and category insights
- Parallel API calls (6 category analyses)
- Cost-effective (Flash tier vs Pro tier)

**Alternatives Considered**:
- Direct REST API calls (rejected - too much manual handling)
- Vertex AI SDK (rejected - unnecessary GCP complexity for simple API usage)
- Gemini MCP tools (useful for development but SDK better for production)

**Implementation Notes**:
- Model ID: `gemini-1.5-flash-001` or `gemini-1.5-flash`
- Estimated cost: $0.075/$0.30 per million tokens (input/output)
- Typical request: ~100K tokens input, ~10K tokens output per filter call
- Per-report cost estimate: $0.10-0.20

---

### Web Content Extraction

**Decision**: @mozilla/readability + jsdom (primary) with Cheerio fallback

**Rationale**:
- Mozilla Readability is battle-tested (powers Firefox Reader View)
- Intelligently extracts main content while removing ads, navigation, boilerplate
- Works across diverse site structures using heuristics
- Provides article metadata (title, author, excerpt)
- jsdom required for DOM parsing (Readability dependency)

**Performance Considerations**:
- jsdom is memory-intensive (~8x slower than Cheerio)
- Process articles in batches of 5-10 to manage memory
- Call `window.close()` after parsing to free resources
- Use `isProbablyReaderable()` check before full parse

**Fallback Strategy**:
- If Readability fails or extracts <100 chars → fall back to Cheerio
- Cheerio useful for structured content (documentation sites, forums)
- Final fallback: basic html-to-text for emergency cases

**Known Limitations**:
- JavaScript-heavy sites (React/Vue/Angular): Static parser can't execute JS
  - Workaround: Skip these or use Puppeteer selectively (much slower)
- Paywalled content: Requires authentication
  - Workaround: Skip unavailable articles, note in report
- Anti-bot measures (Cloudflare): May block requests
  - Workaround: Rotate User-Agent, add delays, graceful degradation

**Alternatives Considered**:
- Cheerio alone (rejected - requires manual selectors per site)
- Puppeteer/Playwright (rejected - 10-100x slower, overkill for static content)
- html-to-text (rejected - too basic, includes navigation/ads)

**Dependencies**:
```
@mozilla/readability  # Article extraction
jsdom                 # DOM implementation for Node.js
cheerio               # Fallback for structured content
```

---

### HTTP Client & Rate Limiting

**Decision**: Use native `fetch` (Node.js 18+) with custom retry/rate limiting

**Rationale**:
- Node.js 18+ has built-in fetch API (no external dependencies)
- Simple retry logic with exponential backoff
- Connection pooling via custom implementation
- Parallel fetching with `Promise.allSettled()` for error isolation

**Rate Limiting Strategy**:
- Brave Search API: 1 req/sec limit (free tier)
- Exa API: Check tier limits (likely 10-20 req/sec)
- Gemini API: 60 req/min for Flash tier
- Web scraping: 5-10 concurrent fetches, 200ms delay between batches

**Retry Logic**:
- Transient failures: Exponential backoff (1s, 2s, 4s)
- Rate limits: Back off and retry after cooldown
- Permanent failures (404, 403): Skip and continue

**Alternatives Considered**:
- axios (rejected - fetch is built-in, less dependencies)
- got (rejected - same reason)
- p-limit library (maybe - for simpler concurrency control)

---

### Caching Strategy

**Decision**: Client-side localStorage with versioned cache keys (v5)

**Rationale**:
- Existing cache infrastructure in place (cacheManager)
- 7-day TTL for research findings
- Version prefix invalidates stale data when structure changes
- Browser localStorage sufficient for client-side caching

**Cache Structure**:
```
vendoreval:research:v5:{vendorName}:{categoryKey} → FilteredResult[]
```

**Cache Invalidation**:
- Version bump (v4 → v5) when introducing multi-stage pipeline
- Automatic expiration after 7 days
- Manual clear option for users

**Server-Side Caching** (Edge Functions):
- No persistent cache in Edge Functions (stateless)
- Results cached client-side after delivery
- Could add Redis for server-side cache in future if needed

---

## Architecture Decisions

### Five-Stage Pipeline

**Decision**: Separate stages for search, filter, fetch, analyze, synthesize

**Stage Breakdown**:

1. **Broad Search** (Brave + Exa APIs)
   - 12 parallel API calls (6 categories × 2 APIs)
   - 20-50 results per query = 240-300 total results
   - Execute in parallel for speed

2. **AI Relevance Filtering** (Gemini Flash)
   - Single API call with all 240-300 results
   - Leverages 1M token context window
   - Returns 30-50 filtered relevant articles
   - Includes relevance scores and reasoning

3. **Full Content Fetching** (Web scraping)
   - 20-30 parallel HTTP requests
   - Mozilla Readability for content extraction
   - Batch processing (5-10 at a time) for memory management
   - Gracefully skip failures (paywalls, 404s)

4. **AI Content Analysis** (Gemini Flash)
   - 6 parallel API calls (one per category)
   - Each call analyzes full article content for category
   - Returns structured insights with citations
   - Identifies patterns, contradictions, additional considerations

5. **Report Synthesis** (Claude API)
   - Existing generate-report-content Edge Function
   - Integrates Gemini insights with user answers
   - Supports dual voice modes (no-bs / corporate)
   - Generates final executive report

**Rationale for Separation**:
- Clear separation of concerns
- Easy to test each stage independently
- Can cache intermediate results
- Failure in one stage doesn't break others
- Progress feedback at each stage

**Alternatives Considered**:
- Combine filter + analyze (rejected - would need multiple Gemini calls anyway)
- Sequential processing (rejected - too slow, parallel is faster)
- Skip fetching, use snippets only (rejected - misses critical details)

---

### Error Handling & Fallbacks

**Decision**: Progressive degradation with user feedback

**Fallback Chain**:
1. Extended Report with full research (ideal)
2. Extended Report with partial research (some APIs failed)
3. Quick Report (research completely failed, use answers only)

**Error Categories**:
- **Transient** (network timeout, rate limit): Retry with backoff
- **Partial** (some articles fail to fetch): Continue with available articles
- **Complete** (all research fails): Fall back to Quick Report

**User Feedback**:
- Progress indicators: "Searching... Filtering... Analyzing..."
- Error messages: User-friendly with actionable guidance
- Completion status: "Research complete: 45 of 50 articles analyzed"
- Warnings: "Some sources were unavailable (paywalls)"

**Logging**:
- Development: Detailed console logs for debugging
- Production: Error logs only (constitution requirement)
- Never log: User data, vendor names, evaluation answers (privacy)

---

### Data Flow

**Decision**: Typed interfaces at each stage boundary

**Type Chain**:
```
Search APIs → SearchResult[]
   ↓ (Gemini Filter)
FilteredResult[]
   ↓ (Web Fetch)
ArticleContent[]
   ↓ (Gemini Analysis)
CategoryInsight[]
   ↓ (Claude Synthesis)
Report
```

**Type Safety**:
- Strict TypeScript interfaces for each entity
- Validation at stage boundaries
- Explicit error types for each failure mode
- No `any` types (constitution requirement)

---

## Performance Targets

**Latency Goals**:
- Stage 1 (Search): 2-5 seconds (parallel API calls)
- Stage 2 (Filter): 5-10 seconds (single Gemini call, large context)
- Stage 3 (Fetch): 10-20 seconds (parallel fetching, 20-30 articles)
- Stage 4 (Analyze): 15-30 seconds (6 parallel Gemini calls)
- Stage 5 (Synthesize): 10-20 seconds (Claude API)
- **Total: 42-85 seconds (0.7-1.4 minutes)**

**Comparison to Spec Target**: Spec says "<3 minutes" - this achieves that comfortably

**Optimization Opportunities**:
- Parallel execution wherever possible
- Batch processing for memory-intensive operations
- Early termination if user cancels
- Cache hot paths (repeat vendors)

**Resource Constraints**:
- Memory: jsdom uses ~50-100MB per article, batch to limit total
- API costs: ~$0.10-0.20 per report (Gemini Flash is cheap)
- Rate limits: Respect API limits, queue requests if needed

---

## Testing Strategy

**Unit Tests** (Vitest):
- Content extraction (mock HTML → text)
- Result filtering logic (relevance scoring)
- Error handling (retry logic, fallbacks)
- Data validation (type checking)

**Integration Tests**:
- End-to-end pipeline with mock APIs
- Verify each stage transitions correctly
- Test fallback scenarios (partial failures)
- Validate output structure

**Manual Testing**:
- Test with real vendors (common names: Jasper, Atlas, Compass)
- Verify relevance improvement (90% target)
- Check article quantity (30-50 articles)
- Validate insights reference full content (not just titles)
- Test across browsers (Chrome, Firefox, Safari)

**Performance Testing**:
- Measure latency for each stage
- Monitor memory usage during batch processing
- Test with maximum load (50 articles, 6 categories)
- Verify graceful degradation under failures

---

## Security & Privacy

**API Keys**:
- Store in Supabase Edge Function secrets (not frontend)
- GEMINI_API_KEY for Gemini Flash API
- BRAVE_API_KEY already configured
- EXA_API_KEY already configured (needs verification)
- ANTHROPIC_API_KEY already configured

**User Data**:
- Vendor name sent to APIs for research (necessary)
- User answers sent to Gemini for context (filtering relevance)
- No tracking or analytics (constitution requirement)
- Research results cached locally (localStorage)

**Content Security**:
- Sanitize HTML during extraction (XSS prevention)
- Validate URLs before fetching (no file:// or dangerous schemes)
- Respect robots.txt and rate limits (ethical scraping)
- Handle malicious content gracefully (malformed HTML)

---

## Dependencies Summary

**New Dependencies**:
```json
{
  "@google/generative-ai": "^0.2.0",  // Gemini API SDK
  "@mozilla/readability": "^0.5.0",    // Article extraction
  "jsdom": "^23.0.0",                  // DOM for Readability
  "cheerio": "^1.0.0"                  // Fallback parser
}
```

**Existing Dependencies** (reused):
- `@supabase/supabase-js` (Edge Function calls)
- `react`, `react-dom` (frontend)
- `vite` (build tool)
- TypeScript, ESLint, Prettier (development)

**Total Bundle Impact**:
- Client-side: Minimal (Gemini SDK used in Edge Functions)
- Edge Functions: +150KB for Gemini SDK, +200KB for Readability/jsdom
- Acceptable given functionality gained

---

## Deployment Considerations

**Edge Functions**:
- Create new Edge Functions or extend existing ones?
  - **Decision**: Extend existing `brave-search` and `exa-search` Edge Functions
  - Add result count parameter (20-50 instead of 5)
  - Keep backward compatibility

- Create new Edge Functions for new stages:
  - `filter-research-results` (Gemini relevance filtering)
  - `fetch-article-content` (web scraping)
  - `analyze-category-content` (Gemini analysis)

**Frontend Changes**:
- Update `researchService.ts` to orchestrate 5 stages
- Add progress feedback UI
- Update cache version (v4 → v5)
- Handle new error types (partial failures)

**Monitoring**:
- Log stage completion times
- Track failure rates per stage
- Monitor Gemini API usage (cost tracking)
- Alert on high failure rates

---

## Open Questions

None - all technical decisions resolved through research.

---

## Next Steps

1. Generate data-model.md with entity schemas
2. Create API contracts for new Edge Functions
3. Update implementation plan (plan.md)
4. Generate task breakdown (tasks.md via `/speckit.tasks`)
5. Begin implementation (Phase 1: MVP - relevance filtering only)
