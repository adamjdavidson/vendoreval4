# Tasks: Multi-Stage AI Research Pipeline

**Input**: Design documents from `/specs/005-ai-research-pipeline/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification. Manual testing will be performed per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [ ] T001 Install @google/generative-ai dependency in supabase/functions/ via deno.json
- [ ] T002 [P] Install @mozilla/readability, jsdom, cheerio dependencies for Edge Functions
- [ ] T003 [P] Configure GEMINI_API_KEY secret in Supabase Edge Function environment
- [ ] T004 [P] Create shared/types/research.ts for TypeScript interfaces (SearchResult, FilteredResult, ArticleContent, CategoryInsight)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Update supabase/functions/brave-search/index.ts to accept resultCount parameter (default 20, max 50, backward compatible with 5)
- [ ] T006 [P] Update supabase/functions/exa-search/index.ts to accept resultCount parameter (default 20, max 50, backward compatible with 5)
- [ ] T007 [P] Bump cache version in apps/evaluation-tool/src/utils/cacheManager.ts from v4 to v5
- [ ] T008 [P] Create apps/evaluation-tool/src/types/research.ts importing shared interfaces

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Relevant Research Results (Priority: P1) 🎯 MVP

**Goal**: Achieve 90% relevance for vendors with common names by implementing AI-powered filtering (Stage 2)

**Independent Test**: Generate report for "Jasper" and verify research sources are about Jasper.ai (AI writing tool) not Jasper Reports/Apache Jasper

### Implementation for User Story 1

**Stage 1: Update Broad Search**

- [ ] T009 [US1] Update apps/evaluation-tool/src/services/researchService.ts broadSearch() to request 20-50 results per category (6 × 2 APIs = 12 parallel calls)
- [ ] T010 [US1] Add progress callback to researchService.ts for "Searching..." state

**Stage 2: AI Relevance Filtering (NEW - Core of US1)**

- [ ] T011 [P] [US1] Create supabase/functions/filter-research-results/deno.json with @google/generative-ai dependency
- [ ] T012 [US1] Create supabase/functions/filter-research-results/index.ts implementing Gemini Flash API integration
- [ ] T013 [US1] Build Gemini prompt in filter-research-results/index.ts including vendor name, user evaluation context, and 240-300 search results
- [ ] T014 [US1] Implement response parsing in filter-research-results/index.ts to extract FilteredResult[] with relevance scores
- [ ] T015 [US1] Add exponential backoff retry logic for Gemini API failures in filter-research-results/index.ts
- [ ] T016 [US1] Create filterResearchResults() function in apps/evaluation-tool/src/services/researchService.ts calling new Edge Function
- [ ] T017 [US1] Add progress callback to researchService.ts for "Filtering..." state
- [ ] T018 [US1] Update cache format in apps/evaluation-tool/src/utils/cacheManager.ts to include filter metadata (relevance score, reasoning)

**Stage 5: Update Report Generation**

- [ ] T019 [US1] Update apps/evaluation-tool/src/services/researchService.ts to chain Stage 1 → Stage 2 (search → filter)
- [ ] T020 [US1] Update report generation in researchService.ts to pass filtered results to generate-report-content Edge Function

**Checkpoint**: At this point, User Story 1 should be fully functional - reports show 90% relevant research for common vendor names

---

## Phase 4: User Story 2 - Comprehensive Research Coverage (Priority: P2)

**Goal**: Provide 30-50 relevant articles (vs current 5) for broader insights

**Independent Test**: Generate reports for same vendor with old system vs. new system and compare breadth of sources cited

### Implementation for User Story 2

**This story builds on US1's filtering to ensure 30-50 articles make it through**

- [ ] T021 [US2] Verify filter-research-results Edge Function returns 30-50 results when available (tune relevance threshold if needed)
- [ ] T022 [US2] Add result count metadata to research findings in apps/evaluation-tool/src/services/researchService.ts
- [ ] T023 [US2] Update report generation to display source count ("Research based on 42 relevant articles")
- [ ] T024 [US2] Add source diversity check in researchService.ts (warn if all results from single domain)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - reports show 90% relevance AND 30-50 comprehensive sources

---

## Phase 5: User Story 3 - Deep Content Analysis (Priority: P2)

**Goal**: Analyze full article content (not just titles/snippets) for nuanced insights

**Independent Test**: Compare insights from title-only vs. full-content analysis - full content reveals details not in titles

### Implementation for User Story 3

**Stage 3: Full Content Fetching (NEW)**

- [ ] T025 [P] [US3] Create supabase/functions/fetch-article-content/deno.json with @mozilla/readability, jsdom, cheerio dependencies
- [ ] T026 [P] [US3] Create supabase/functions/fetch-article-content/extractors.ts with extractWithReadability() function
- [ ] T027 [P] [US3] Add extractWithCheerio() fallback function in extractors.ts for structured content
- [ ] T028 [P] [US3] Add chooseBestExtraction() function in extractors.ts to select best extraction result
- [ ] T029 [US3] Create supabase/functions/fetch-article-content/index.ts implementing batch fetching (5-10 URLs at a time)
- [ ] T030 [US3] Implement HTML fetching with native fetch in fetch-article-content/index.ts
- [ ] T031 [US3] Integrate Readability extraction in fetch-article-content/index.ts calling extractors.ts functions
- [ ] T032 [US3] Add error handling for paywalls (403), 404s, timeouts in fetch-article-content/index.ts
- [ ] T033 [US3] Implement jsdom memory cleanup (window.close()) in extractors.ts after each parse
- [ ] T034 [US3] Create fetchArticleContent() function in apps/evaluation-tool/src/services/researchService.ts calling new Edge Function
- [ ] T035 [US3] Add progress callback to researchService.ts for "Fetching N articles..." state
- [ ] T036 [US3] Update cache in apps/evaluation-tool/src/utils/cacheManager.ts to store full textContent and wordCount
- [ ] T037 [US3] Update researchService.ts to chain Stage 1 → Stage 2 → Stage 3 (search → filter → fetch)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 work - reports have relevant sources with full content extracted

---

## Phase 6: User Story 4 - Category-Specific Insights (Priority: P3)

**Goal**: Synthesize research findings per evaluation category with connections to user's specific answers

**Independent Test**: Review category analysis to verify it references both user answers AND research findings

### Implementation for User Story 4

**Stage 4: AI Content Analysis (NEW)**

- [ ] T038 [P] [US4] Create supabase/functions/analyze-category-content/deno.json with @google/generative-ai dependency
- [ ] T039 [P] [US4] Create supabase/functions/analyze-category-content/prompts.ts with category-specific prompt templates
- [ ] T040 [US4] Add prompt templates for all 6 categories (See, Change, Use, Adapt, Leave, Learn) in prompts.ts
- [ ] T041 [US4] Include citation instructions in prompts.ts (quote specific passages from articles)
- [ ] T042 [US4] Include confidence level format in prompts.ts (high/medium/low with reasoning)
- [ ] T043 [US4] Create supabase/functions/analyze-category-content/index.ts implementing Gemini Flash API integration
- [ ] T044 [US4] Build Gemini prompt in analyze-category-content/index.ts with category questions, user answers, and full article content
- [ ] T045 [US4] Implement response parsing in analyze-category-content/index.ts to extract CategoryInsight with findings and citations
- [ ] T046 [US4] Add contradiction detection in analyze-category-content/index.ts (flag when research conflicts with user answers)
- [ ] T047 [US4] Create analyzeCategoryContent() function in apps/evaluation-tool/src/services/researchService.ts calling new Edge Function
- [ ] T048 [US4] Implement 6 parallel Gemini calls in researchService.ts (one per category using Promise.all)
- [ ] T049 [US4] Add progress callbacks to researchService.ts for "Analyzing [category name]..." state
- [ ] T050 [US4] Update researchService.ts to chain Stage 1 → Stage 2 → Stage 3 → Stage 4 (search → filter → fetch → analyze)

**Stage 5: Report Synthesis Integration**

- [ ] T051 [US4] Update supabase/functions/generate-report-content/index.ts to accept categoryInsights parameter
- [ ] T052 [US4] Integrate Gemini category insights into Claude prompt in generate-report-content/index.ts
- [ ] T053 [US4] Preserve dual voice mode (no-bs / corporate) in generate-report-content/index.ts
- [ ] T054 [US4] Update final report format in generate-report-content/index.ts to include category analyses with citations
- [ ] T055 [US4] Update researchService.ts to complete 5-stage pipeline (search → filter → fetch → analyze → synthesize)

**Checkpoint**: All user stories now complete - reports show relevant, comprehensive, deep, category-specific insights

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, UI polish, and improvements affecting multiple user stories

**Error Handling & Progressive Degradation**

- [ ] T056 [P] Implement error handling in researchService.ts for complete research failure (fall back to Quick Report)
- [ ] T057 [P] Implement partial research handling in researchService.ts (generate report with available insights)
- [ ] T058 [P] Add timeout handling (3 minute max) in researchService.ts
- [ ] T059 Add retry logic with exponential backoff for all API calls in researchService.ts

**UI Components**

- [ ] T060 [P] Create apps/evaluation-tool/src/components/ReportProgress.tsx showing current stage and progress
- [ ] T061 [P] Create apps/evaluation-tool/src/components/ReportError.tsx with user-friendly error messages
- [ ] T062 Update ReportProgress.tsx to show stage names ("Searching... Filtering... Fetching... Analyzing...")
- [ ] T063 Update ReportProgress.tsx to show counts ("Filtered 243 results to 42 relevant articles")
- [ ] T064 Update ReportProgress.tsx to show percentage ("Analyzing 3 of 6 categories...")
- [ ] T065 Make ReportProgress.tsx mobile-responsive (works on 320px screens)
- [ ] T066 Update ReportError.tsx with actionable next steps ("Try again", "Generate Quick Report instead")
- [ ] T067 Update ReportError.tsx to show partial results when available

**Report Metadata**

- [ ] T068 [P] Add researchMetadata fields to Report interface in apps/evaluation-tool/src/types/report.ts
- [ ] T069 Add qualityIndicators fields to Report interface (relevance score, coverage metrics)
- [ ] T070 Display research metadata in report header (articles analyzed, sources, generation time)

**Performance Optimization**

- [ ] T071 [P] Verify parallel execution in researchService.ts (Stage 1: 12 calls, Stage 4: 6 calls)
- [ ] T072 Add request deduplication in researchService.ts (same URL not fetched multiple times)
- [ ] T073 Optimize Gemini prompts to reduce token count where possible
- [ ] T074 Measure total latency and verify <85 seconds target

**Documentation**

- [ ] T075 [P] Update DEPLOYMENT_STATUS.md with new Edge Functions (filter, fetch, analyze)
- [ ] T076 [P] Update README.md with new research pipeline features
- [ ] T077 Document GEMINI_API_KEY configuration in DEPLOYMENT_STATUS.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 (builds on filtering to ensure volume)
- **User Story 3 (Phase 5)**: Depends on User Story 2 (needs filtered results to fetch)
- **User Story 4 (Phase 6)**: Depends on User Story 3 (needs full content to analyze)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

**Sequential Implementation Required**:

- **User Story 1 (P1)**: Foundation - Relevance filtering (Stage 2)
- **User Story 2 (P2)**: Requires US1 - Ensures 30-50 filtered results
- **User Story 3 (P2)**: Requires US2 - Fetches full content (Stage 3)
- **User Story 4 (P3)**: Requires US3 - Analyzes full content (Stage 4)

**Why Sequential**: Each stage of the 5-stage pipeline (Search → Filter → Fetch → Analyze → Synthesize) depends on the previous stage's output. Pipeline must be built incrementally.

### Within Each User Story

- Foundational tasks before implementation
- Edge Function dependencies (deno.json) before Edge Function implementation
- Edge Functions before frontend integration
- Frontend integration before progress callbacks
- Core implementation before error handling

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002, T003, T004 can run in parallel

**Phase 2 (Foundational)**:
- T006, T007, T008 can run in parallel after T005

**Phase 3 (User Story 1)**:
- T011, T012 can start in parallel (different files)

**Phase 5 (User Story 3)**:
- T025, T026, T027, T028 can run in parallel (different functions in extractors.ts)

**Phase 6 (User Story 4)**:
- T038, T039 can start in parallel (different files)
- T048 implements 6 parallel Gemini calls at runtime

**Phase 7 (Polish)**:
- T056, T057, T058 can run in parallel (different error types)
- T060, T061 can run in parallel (different components)
- T068, T069 can run in parallel (different types)
- T071, T072, T073 can run in parallel (different optimizations)
- T075, T076, T077 can run in parallel (different docs)

---

## Parallel Example: User Story 1

```bash
# Launch Edge Function setup together:
Task: "Create deno.json with @google/generative-ai dependency"
Task: "Create index.ts implementing Gemini Flash API integration"

# These run sequentially but independently of other work:
1. Implement filtering Edge Function (T011-T015)
2. Integrate into frontend (T016-T018)
3. Update report generation (T019-T020)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (AI filtering for relevance)
4. **STOP and VALIDATE**: Test with "Jasper", "Atlas", "Compass" - verify 90% relevance
5. Deploy/demo if ready

**Deliverable**: Users get highly relevant research results for vendors with common names

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Search APIs updated, cache version bumped
2. **+ User Story 1** (Phase 3) → 90% relevance via AI filtering → **Deploy/Demo MVP!**
3. **+ User Story 2** (Phase 4) → 30-50 comprehensive sources → Deploy/Demo
4. **+ User Story 3** (Phase 5) → Full content analysis → Deploy/Demo
5. **+ User Story 4** (Phase 6) → Category-specific insights → Deploy/Demo
6. **+ Polish** (Phase 7) → Error handling, UI polish, performance → Final Release

Each phase adds measurable value:
- US1: Quality (relevance)
- US2: Quantity (volume)
- US3: Depth (full content)
- US4: Intelligence (synthesis)

### Parallel Team Strategy

**Not Recommended for This Feature** - User stories have sequential dependencies due to 5-stage pipeline architecture. Each stage requires the previous stage's output.

**Single-developer sequential approach recommended**:
1. Build Stage 1 (existing search - just parameter updates)
2. Build Stage 2 (filtering) → MVP
3. Build Stage 3 (fetching)
4. Build Stage 4 (analysis)
5. Integrate Stage 5 (synthesis)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- User stories are NOT independently implementable due to pipeline dependencies
- Each phase should be tested before proceeding to next
- Commit after each task or logical group
- Stop at each checkpoint to validate stage functionality
- Tests are manual per quickstart.md (not automated in task list)
- Follow TypeScript strict mode and constitution requirements
- Estimated total time: 12-17 days (per plan.md Phase estimates)

---

## Task Summary

- **Total Tasks**: 77
- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 4 tasks
- **Phase 3 (US1 - Relevance)**: 12 tasks
- **Phase 4 (US2 - Volume)**: 4 tasks
- **Phase 5 (US3 - Depth)**: 13 tasks
- **Phase 6 (US4 - Intelligence)**: 18 tasks
- **Phase 7 (Polish)**: 22 tasks

**Parallel Opportunities**: 28 tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phases 1-3 (20 tasks) delivers User Story 1 - AI-powered relevance filtering

**Independent Test Criteria**:
- US1: Generate "Jasper" report → verify 90% relevance
- US2: Count sources in report → verify 30-50 articles
- US3: Review citations → verify quotes from article content (not just titles)
- US4: Read category analyses → verify connections to user answers and research

**Format Validation**: ✅ All tasks follow checklist format with ID, optional [P], optional [Story], description, and file path
