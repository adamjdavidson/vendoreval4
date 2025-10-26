# Tasks: Analytical Report Format for Vendor Evaluations

**Input**: Design documents from `/specs/004-analytical-report-format/`
**Prerequisites**: ✅ plan.md, ✅ spec.md, ✅ research.md, ✅ data-model.md, ✅ contracts/, ✅ quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are omitted per SpecKit guidelines.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Monorepo**: `apps/evaluation-tool/src/`, `shared/types/`, `supabase/functions/`
- Paths follow existing project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and type definitions that all user stories depend on

- [ ] T001 Update shared/types/report.ts to add GeneratedReport fields: completionStatus, reportMode, headline, cons, pros, extended
- [ ] T002 [P] Update shared/types/report.ts to add ResearchFinding fields: sourceType, sourceAge, ageMonths, isFoundational, url, title, publishedDate, domainAuthority
- [ ] T003 [P] Create ReportGenerationRequest interface in shared/types/report.ts: add reportMode, notes, includeResearch fields
- [ ] T004 [P] Create ReportProgressUpdate interface in shared/types/report.ts with phase, currentCategory, currentAPI, progress, estimatedTimeRemaining, canCancel, message fields
- [ ] T005 [P] Install dependencies if needed: exa-py SDK or direct fetch integration packages (verify with Context7 for latest SDK)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and services that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create source quality scoring utility in apps/evaluation-tool/src/utils/sourceQuality.ts with assessSourceQuality(), isFoundational(), DOMAIN_LISTS constants
- [ ] T007 [P] Create report formatter utility extensions in apps/evaluation-tool/src/utils/reportFormatter.ts to handle new cons/pros/extended sections and markdown rendering
- [ ] T008 [P] Update apps/evaluation-tool/src/utils/reportStorage.ts to handle new GeneratedReport fields with backward compatibility check
- [ ] T009 Create progress calculation utility in apps/evaluation-tool/src/utils/progressCalculator.ts with calculateResearchProgress(), calculateSynthesisProgress(), estimateTimeRemaining() functions

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generate Executive-Ready Report with Synthesized Analysis (Priority: P1) 🎯 MVP

**Goal**: Transform category-based data into executive-friendly Cons/Pros/Extended synthesis sections without external research

**Independent Test**: Complete an evaluation with all 20 questions answered, generate a Quick Report (no research), and verify it contains: (1) a headline summary, (2) a Cons section highlighting negatives, (3) a Pros section highlighting positives, (4) an Extended section providing balanced analysis, (5) completion status header

### Implementation for User Story 1

**Backend: Synthesis Prompts**

- [ ] T010 [P] [US1] Update supabase/functions/generate-report-content/prompts/no-bs.ts to add Cons synthesis prompt with framework-aligned classification rules (See: transparency=positive, Change: customization=positive, Use: simplicity=positive, Adapt: integration=positive, Leave: portability=positive, Learn: transferable=positive)
- [ ] T011 [P] [US1] Update supabase/functions/generate-report-content/prompts/no-bs.ts to add Pros synthesis prompt with business value explanations
- [ ] T012 [P] [US1] Update supabase/functions/generate-report-content/prompts/no-bs.ts to add Extended synthesis prompt that incorporates user notes and avoids firm recommendations
- [ ] T013 [P] [US1] Update supabase/functions/generate-report-content/prompts/corporate.ts to add Cons/Pros/Extended prompts in corporate voice mode
- [ ] T014 [US1] Update supabase/functions/generate-report-content/index.ts to modify Claude API call to request headline, cons, pros, extended sections using updated prompts (depends on T010-T013)
- [ ] T015 [US1] Update supabase/functions/generate-report-content/index.ts to parse Claude response for new sections and validate markdown format

**Frontend: Report Generation UI**

- [ ] T016 [P] [US1] Update apps/evaluation-tool/src/components/report/ReportGenerator.tsx to add report mode toggle UI (Quick vs Extended) with clear descriptions
- [ ] T017 [US1] Update apps/evaluation-tool/src/services/reportService.ts to add generateQuickReport() function that calls synthesis endpoint without research (depends on T014-T015)
- [ ] T018 [US1] Update apps/evaluation-tool/src/services/reportService.ts to calculate completionStatus string ("20/20 questions answered (100%)") from evaluation answers
- [ ] T019 [US1] Update apps/evaluation-tool/src/services/reportService.ts to pass user notes to synthesis function

**Frontend: Report Display**

- [ ] T020 [P] [US1] Update apps/evaluation-tool/src/components/report/ReportPreview.tsx to add header section displaying vendorName, evaluationDate, completionStatus
- [ ] T021 [P] [US1] Update apps/evaluation-tool/src/components/report/ReportPreview.tsx to add Headline section with prominent styling
- [ ] T022 [P] [US1] Update apps/evaluation-tool/src/components/report/ReportPreview.tsx to add Cons section with markdown rendering and warning styling
- [ ] T023 [P] [US1] Update apps/evaluation-tool/src/components/report/ReportPreview.tsx to add Pros section with markdown rendering and positive styling
- [ ] T024 [P] [US1] Update apps/evaluation-tool/src/components/report/ReportPreview.tsx to add Extended section with markdown rendering and balanced neutral styling
- [ ] T025 [US1] Update apps/evaluation-tool/src/components/report/ReportPreview.tsx to move category analyses below new sections with "Supporting Detail" heading (depends on T020-T024)

**Partial Evaluations**

- [ ] T026 [US1] Update apps/evaluation-tool/src/components/report/ReportPreview.tsx to add prominent warning banner when isPartial is true indicating incomplete evaluation
- [ ] T027 [US1] Update supabase/functions/generate-report-content/index.ts to acknowledge gaps in synthesis sections when completionStatus indicates partial evaluation

**Checkpoint**: At this point, User Story 1 (Quick Report with Cons/Pros/Extended synthesis) should be fully functional and testable independently. Users can generate executive-ready reports without waiting for external research.

---

## Phase 4: User Story 2 - Include External Research for Validation (Priority: P2)

**Goal**: Augment synthesized analysis with external research from Brave Search API and Exa API to validate user assessments

**Independent Test**: Generate an Extended Report for a well-known vendor (e.g., "OpenAI"), verify the report includes research findings with proper source attribution from both Brave and Exa, and confirm these findings are integrated into the Cons/Pros analysis with citations

### Implementation for User Story 2

**Backend: Brave Search Integration**

- [ ] T028 [P] [US2] Create supabase/functions/brave-search/index.ts Edge Function with query template mapping (See: transparency, Change: customization, Use: complexity, Adapt: integration, Leave: portability, Learn: documentation)
- [ ] T029 [P] [US2] Implement searchBrave() function in supabase/functions/brave-search/index.ts using Brave Search API with authentication (X-Subscription-Token header), freshness parameter (pm for last month), count=10, text_decorations=false
- [ ] T030 [P] [US2] Add response parsing in supabase/functions/brave-search/index.ts to extract web.results[] with title, url, description, age, page_age fields
- [ ] T031 [P] [US2] Implement source quality scoring in supabase/functions/brave-search/index.ts using utility from T006 to filter results by domain authority and recency
- [ ] T032 [US2] Add retry logic in supabase/functions/brave-search/index.ts: retry once on 429 (rate limit) or 503 (service unavailable) with exponential backoff (depends on T028-T031)
- [ ] T033 [US2] Implement 7-day cache in supabase/functions/brave-search/index.ts using Supabase storage with key format vendoreval-research-{vendor}-{category}

**Backend: Exa Search Integration**

- [ ] T034 [P] [US2] Create supabase/functions/exa-search/index.ts Edge Function (or add to brave-search as dual endpoint)
- [ ] T035 [P] [US2] Implement searchExa() function in supabase/functions/exa-search/index.ts using Exa API (https://api.metaphor.systems/search) with Bearer token authentication, num_results=10, type='neural', use_autoprompt=true
- [ ] T036 [P] [US2] Add date filtering in supabase/functions/exa-search/index.ts with start_published_date set to 6 months ago, include_domains filtering for github.com, docs.*.com, reddit.com, news.ycombinator.com
- [ ] T037 [P] [US2] Implement response parsing in supabase/functions/exa-search/index.ts to extract results[] with id, url, title, published_date, author fields
- [ ] T038 [US2] Add source quality scoring in supabase/functions/exa-search/index.ts using utility from T006, calculate ageMonths from published_date (depends on T034-T037)
- [ ] T039 [US2] Implement retry logic and 7-day caching in supabase/functions/exa-search/index.ts matching Brave implementation

**Frontend: Research Service**

- [ ] T040 [US2] Create apps/evaluation-tool/src/services/researchService.ts with researchCategory() function that calls both Brave and Exa search endpoints for given vendor/category (depends on T032, T039)
- [ ] T041 [US2] Implement researchAllCategories() function in apps/evaluation-tool/src/services/researchService.ts that executes 6 queries per API (12 total) sequentially with progress callbacks
- [ ] T042 [US2] Add error recovery in apps/evaluation-tool/src/services/researchService.ts: retry failed API once, continue with partial results if one API succeeds, clear user messaging if both fail
- [ ] T043 [US2] Implement contradiction detection in apps/evaluation-tool/src/services/researchService.ts to flag when research findings contradict user answers

**Frontend: Extended Report Generation**

- [ ] T044 [US2] Update apps/evaluation-tool/src/services/reportService.ts to add generateExtendedReport() function that calls researchAllCategories() before synthesis (depends on T041-T043)
- [ ] T045 [US2] Update supabase/functions/generate-report-content/index.ts to accept researchFindings[] in request and incorporate findings into Cons/Pros sections with source citations
- [ ] T046 [US2] Update supabase/functions/generate-report-content/index.ts Extended section prompt to present contradictions when research contradicts user answers with clear attribution

**Frontend: Research Findings Display**

- [ ] T047 [P] [US2] Update apps/evaluation-tool/src/components/report/ReportPreview.tsx to add Research Findings section at bottom of report showing all sources with URLs, titles, dates, and domain authority indicators
- [ ] T048 [P] [US2] Add age warnings in apps/evaluation-tool/src/components/report/ReportPreview.tsx for research findings >6 months old ("Source is 8 months old") and foundational indicators for >12 months
- [ ] T049 [US2] Update apps/evaluation-tool/src/components/report/ReportPreview.tsx to highlight contradictions between research and user answers in Extended section (depends on T043, T046)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can choose Quick Report (US1) for speed or Extended Report (US2) for research-backed analysis.

---

## Phase 5: User Story 3 - Reference Detailed Category Analyses (Priority: P3)

**Goal**: Provide detailed category-by-category analyses (See, Change, Use, Adapt, Leave, Learn) as supporting reference material below executive summary

**Independent Test**: Generate any report, verify the Cons/Pros/Extended sections appear first as primary content, then verify that category analyses are available below with clear "Supporting Detail" labeling and proper separation

### Implementation for User Story 3

**Note**: Category analyses already exist in the current system. This story focuses on repositioning them as supporting detail rather than primary content.

- [ ] T050 [US3] Update apps/evaluation-tool/src/components/report/ReportPreview.tsx to add visual separator (horizontal rule or section break) between synthesized sections and category analyses
- [ ] T051 [US3] Update apps/evaluation-tool/src/components/report/ReportPreview.tsx to add "Supporting Detail: Category Analyses" heading with explanatory text indicating these are reference materials
- [ ] T052 [US3] Verify apps/evaluation-tool/src/components/report/ReportPreview.tsx displays each category (See, Change, Use, Adapt, Leave, Learn) with grade, answer counts (Yes/Limited/No/Don't Know), and AI-generated analysis unchanged from existing implementation
- [ ] T053 [US3] Update styling in apps/evaluation-tool/src/components/report/ReportPreview.tsx to make category analyses visually secondary (smaller font, muted colors) compared to Cons/Pros/Extended sections

**Checkpoint**: All user stories should now be independently functional. Users get executive summary (US1), optional external research (US2), and detailed category breakdowns (US3) in a clear hierarchy.

---

## Phase 6: Progress Feedback for Extended Reports (Priority: P2 Cross-Cutting)

**Goal**: Provide real-time progress updates during 5-minute Extended Report generation with estimated time remaining and cancel option

**Independent Test**: Start generating an Extended Report, verify progress UI shows current phase ("Researching See category...", "Researching Change category...", "Synthesizing findings..."), displays estimated time remaining, and provides a cancel button that switches to Quick Report

### Implementation for Progress Tracking

**Backend: Server-Sent Events or Polling**

- [ ] T054 [P] Update supabase/functions/generate-report-content/index.ts to support streaming progress updates via Server-Sent Events (SSE) using ReadableStream and TextEncoder
- [ ] T055 [P] Emit progress events in supabase/functions/brave-search/index.ts after each category search completes (phase: 'research', currentCategory, currentAPI: 'brave', progress: 0-60%)
- [ ] T056 [P] Emit progress events in supabase/functions/exa-search/index.ts after each category search completes (phase: 'research', currentCategory, currentAPI: 'exa', progress: 0-60%)
- [ ] T057 [P] Emit synthesis progress event in supabase/functions/generate-report-content/index.ts before calling Claude API (phase: 'synthesis', progress: 60-100%)
- [ ] T058 Emit completion event in supabase/functions/generate-report-content/index.ts with final report data (phase: 'complete', progress: 100) (depends on T054-T057)

**Frontend: Progress UI**

- [ ] T059 [P] Create apps/evaluation-tool/src/components/report/ReportProgress.tsx component with progress bar (0-100%), phase message, estimated time remaining, and cancel button
- [ ] T060 [US2] Update apps/evaluation-tool/src/services/reportService.ts to establish EventSource connection to SSE endpoint in generateExtendedReport() and emit progress updates to UI callback (depends on T058)
- [ ] T061 [US2] Implement time estimation in apps/evaluation-tool/src/services/reportService.ts using progressCalculator utility from T009: Research phase 60-120s (6 categories × 2 APIs × 5-10s avg), Synthesis phase 30-60s
- [ ] T062 [US2] Implement cancel functionality in apps/evaluation-tool/src/services/reportService.ts using AbortController to close EventSource and call generateQuickReport() as fallback (depends on T060)
- [ ] T063 [US2] Update apps/evaluation-tool/src/components/report/ReportGenerator.tsx to render ReportProgress component during Extended Report generation and hide after completion (depends on T059-T062)

**Checkpoint**: Extended Report generation now provides excellent UX with real-time feedback, time estimates, and escape hatch to Quick Report.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, documentation, and validation

- [ ] T064 [P] Add JSDoc comments to all functions in apps/evaluation-tool/src/services/reportService.ts and apps/evaluation-tool/src/services/researchService.ts
- [ ] T065 [P] Update apps/evaluation-tool/README.md to document new report format with screenshots of Cons/Pros/Extended sections
- [ ] T066 [P] Verify backward compatibility in apps/evaluation-tool/src/utils/reportStorage.ts: old reports without new fields display gracefully with "(Generated before analytical format)" placeholders
- [ ] T067 [P] Add environment variable validation in supabase/functions/brave-search/index.ts and supabase/functions/exa-search/index.ts to check BRAVE_API_KEY and EXA_API_KEY exist at startup
- [ ] T068 Verify report generation performance: Quick Report <60 seconds, Extended Report <5 minutes using quickstart.md test scenarios
- [ ] T069 Manual validation: Generate Extended Reports for 3 different vendors, verify Cons/Pros/Extended quality, research source attribution, contradiction handling, and voice consistency (No BS vs Corporate)
- [ ] T070 Update DEPLOYMENT_STATUS.md to document new feature completion, API keys required (BRAVE_API_KEY, EXA_API_KEY in Supabase secrets), and deployment verification steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - No dependencies on other user stories
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) AND User Story 1 completion (extends synthesis with research)
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) - Can run in parallel with US1/US2 (only styling changes)
- **Progress Feedback (Phase 6)**: Depends on User Story 2 (extends Extended Report with progress UI)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Delivers Quick Report with synthesis
- **User Story 2 (P2)**: Depends on User Story 1 - Extends Quick Report with external research
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent (just repositions existing category analyses)
- **Progress Feedback**: Depends on User Story 2 - Enhances Extended Report UX

### Within Each User Story

**User Story 1**:
1. Backend prompts (T010-T013) can run in parallel
2. Backend Edge Function updates (T014-T015) depend on prompts
3. Frontend Report Generation (T016-T019) depends on backend
4. Frontend Report Display (T020-T025) can run in parallel with each other, depends on T019
5. Partial Evaluations (T026-T027) depend on display components

**User Story 2**:
1. Brave Search (T028-T033) can run fully in parallel with Exa Search (T034-T039)
2. Research Service (T040-T043) depends on both search implementations
3. Extended Report Generation (T044-T046) depends on Research Service
4. Research Findings Display (T047-T049) can run in parallel with each other, depends on T046

**User Story 3**:
- All tasks (T050-T053) are sequential styling updates to ReportPreview

**Progress Feedback**:
1. Backend SSE (T054-T058) can run in parallel with Frontend Progress UI (T059)
2. Frontend integration (T060-T063) depends on both backend and UI components

### Parallel Opportunities

**Setup Phase**: T002, T003, T004, T005 can all run in parallel (different interfaces/files)

**Foundational Phase**: T007, T008 can run in parallel (different utility files), T006 and T009 are independent

**User Story 1**:
- T010, T011, T012 (no-bs prompts) in parallel
- T013 (corporate prompts) in parallel with no-bs prompts
- T020, T021, T022, T023, T024 (display sections) all in parallel

**User Story 2**:
- T028-T033 (Brave) fully in parallel with T034-T039 (Exa)
- T031 and T033 are independent within Brave implementation
- T038 and T039 are independent within Exa implementation
- T047, T048 (display components) in parallel

**Progress Feedback**:
- T054 (SSE setup) in parallel with T059 (Progress UI component)
- T055, T056, T057 (emit events) can be implemented in parallel in their respective files

**Polish Phase**: T064, T065, T066, T067 can all run in parallel (different files/documentation)

---

## Parallel Example: User Story 1 Backend Prompts

```bash
# Launch all prompt updates for User Story 1 together:
Task: "Update no-bs.ts Cons synthesis prompt" (T010)
Task: "Update no-bs.ts Pros synthesis prompt" (T011)
Task: "Update no-bs.ts Extended synthesis prompt" (T012)
Task: "Update corporate.ts Cons/Pros/Extended prompts" (T013)
```

## Parallel Example: User Story 1 Frontend Display

```bash
# Launch all display section components together:
Task: "Add header section to ReportPreview" (T020)
Task: "Add Headline section to ReportPreview" (T021)
Task: "Add Cons section to ReportPreview" (T022)
Task: "Add Pros section to ReportPreview" (T023)
Task: "Add Extended section to ReportPreview" (T024)
```

## Parallel Example: User Story 2 Research APIs

```bash
# Brave and Exa implementations are completely independent:
Task: "Create brave-search/index.ts Edge Function" (T028)
Task: "Create exa-search/index.ts Edge Function" (T034)

Task: "Implement searchBrave() function" (T029)
Task: "Implement searchExa() function" (T035)

# ... and so on through T033 || T039
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T009) - CRITICAL
3. Complete Phase 3: User Story 1 (T010-T027)
4. **STOP and VALIDATE**: Test Quick Report with Cons/Pros/Extended synthesis independently
5. Deploy/demo if ready

**MVP Deliverable**: Executives can generate analytical reports with Cons/Pros/Extended sections in <60 seconds, no external research required. This is immediately useful and deployable.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (T010-T027) → Test independently → Deploy/Demo (MVP!) ✅
3. Add User Story 2 (T028-T049) → Test independently → Deploy/Demo (Extended Reports with research)
4. Add User Story 3 (T050-T053) → Test independently → Deploy/Demo (Category analyses repositioned)
5. Add Progress Feedback (T054-T063) → Test independently → Deploy/Demo (Better UX for Extended Reports)
6. Polish (T064-T070) → Final validation → Production ready

Each phase adds value without breaking previous phases.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T009)
2. **Once Foundational is done**:
   - Developer A: User Story 1 Backend (T010-T015)
   - Developer B: User Story 1 Frontend (T016-T027)
   - Developer C: User Story 3 (T050-T053) - Independent, can start early
3. **After User Story 1 complete**:
   - Developer A: Brave Search (T028-T033)
   - Developer B: Exa Search (T034-T039)
   - Developer C: Progress UI (T054, T059)
4. **Integration**:
   - Developer A or B: Research Service + Extended Report (T040-T046)
   - Developer C: Progress Backend Integration (T055-T058)
   - All: Final integration and polish (T047-T049, T060-T063, T064-T070)

---

## Task Summary

**Total Tasks**: 70
- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 4 tasks (CRITICAL - blocks all user stories)
- **Phase 3 (User Story 1 - P1 MVP)**: 18 tasks
- **Phase 4 (User Story 2 - P2)**: 22 tasks
- **Phase 5 (User Story 3 - P3)**: 4 tasks
- **Phase 6 (Progress Feedback - P2)**: 10 tasks
- **Phase 7 (Polish)**: 7 tasks

**Parallel Opportunities**: 31 tasks marked [P] can run in parallel within their phase

**MVP Scope** (Recommended for first delivery):
- Phase 1: Setup (T001-T005)
- Phase 2: Foundational (T006-T009)
- Phase 3: User Story 1 (T010-T027)
- **Total MVP Tasks**: 27 tasks

**Full Feature Scope**:
- All 70 tasks for complete Analytical Report Format feature with Quick Reports, Extended Reports with research, category analyses as supporting detail, and real-time progress feedback

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are omitted per specification (not explicitly requested)
- Use Context7 when implementing Brave Search API and Exa API integration for accurate library usage
- Follow research.md for exact API endpoints, authentication patterns, and query templates
- Verify backward compatibility with existing reports (pre-analytical format)
