# Implementation Plan: Multi-Stage AI Research Pipeline

**Branch**: `005-ai-research-pipeline` | **Date**: 2025-10-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-ai-research-pipeline/spec.md`

---

## Summary

This plan implements a multi-stage AI-powered research pipeline to solve irrelevant search results in vendor evaluation reports. Current system returns ~10-20% relevance for common vendor names (e.g., "jasper" returns Jasper Reports, Apache Jasper instead of Jasper.ai).

**Solution**: 5-stage pipeline (Search → Filter → Fetch → Analyze → Synthesize) using Gemini Flash 2.0 for AI-powered filtering and content analysis.

**Target**: 90% relevance with 30-50 comprehensive articles per report in <3 minutes.

---

## Technical Context

**Language/Version**: TypeScript with Node.js 18+ (native fetch), Deno (Edge Functions)

**Primary Dependencies**:
- Frontend: React 19, Vite 7, @supabase/supabase-js
- Edge Functions: @google/generative-ai, @mozilla/readability, jsdom, cheerio

**Storage**: Supabase PostgreSQL + LocalStorage (client-side caching)

**Testing**: Vitest for unit/component tests, manual testing for integration

**Target Platform**: Web (desktop + mobile browsers)

**Project Type**: Web application (React frontend + Supabase Edge Functions backend)

**Performance Goals**: <3 minutes total generation time, 90% relevance improvement

**Constraints**:
- Mobile-first responsive design (320px-1920px)
- WCAG 2.1 AA accessibility compliance
- No data leaves browser except API calls for research
- 70% test coverage for business logic

**Scale/Scope**:
- Process 240-300 search results per report
- Fetch/analyze 30-50 articles with full content
- Support 6 evaluation categories
- 5 new Edge Functions + 3 updated services

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Article I: Code Quality Standards ✅

- All code uses TypeScript strict mode
- No `any` types (except `@google/generative-ai` SDK internals)
- Explicit type signatures for all exported functions
- Interfaces for all entity types (SearchResult, FilteredResult, ArticleContent, CategoryInsight)
- Maximum file length: 300 lines per Edge Function

### Article II: Testing Standards ✅

- Unit tests for content extraction logic (Readability, Cheerio fallbacks)
- Unit tests for result filtering algorithms
- Integration tests for 5-stage pipeline with mock APIs
- Manual testing with real vendors (Jasper, Atlas, Compass)
- Target 70% coverage for business logic

### Article III: User Experience Standards ✅

- Progress indicators for each stage ("Searching...", "Filtering...", "Analyzing...")
- Mobile-first design (progress updates work on 320px screens)
- Error messages user-friendly ("Unable to complete research" not "Gemini API timeout")
- Loading indicators for operations >200ms (all stages)

### Article IV: Performance Requirements ✅

- Total latency target: 42-85 seconds (well under 3-minute requirement)
- Bundle impact: Minimal (all processing in Edge Functions)
- Parallel execution wherever possible (Stage 1: 12 parallel calls, Stage 4: 6 parallel calls)

### Article V: Security and Privacy Standards ✅

- API keys stored in Supabase Edge Function secrets (not frontend)
- Vendor name sent to APIs (necessary for research)
- User answers sent to Gemini (necessary for relevance filtering)
- No tracking or analytics
- Results cached locally (localStorage)
- HTML sanitization during extraction (XSS prevention)

### Article VI: Dependency Management ✅

New dependencies evaluated and approved:

| Dependency | Weekly Downloads | Last Updated | License | Bundle Impact | Approved |
|------------|------------------|--------------|---------|---------------|----------|
| @google/generative-ai | 100k+ | Within 1 month | Apache 2.0 | +150KB (Edge) | ✅ |
| @mozilla/readability | 50k+ | Within 6 months | Apache 2.0 | +100KB (Edge) | ✅ |
| jsdom | 10M+ | Within 1 month | MIT | +100KB (Edge) | ✅ |
| cheerio | 10M+ | Within 1 month | MIT | +50KB (Edge) | ✅ |

**Total Edge Function impact**: +400KB (acceptable for functionality gained)

### Article VII: Error Handling and Logging ✅

- All errors caught and handled gracefully
- Progressive degradation: Extended → Partial → Quick Report
- Production: Error logs only (no console.log)
- Never log: User evaluation data, vendor names (privacy)
- React ErrorBoundary wraps all routes (existing)

---

## Project Structure

### Documentation (this feature)

```
specs/005-ai-research-pipeline/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file (complete)
├── research.md          # Technology research and decisions (complete)
├── data-model.md        # Entity schemas and TypeScript interfaces (complete)
├── quickstart.md        # Developer setup guide (complete)
├── checklists/
│   └── requirements.md  # Requirements validation checklist (complete)
└── contracts/
    ├── filter-research-results.json     # OpenAPI spec (complete)
    ├── fetch-article-content.json       # OpenAPI spec (complete)
    └── analyze-category-content.json    # OpenAPI spec (complete)
```

### Source Code (repository root)

```
apps/evaluation-tool/
├── src/
│   ├── components/
│   │   ├── ReportProgress.tsx          # NEW: Progress UI for each stage
│   │   └── ReportError.tsx             # NEW: Error handling UI
│   ├── services/
│   │   ├── researchService.ts          # UPDATED: 5-stage pipeline orchestration
│   │   └── researchService.test.ts     # NEW: Unit + integration tests
│   ├── types/
│   │   └── research.ts                 # NEW: TypeScript interfaces
│   └── utils/
│       └── cacheManager.ts             # UPDATED: Cache version v4 → v5

supabase/functions/
├── brave-search/
│   └── index.ts                        # UPDATED: resultCount parameter (5 → 20-50)
├── exa-search/
│   └── index.ts                        # UPDATED: resultCount parameter (5 → 20-50)
├── filter-research-results/            # NEW: Stage 2
│   ├── index.ts                        # Gemini filtering logic
│   └── deno.json                       # @google/generative-ai dependency
├── fetch-article-content/              # NEW: Stage 3
│   ├── index.ts                        # Web scraping + Readability
│   ├── extractors.ts                   # Content extraction utilities
│   ├── extractors.test.ts              # Extraction tests
│   └── deno.json                       # jsdom, readability, cheerio deps
├── analyze-category-content/           # NEW: Stage 4
│   ├── index.ts                        # Gemini content analysis
│   ├── prompts.ts                      # Category-specific prompts
│   ├── index.test.ts                   # Analysis tests
│   └── deno.json                       # @google/generative-ai dependency
└── generate-report-content/
    └── index.ts                        # UPDATED: accept categoryInsights parameter

shared/types/
└── research.ts                         # NEW: Shared TypeScript interfaces
```

**Structure Decision**: Web application with React frontend (apps/evaluation-tool) and Supabase Edge Functions backend. Follows existing monorepo structure with apps/ and shared/ directories.

---

## Complexity Tracking

*No constitutional violations requiring justification. All decisions align with existing principles.*

---

## Implementation Phases

### Phase 0: Prerequisites ✅ COMPLETE

**Artifacts Created**:
- ✅ Constitution validated (`.specify/memory/constitution.md`)
- ✅ Specification complete ([spec.md](./spec.md))
- ✅ Requirements checklist ([checklists/requirements.md](./checklists/requirements.md))
- ✅ Technology research ([research.md](./research.md))
- ✅ Data model ([data-model.md](./data-model.md))
- ✅ API contracts (3 OpenAPI specs in [contracts/](./contracts/))
- ✅ Quickstart guide ([quickstart.md](./quickstart.md))
- ✅ Implementation plan (this file)

**Decision Summary**:
- Use Gemini Flash 2.0 for filtering and analysis (large context, cost-effective)
- Use Mozilla Readability for content extraction (battle-tested)
- 5-stage pipeline architecture (clear separation of concerns)
- Cache version bump: v4 → v5 (invalidate old data)

---

### Phase 1: Foundation (User Story 1 - P1)

**Goal**: Implement AI relevance filtering to achieve 90% relevance for common vendor names.

**Tasks**:

1. **Update existing search Edge Functions** (Stage 1)
   - File: `supabase/functions/brave-search/index.ts`
   - File: `supabase/functions/exa-search/index.ts`
   - Add `resultCount` parameter (default 20, max 50)
   - Keep backward compatibility (default 5 if not specified)
   - Update return type to match SearchResult interface
   - Test: Verify 20-50 results returned per call

2. **Create filter-research-results Edge Function** (Stage 2)
   - File: `supabase/functions/filter-research-results/index.ts`
   - Install `@google/generative-ai` dependency
   - Implement Gemini Flash API integration
   - Build prompt: vendor name + user context + search results
   - Parse Gemini response to FilteredResult[]
   - Add retry logic with exponential backoff
   - Test: Mock Gemini response, verify filtering logic

3. **Update frontend researchService** (Stage 1+2 integration)
   - File: `apps/evaluation-tool/src/services/researchService.ts`
   - Update `broadSearch()` to request 20-50 results per category
   - Add `filterResearchResults()` function calling new Edge Function
   - Combine Stage 1 → Stage 2 flow
   - Add progress callbacks: "Searching...", "Filtering..."
   - Test: End-to-end with real vendor (Jasper)

4. **Update cache version**
   - File: `apps/evaluation-tool/src/utils/cacheManager.ts`
   - Bump CACHE_VERSION: 'v4' → 'v5'
   - Update cache key format to include filter metadata
   - Test: Verify old cache invalidated, new cache works

5. **Write tests for Phase 1**
   - File: `apps/evaluation-tool/src/services/researchService.test.ts`
   - Mock Brave/Exa APIs returning 240-300 results
   - Mock Gemini returning 30-50 filtered results
   - Verify relevance calculation
   - Test error handling (API failures)

**Validation Checkpoint**:
- ✅ Search returns 240-300 results total
- ✅ Filter returns 30-50 relevant results
- ✅ 90% relevance for "Jasper" test case
- ✅ Cache version bumped successfully
- ✅ Tests pass with 70%+ coverage

**Estimated Time**: 2-3 days

---

### Phase 2: Content Extraction (User Story 2 - P2)

**Goal**: Fetch full article content to enable comprehensive analysis.

**Tasks**:

1. **Create fetch-article-content Edge Function** (Stage 3)
   - File: `supabase/functions/fetch-article-content/index.ts`
   - Install `@mozilla/readability`, `jsdom`, `cheerio` dependencies
   - Implement batch fetching (5-10 URLs at a time)
   - Primary: Mozilla Readability for content extraction
   - Fallback: Cheerio for structured sites
   - Handle errors: paywalls (403), 404s, timeouts
   - Call `window.close()` after each jsdom parse (memory management)
   - Test: Mock HTML → verify clean text extraction

2. **Add content extraction utilities**
   - File: `supabase/functions/fetch-article-content/extractors.ts`
   - Function: `extractWithReadability(html, url): ArticleContent`
   - Function: `extractWithCheerio(html): ArticleContent`
   - Function: `chooseBestExtraction(results): ArticleContent`
   - Test: Various HTML formats (article, blog, docs, forum)

3. **Integrate Stage 3 into frontend**
   - File: `apps/evaluation-tool/src/services/researchService.ts`
   - Add `fetchArticleContent()` function
   - Chain Stage 2 → Stage 3 (filtered URLs → full content)
   - Add progress callback: "Fetching 42 articles..."
   - Handle partial failures (some articles fail to fetch)
   - Test: End-to-end with 30-50 real URLs

4. **Update cache to store full content**
   - File: `apps/evaluation-tool/src/utils/cacheManager.ts`
   - Add `textContent` field to cached results
   - Add `wordCount` for validation
   - Test: Verify articles cached with full text

5. **Write tests for Phase 2**
   - File: `supabase/functions/fetch-article-content/extractors.test.ts`
   - Test Readability with various article formats
   - Test Cheerio fallback for structured content
   - Test error handling (404, timeout, paywall)
   - Test memory cleanup (jsdom window.close)

**Validation Checkpoint**:
- ✅ 30-50 articles fetched successfully
- ✅ Average word count >500 per article
- ✅ <10% fetch failures (paywalls, 404s)
- ✅ Memory usage stays under 512MB
- ✅ Tests pass with 70%+ coverage

**Estimated Time**: 2-3 days

---

### Phase 3: Content Analysis (User Story 3 - P2)

**Goal**: Use Gemini to analyze full article content for category-specific insights.

**Tasks**:

1. **Create analyze-category-content Edge Function** (Stage 4)
   - File: `supabase/functions/analyze-category-content/index.ts`
   - Build Gemini prompt with:
     - Category name and questions
     - User's answers for context
     - Full article content (not just titles)
   - Parse Gemini response to CategoryInsight
   - Extract citations (quotes from articles)
   - Identify contradictions with user answers
   - Test: Mock Gemini response, verify insight structure

2. **Add prompt templates**
   - File: `supabase/functions/analyze-category-content/prompts.ts`
   - Template for each category (see, change, use, adapt, leave, learn)
   - Include instructions for citations
   - Include format for confidence levels
   - Test: Verify templates render correctly

3. **Integrate Stage 4 into frontend**
   - File: `apps/evaluation-tool/src/services/researchService.ts`
   - Add `analyzeCategoryContent()` function
   - Run 6 parallel Gemini calls (one per category)
   - Chain Stage 3 → Stage 4 (full content → insights)
   - Add progress callback: "Analyzing Transparency & Observability..."
   - Test: End-to-end with real articles

4. **Update report generation to use insights**
   - File: `supabase/functions/generate-report-content/index.ts`
   - Accept `categoryInsights` parameter
   - Integrate Gemini findings into Claude prompt
   - Preserve dual voice mode (no-bs / corporate)
   - Test: Verify insights appear in final report

5. **Write tests for Phase 3**
   - File: `supabase/functions/analyze-category-content/index.test.ts`
   - Mock Gemini API responses
   - Test prompt template rendering
   - Test citation extraction
   - Test contradiction detection
   - Test parallel execution (6 categories)

**Validation Checkpoint**:
- ✅ 6 category insights generated successfully
- ✅ Each insight cites 3-5 sources with quotes
- ✅ Contradictions detected when present
- ✅ Insights reference full content (not just titles)
- ✅ Tests pass with 70%+ coverage

**Estimated Time**: 3-4 days

---

### Phase 4: Integration & Polish (User Story 4 - P3)

**Goal**: Complete end-to-end pipeline with error handling and UI polish.

**Tasks**:

1. **Complete 5-stage pipeline integration**
   - File: `apps/evaluation-tool/src/services/researchService.ts`
   - Wire all stages: Search → Filter → Fetch → Analyze → Synthesize
   - Implement progressive degradation:
     - Success: Extended Report with full research
     - Partial: Extended Report with available research
     - Failure: Quick Report (answers only)
   - Add timeout handling (3 minute max)
   - Test: Full pipeline with real vendor

2. **Add progress UI**
   - File: `apps/evaluation-tool/src/components/ReportProgress.tsx`
   - Show current stage: "Searching... Filtering... Fetching... Analyzing..."
   - Show counts: "Filtered 243 results to 42 relevant articles"
   - Show percentage: "Analyzing 3 of 6 categories..."
   - Mobile-responsive progress bar
   - Test: Visual testing on Chrome, Firefox, Safari (desktop + mobile)

3. **Implement error handling UI**
   - File: `apps/evaluation-tool/src/components/ReportError.tsx`
   - User-friendly error messages
   - Actionable next steps: "Try again", "Generate Quick Report instead"
   - Show partial results when available
   - Test: Trigger various error scenarios (API timeout, rate limit, etc.)

4. **Add report metadata**
   - File: `apps/evaluation-tool/src/types/report.ts`
   - Add fields to Report interface:
     - `researchMetadata`: articles analyzed, sources, generation time
     - `qualityIndicators`: relevance score, coverage metrics
   - Display in report header
   - Test: Verify metadata accurate

5. **Performance optimization**
   - File: `apps/evaluation-tool/src/services/researchService.ts`
   - Verify parallel execution (Stage 1: 12 calls, Stage 4: 6 calls)
   - Add request deduplication (same URL fetched multiple times)
   - Optimize Gemini prompts (reduce token count where possible)
   - Test: Measure total latency (target <85 seconds)

6. **Write integration tests**
   - File: `apps/evaluation-tool/src/services/researchService.integration.test.ts`
   - Test full pipeline end-to-end with mock APIs
   - Test progressive degradation scenarios
   - Test cache hit/miss behavior
   - Test concurrent report generation

**Validation Checkpoint**:
- ✅ Full pipeline completes in <3 minutes
- ✅ Progress UI updates for all stages
- ✅ Error handling graceful (no crashes)
- ✅ Partial results shown when available
- ✅ Tests pass with 70%+ coverage

**Estimated Time**: 3-4 days

---

### Phase 5: Testing & Deployment

**Goal**: Comprehensive testing and production deployment.

**Tasks**:

1. **Manual testing with real vendors**
   - Test common names with collision potential:
     - Jasper (AI writing vs. Jasper Reports)
     - Atlas (MongoDB vs. 100 other projects)
     - Compass (MongoDB vs. navigation tools)
   - Verify 90% relevance improvement
   - Verify 30-50 articles with full content
   - Test on multiple browsers (Chrome, Firefox, Safari)
   - Test on mobile devices (iOS, Android)

2. **Performance testing**
   - Measure latency for each stage
   - Monitor memory usage during content fetching
   - Test with maximum load (50 articles, 6 categories)
   - Verify no memory leaks (jsdom cleanup)

3. **API key configuration**
   - Set GEMINI_API_KEY in Supabase secrets
   - Verify all API keys configured correctly
   - Test rate limiting behavior
   - Document key management in DEPLOYMENT_STATUS.md

4. **Deploy Edge Functions**
   - Deploy `filter-research-results` Edge Function
   - Deploy `fetch-article-content` Edge Function
   - Deploy `analyze-category-content` Edge Function
   - Update `generate-report-content` Edge Function
   - Verify all functions deployed successfully

5. **Deploy frontend**
   - Update researchService with 5-stage pipeline
   - Bump cache version to v5
   - Deploy to Vercel
   - Verify production build works
   - Test on production domain

6. **Documentation updates**
   - Update DEPLOYMENT_STATUS.md with new Edge Functions
   - Update README.md with new features
   - Create user-facing documentation (if needed)
   - Update API documentation with new endpoints

**Validation Checkpoint**:
- ✅ All manual tests pass
- ✅ Performance targets met (<3 minutes)
- ✅ All Edge Functions deployed
- ✅ Frontend deployed to production
- ✅ Documentation updated

**Estimated Time**: 2-3 days

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|---------|-----------|
| Gemini API rate limits | Medium | High | Exponential backoff retry, queue requests |
| jsdom memory leaks | Medium | Medium | Always call window.close(), batch processing |
| Paywalled content | High | Low | Skip gracefully, note in report |
| Readability fails | Medium | Low | Fallback to Cheerio, then basic extraction |
| API costs exceed budget | Low | Low | Monitor usage, set spending alerts |
| Generation timeout (>3 min) | Low | Medium | Optimize parallel execution, reduce batch sizes |

### User Experience Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|---------|-----------|
| Progress UI unclear | Medium | Low | User testing, iterate on messaging |
| Errors not actionable | Low | Medium | User-friendly messages with next steps |
| Mobile experience poor | Low | Medium | Responsive design, mobile testing |
| Cache confusion | Low | Low | Clear cache version messaging |

---

## Success Metrics

### Quantitative Metrics

- **Relevance Improvement**: 10-20% → 90% for common vendor names
- **Article Quantity**: 5 → 30-50 articles per report
- **Content Depth**: Titles only → Full article text analysis
- **Generation Time**: <3 minutes (target: 42-85 seconds)
- **Test Coverage**: ≥70% for business logic
- **Cache Hit Rate**: ≥60% for repeat vendors (7-day TTL)

### Qualitative Metrics

- User reports improved research quality
- Fewer complaints about irrelevant results
- More actionable insights in reports
- Positive feedback on progress visibility

---

## Next Steps

1. Run `/speckit.tasks` to generate task breakdown
2. Begin implementation with User Story 1 (P1 - Relevant Research Results)
3. Follow TDD approach: write tests first, then implementation
4. Test each stage independently before integration

---

**Status**: ✅ PLANNING COMPLETE - Ready for `/speckit.tasks`

**Last Updated**: 2025-10-26
**Author**: Claude (Spec-Driven Development workflow)
