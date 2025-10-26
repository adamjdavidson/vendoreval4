# Tasks: AI-Powered Vendor Evaluation Report

**Input**: Design documents from `/specs/003-ai-report-generation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Unit tests, integration tests, and E2E tests are included per constitution requirements (Article II: 70% coverage for business logic).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Evaluation Tool**: `apps/evaluation-tool/src/`
- **Supabase Functions**: `supabase/functions/`
- **Shared Types**: `shared/types/`
- **Tests**: `apps/evaluation-tool/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and type definitions

- [x] T001 Create shared report type definitions in shared/types/report.ts
- [x] T002 [P] Create Supabase Edge Function directory structure in supabase/functions/generate-report-content/
- [x] T003 [P] Create report components directory in apps/evaluation-tool/src/components/report/
- [x] T004 [P] Create report services directory with placeholder files in apps/evaluation-tool/src/services/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Implement TypeScript interfaces for GeneratedReport, CategoryAnalysis, ResearchFinding in shared/types/report.ts
- [x] T006 [P] Create report storage utilities for LocalStorage operations in apps/evaluation-tool/src/utils/reportStorage.ts
- [x] T007 [P] Implement cache management utilities for research caching in apps/evaluation-tool/src/utils/cacheManager.ts
- [x] T008 [P] Create report formatter utility for display and export in apps/evaluation-tool/src/utils/reportFormatter.ts
- [x] T009 Deploy Supabase Edge Function scaffold with CORS headers in supabase/functions/generate-report-content/index.ts
- [x] T010 Configure Supabase environment variables (ANTHROPIC_API_KEY, BRAVE_API_KEY) via Supabase Dashboard

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generate Report Based on User Answers (Priority: P1) 🎯 MVP

**Goal**: Users can generate AI-powered reports from their 20 evaluation answers with headlines and category analyses

**Independent Test**: Complete an evaluation with all 20 questions answered, click "Generate Report", verify report appears with headline and 6 category analyses based on user answers

### Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Unit test for reportService.generateReport() in apps/evaluation-tool/tests/unit/reportService.test.ts
- [ ] T012 [P] [US1] Unit test for report generation logic in apps/evaluation-tool/tests/unit/reportGenerator.test.ts
- [ ] T013 [P] [US1] Integration test for complete report generation flow in apps/evaluation-tool/tests/integration/report-generation.test.ts

### Implementation for User Story 1

- [x] T014 [P] [US1] Implement prompt templates for "No BS" voice in supabase/functions/generate-report-content/prompts/no-bs.ts
- [x] T015 [P] [US1] Implement prompt templates for "Corporate" voice in supabase/functions/generate-report-content/prompts/corporate.ts
- [x] T016 [US1] Implement Claude API integration in Supabase Edge Function in supabase/functions/generate-report-content/index.ts
- [x] T017 [US1] Implement prompt construction logic with category grades and user answers in supabase/functions/generate-report-content/index.ts
- [x] T018 [US1] Implement reportService.generateReport() method in apps/evaluation-tool/src/services/reportService.ts
- [x] T019 [US1] Implement report generation orchestration (call grading, call AI, construct report) in apps/evaluation-tool/src/services/reportService.ts
- [x] T020 [US1] Implement LocalStorage persistence for generated reports in apps/evaluation-tool/src/services/reportService.ts
- [x] T021 [US1] Implement report retrieval methods (getReportById, listReports) in apps/evaluation-tool/src/services/reportService.ts
- [x] T022 [P] [US1] Create ReportGenerator component with voice selector in apps/evaluation-tool/src/components/report/ReportGenerator.tsx
- [x] T023 [P] [US1] Create ReportProgress component with loading indicator in apps/evaluation-tool/src/components/report/ReportProgress.tsx
- [x] T024 [P] [US1] Create ReportPreview component to display generated report in apps/evaluation-tool/src/components/report/ReportPreview.tsx
- [x] T025 [US1] Add "Generate Report" button to Evaluate page in apps/evaluation-tool/src/pages/Evaluate.tsx
- [x] T026 [US1] Implement error handling for API timeouts and failures in apps/evaluation-tool/src/services/reportService.ts
- [x] T027 [US1] Add partial evaluation handling with disclaimers in apps/evaluation-tool/src/services/reportService.ts

**Checkpoint**: At this point, User Story 1 should be fully functional - users can generate reports with AI analysis from their answers

---

## Phase 4: User Story 2 - Augment Report with External Research (Priority: P2)

**Goal**: Reports include external research findings from Brave Search API to augment user-provided answers

**Independent Test**: Generate a report for "OpenAI GPT-4", verify report includes research findings about transparency, documentation, and user complexity with proper source attribution

### Tests for User Story 2

- [ ] T028 [P] [US2] Unit test for researchService.researchVendor() in apps/evaluation-tool/tests/unit/researchService.test.ts
- [ ] T029 [P] [US2] Unit test for research cache hit/miss logic in apps/evaluation-tool/tests/unit/researchService.test.ts
- [ ] T030 [P] [US2] Integration test for Brave Search API integration in apps/evaluation-tool/tests/integration/research.test.ts

### Implementation for User Story 2

- [ ] T031 [P] [US2] Implement Brave Search API integration via Supabase Edge Function in supabase/functions/brave-search/index.ts
- [ ] T032 [P] [US2] Create search term mapping for each category in apps/evaluation-tool/src/services/researchService.ts
- [ ] T033 [US2] Implement researchService.researchVendor() method in apps/evaluation-tool/src/services/researchService.ts
- [ ] T034 [US2] Implement researchService.searchCategory() with Brave API calls in apps/evaluation-tool/src/services/researchService.ts
- [ ] T035 [US2] Implement relevance filtering and source ranking in apps/evaluation-tool/src/services/researchService.ts
- [ ] T036 [US2] Implement confidence scoring (high/medium/low) in apps/evaluation-tool/src/services/researchService.ts
- [ ] T037 [US2] Implement research cache with 7-day TTL in LocalStorage in apps/evaluation-tool/src/services/researchService.ts
- [ ] T038 [US2] Implement cache expiration and cleanup logic in apps/evaluation-tool/src/services/researchService.ts
- [ ] T039 [US2] Implement Ref MCP fallback for failed Brave searches in apps/evaluation-tool/src/services/researchService.ts
- [ ] T040 [US2] Update Edge Function to include research findings in prompt in supabase/functions/generate-report-content/index.ts
- [ ] T041 [US2] Update ReportPreview to display research findings with sources in apps/evaluation-tool/src/components/report/ReportPreview.tsx
- [ ] T042 [US2] Add research toggle option to ReportGenerator component in apps/evaluation-tool/src/components/report/ReportGenerator.tsx
- [ ] T043 [US2] Implement conflicting findings presentation logic in apps/evaluation-tool/src/utils/reportFormatter.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - reports include external research when available

---

## Phase 5: User Story 3 - Customize Report Voice and Format (Priority: P3)

**Goal**: Users can switch between "No BS" and "Corporate" voice modes and export reports to PDF

**Independent Test**: Generate two reports for the same evaluation with different voice settings, verify tone differs appropriately, then export to PDF and verify formatting

### Tests for User Story 3

- [ ] T044 [P] [US3] Unit test for voice mode switching in apps/evaluation-tool/tests/unit/reportGenerator.test.ts
- [ ] T045 [P] [US3] Unit test for PDF export service in apps/evaluation-tool/tests/unit/pdfExportService.test.ts
- [ ] T046 [P] [US3] Integration test for PDF generation with jsPDF in apps/evaluation-tool/tests/integration/pdf-export.test.ts

### Implementation for User Story 3

- [ ] T047 [P] [US3] Create VoiceSelector component (No BS / Corporate toggle) in apps/evaluation-tool/src/components/report/VoiceSelector.tsx
- [ ] T048 [US3] Implement voice mode state management in ReportGenerator in apps/evaluation-tool/src/components/report/ReportGenerator.tsx
- [ ] T049 [US3] Update Edge Function to use voice-specific prompts in supabase/functions/generate-report-content/index.ts
- [ ] T050 [US3] Implement PDF export service with jsPDF in apps/evaluation-tool/src/services/pdfExportService.ts
- [ ] T051 [US3] Implement PDF formatting for headline and category analyses in apps/evaluation-tool/src/services/pdfExportService.ts
- [ ] T052 [US3] Implement PDF styling (fonts, colors, spacing) per constitution (WCAG 2.1 AA) in apps/evaluation-tool/src/services/pdfExportService.ts
- [ ] T053 [US3] Add research findings section to PDF export in apps/evaluation-tool/src/services/pdfExportService.ts
- [ ] T054 [US3] Add citations and source attribution to PDF in apps/evaluation-tool/src/services/pdfExportService.ts
- [ ] T055 [US3] Add partial evaluation disclaimer banner to PDF in apps/evaluation-tool/src/services/pdfExportService.ts
- [ ] T056 [US3] Create export button in ReportPreview component in apps/evaluation-tool/src/components/report/ReportPreview.tsx
- [ ] T057 [US3] Implement PDF download trigger with proper filename in apps/evaluation-tool/src/components/report/ReportPreview.tsx

**Checkpoint**: All user stories should now be independently functional - users can generate, customize, and export reports

---

## Phase 6: End-to-End Testing

**Purpose**: Validate complete user flows across all stories

- [ ] T058 [P] E2E test for User Story 1 (generate report from answers) in apps/evaluation-tool/tests/e2e/generate-report.spec.ts
- [ ] T059 [P] E2E test for User Story 2 (research augmentation) in apps/evaluation-tool/tests/e2e/report-with-research.spec.ts
- [ ] T060 [P] E2E test for User Story 3 (voice modes and PDF export) in apps/evaluation-tool/tests/e2e/export-report.spec.ts
- [ ] T061 [P] E2E test for partial evaluation handling in apps/evaluation-tool/tests/e2e/partial-evaluation.spec.ts
- [ ] T062 [P] E2E test for error handling (API timeout, research failure) in apps/evaluation-tool/tests/e2e/error-handling.spec.ts

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T063 [P] Add JSDoc comments to reportService public methods in apps/evaluation-tool/src/services/reportService.ts
- [ ] T064 [P] Add JSDoc comments to researchService public methods in apps/evaluation-tool/src/services/researchService.ts
- [ ] T065 [P] Add JSDoc comments to pdfExportService public methods in apps/evaluation-tool/src/services/pdfExportService.ts
- [ ] T066 Optimize Claude API prompt for token efficiency (use prompt caching) in supabase/functions/generate-report-content/index.ts
- [ ] T067 [P] Implement storage quota warning when approaching 80% capacity in apps/evaluation-tool/src/services/reportService.ts
- [ ] T068 [P] Implement automatic cleanup of reports older than 90 days in apps/evaluation-tool/src/utils/reportStorage.ts
- [ ] T069 [P] Add performance monitoring for report generation duration in apps/evaluation-tool/src/services/reportService.ts
- [ ] T070 [P] Add error telemetry for failed report generations in apps/evaluation-tool/src/services/reportService.ts
- [ ] T071 Verify bundle size remains < 500KB gzipped after additions with npm run build
- [ ] T072 Run Lighthouse audit to verify performance targets (PDF < 5s) on apps/evaluation-tool
- [ ] T073 [P] Add accessibility audit for report components (WCAG 2.1 AA compliance) with axe-core
- [ ] T074 [P] Update README.md with report generation feature documentation in README.md
- [ ] T075 Update quickstart.md validation by testing all example code in specs/003-ai-report-generation/quickstart.md
- [ ] T076 Code cleanup: Remove debug console.logs from production code in apps/evaluation-tool/src/services/
- [ ] T077 Security audit: Verify no API keys exposed in client bundle with npm run build inspection

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **E2E Testing (Phase 6)**: Depends on all user stories being complete
- **Polish (Phase 7)**: Depends on all user stories and E2E tests being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Requires US1 completion for voice modes

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Services before components
- Core implementation before UI
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Story 1 and User Story 2 can start in parallel
- User Story 3 can start after User Story 1 completes (needs voice mode foundation)
- All tests for a user story marked [P] can run in parallel
- All E2E tests marked [P] can run in parallel
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for reportService.generateReport() in apps/evaluation-tool/tests/unit/reportService.test.ts"
Task: "Unit test for report generation logic in apps/evaluation-tool/tests/unit/reportGenerator.test.ts"
Task: "Integration test for complete report generation flow in apps/evaluation-tool/tests/integration/report-generation.test.ts"

# Launch all prompt templates together:
Task: "Implement prompt templates for No BS voice in supabase/functions/generate-report-content/prompts/no-bs.ts"
Task: "Implement prompt templates for Corporate voice in supabase/functions/generate-report-content/prompts/corporate.ts"

# Launch all UI components together:
Task: "Create ReportGenerator component with voice selector in apps/evaluation-tool/src/components/report/ReportGenerator.tsx"
Task: "Create ReportProgress component with loading indicator in apps/evaluation-tool/src/components/report/ReportProgress.tsx"
Task: "Create ReportPreview component to display generated report in apps/evaluation-tool/src/components/report/ReportPreview.tsx"
```

---

## Parallel Example: User Story 2

```bash
# Launch research infrastructure tasks together:
Task: "Implement Brave Search API integration via Supabase Edge Function in supabase/functions/brave-search/index.ts"
Task: "Create search term mapping for each category in apps/evaluation-tool/src/services/researchService.ts"

# Launch all research service tests together:
Task: "Unit test for researchService.researchVendor() in apps/evaluation-tool/tests/unit/researchService.test.ts"
Task: "Unit test for research cache hit/miss logic in apps/evaluation-tool/tests/unit/researchService.test.ts"
Task: "Integration test for Brave Search API integration in apps/evaluation-tool/tests/integration/research.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T010) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T011-T027)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Generate report from complete evaluation
   - Verify headline summarizes answers
   - Verify 6 category analyses appear
   - Verify partial evaluation disclaimers work
5. Deploy/demo if ready

**MVP Deliverable**: Users can generate AI-powered reports from their 20 evaluation answers with headlines and category analyses. Reports work offline (no external research). This is the core value proposition.

### Incremental Delivery

1. **Foundation**: Complete Setup + Foundational (T001-T010) → Foundation ready
2. **MVP**: Add User Story 1 (T011-T027) → Test independently → Deploy/Demo
   - Users can now generate reports from answers
   - ~$0.09 per report (Claude API only, no research costs)
3. **Enhanced**: Add User Story 2 (T028-T043) → Test independently → Deploy/Demo
   - Reports now include external research findings
   - ~$0.11 per report (Claude API + Brave Search)
4. **Complete**: Add User Story 3 (T044-T057) → Test independently → Deploy/Demo
   - Users can customize voice and export to PDF
   - Full feature set delivered
5. **Quality**: Complete E2E Testing (T058-T062) + Polish (T063-T077)
   - Production-ready with all safeguards

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. **Together**: Team completes Setup + Foundational (T001-T010)
2. **Parallel Work (once Foundational is done)**:
   - Developer A: User Story 1 (T011-T027) - Core report generation
   - Developer B: User Story 2 (T028-T043) - External research (can start in parallel)
3. **Sequential**:
   - Developer C: User Story 3 (T044-T057) - Starts after US1 completes (needs voice mode foundation)
4. **Together**: Team completes E2E Testing + Polish (T058-T077)

Stories complete and integrate independently.

---

## Task Count Summary

- **Total Tasks**: 77
- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 6 tasks
- **Phase 3 (User Story 1)**: 17 tasks (14 implementation + 3 tests)
- **Phase 4 (User Story 2)**: 16 tasks (13 implementation + 3 tests)
- **Phase 5 (User Story 3)**: 14 tasks (11 implementation + 3 tests)
- **Phase 6 (E2E Testing)**: 5 tasks
- **Phase 7 (Polish)**: 15 tasks

**Parallel Opportunities**: 42 tasks marked [P] can run concurrently (54% of all tasks)

**MVP Scope** (User Story 1 only): 27 tasks (Setup + Foundational + US1)

**Testing Coverage**: 14 test tasks (18% of total) ensuring 70%+ coverage per constitution

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution compliance: All tasks follow Article I (TypeScript strict), Article II (70% test coverage), Article III (WCAG 2.1 AA)
- Performance targets: Report generation < 30s (SC-001), PDF export < 5s, Bundle < 500KB
- Cost projections: ~$0.09 per report (US1 only), ~$0.11 per report (with US2 research)
