# Tasks: AI Vendor Evaluation Framework

**Input**: Design documents from `/specs/001-ai-vendor-evaluation/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Included per constitution Article II (70% coverage minimum)

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

This is a **dual web app** monorepo:
- **Evaluation Tool**: `apps/evaluation-tool/src/`
- **Documentation**: `apps/docs/`
- **Shared**: `shared/types/`
- **Tests**: `tests/` (root level integration tests)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and monorepo structure

- [ ] T001 Create monorepo directory structure (apps/, shared/, tests/)
- [ ] T002 Initialize evaluation tool with Vite 6 + React 19 in apps/evaluation-tool/
- [ ] T003 Initialize documentation site with Docusaurus 3 in apps/docs/
- [ ] T004 [P] Configure TypeScript strict mode in apps/evaluation-tool/tsconfig.json
- [ ] T005 [P] Configure ESLint + Prettier in apps/evaluation-tool/.eslintrc.js
- [ ] T006 [P] Configure Tailwind CSS in apps/evaluation-tool/tailwind.config.js
- [ ] T007 [P] Configure Vitest in apps/evaluation-tool/vitest.config.ts
- [ ] T008 [P] Setup git hooks for pre-commit linting in .git/hooks/pre-commit
- [ ] T009 Create shared types from contracts/types.ts in shared/types/index.ts
- [ ] T010 [P] Create README.md with setup instructions per quickstart.md

**MANDATORY VALIDATION - Phase 1**:
- [ ] VALIDATE Phase 1: Verify setup works
  - Run `cd apps/evaluation-tool && npm run dev` - confirm server starts on port 5173
  - Run `npx tsc --noEmit` - confirm TypeScript compiles with no errors
  - Run `npm run test` - confirm tests can run (even if no tests exist yet)
  - Visually confirm Tailwind CSS is working (check styles render)
  - **BLOCKER**: Phase 2 tasks CANNOT start until this validation passes

**Checkpoint**: Project structure validated and working

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Create static question data in apps/evaluation-tool/src/data/questions.ts (20 questions)
- [ ] T012 Create dual voice explanations in apps/evaluation-tool/src/data/explanations.ts
- [ ] T013 Create category definitions in apps/evaluation-tool/src/data/categories.ts (6 categories)
- [ ] T014 Create scoring logic utility in apps/evaluation-tool/src/utils/scoring.ts
- [ ] T015 Create LocalStorage utility in apps/evaluation-tool/src/utils/storage.ts
- [ ] T016 [P] Create VoiceMode context provider in apps/evaluation-tool/src/hooks/useVoiceMode.ts
- [ ] T017 [P] Create Evaluation context provider in apps/evaluation-tool/src/hooks/useEvaluation.ts
- [ ] T018 [P] Create LocalStorage persistence hook in apps/evaluation-tool/src/hooks/useLocalStorage.ts
- [ ] T019 Create React Router setup in apps/evaluation-tool/src/App.tsx (routes: /, /evaluate, /vendors/:name)
- [ ] T020 [P] Create ErrorBoundary component in apps/evaluation-tool/src/components/shared/ErrorBoundary.tsx
- [ ] T021 [P] Create Button component in apps/evaluation-tool/src/components/shared/Button.tsx
- [ ] T022 [P] Create Modal component in apps/evaluation-tool/src/components/shared/Modal.tsx
- [ ] T023 [P] Create VoiceToggle component in apps/evaluation-tool/src/components/shared/VoiceToggle.tsx

**MANDATORY VALIDATION - Phase 2**:
- [ ] VALIDATE Phase 2: Verify foundation works
  - Import and verify question data loads (20 questions, 6 categories)
  - Test scoring logic with sample answers - verify grade calculation
  - Test storage utility - write/read from localStorage
  - Test contexts mount without errors (VoiceMode, Evaluation)
  - **BLOCKER**: Phase 3 tasks CANNOT start until this validation passes

**Checkpoint**: Foundation validated and working - all shared utilities and contexts available for user stories

---

## Phase 3: User Story 1 - Executive Evaluates AI Vendor (Priority: P1) 🎯 MVP

**Goal**: Enable executives to complete full vendor evaluation (20 questions), see real-time category grades, and generate professional reports

**Independent Test**: Start app, create evaluation, answer all 20 questions, see category colors change, generate PDF/Markdown report

### Tests for User Story 1

**Write tests FIRST, ensure they FAIL before implementation**

- [ ] T024 [P] [US1] Unit test for scoring logic in apps/evaluation-tool/src/utils/scoring.test.ts
- [ ] T025 [P] [US1] Unit test for storage utility in apps/evaluation-tool/src/utils/storage.test.ts
- [ ] T026 [P] [US1] Component test for Question in apps/evaluation-tool/src/components/evaluation/Question.test.tsx
- [ ] T027 [P] [US1] Component test for CategoryBox in apps/evaluation-tool/src/components/evaluation/CategoryBox.test.tsx
- [ ] T028 [P] [US1] Hook test for useEvaluation in apps/evaluation-tool/src/hooks/useEvaluation.test.ts
- [ ] T029 [US1] Integration test for complete evaluation flow in tests/evaluation-flow.test.ts

### Implementation for User Story 1

#### Landing Page Components

- [ ] T030 [P] [US1] Create LandingPage component in apps/evaluation-tool/src/pages/Landing.tsx
- [ ] T031 [P] [US1] Create HeroSection component in apps/evaluation-tool/src/components/landing/HeroSection.tsx
- [ ] T032 [P] [US1] Create ActionCard component in apps/evaluation-tool/src/components/landing/ActionCard.tsx
- [ ] T033 [P] [US1] Create VendorSection component in apps/evaluation-tool/src/components/landing/VendorSection.tsx

#### Evaluation Tool Components

- [ ] T034 [US1] Create Evaluate page component in apps/evaluation-tool/src/pages/Evaluate.tsx
- [ ] T035 [US1] Create EvaluationTool component in apps/evaluation-tool/src/components/evaluation/EvaluationTool.tsx
- [ ] T036 [P] [US1] Create CategoryBox component in apps/evaluation-tool/src/components/evaluation/CategoryBox.tsx
- [ ] T037 [P] [US1] Create Question component in apps/evaluation-tool/src/components/evaluation/Question.tsx
- [ ] T038 [P] [US1] Create AnswerButtons component in apps/evaluation-tool/src/components/evaluation/AnswerButtons.tsx
- [ ] T039 [P] [US1] Create NotesField component in apps/evaluation-tool/src/components/evaluation/NotesField.tsx
- [ ] T040 [P] [US1] Create HelpModal component in apps/evaluation-tool/src/components/evaluation/HelpModal.tsx
- [ ] T041 [US1] Create OverallAssessment component in apps/evaluation-tool/src/components/evaluation/OverallAssessment.tsx

#### Report Generation Components

- [ ] T042 [US1] Create ReportGenerator component in apps/evaluation-tool/src/components/reports/ReportGenerator.tsx
- [ ] T043 [P] [US1] Create PDF export utility in apps/evaluation-tool/src/utils/exportPDF.ts (lazy-load jsPDF)
- [ ] T044 [P] [US1] Create Markdown export utility in apps/evaluation-tool/src/utils/exportMarkdown.ts
- [ ] T045 [P] [US1] Create PDFExport component in apps/evaluation-tool/src/components/reports/PDFExport.tsx
- [ ] T046 [P] [US1] Create MarkdownExport component in apps/evaluation-tool/src/components/reports/MarkdownExport.tsx

#### State Management & Persistence

- [ ] T047 [US1] Implement auto-save to LocalStorage on answer change (debounced 500ms)
- [ ] T048 [US1] Implement evaluation resume on page reload
- [ ] T049 [US1] Add validation for max note length (5000 chars)
- [ ] T050 [US1] Add LocalStorage quota handling with user-friendly error

#### Styling & Polish

- [ ] T051 [P] [US1] Style landing page with Tailwind (responsive down to 320px)
- [ ] T052 [P] [US1] Style evaluation tool with category colors per Tailwind theme
- [ ] T053 [P] [US1] Add loading states for PDF generation (>200ms operations)
- [ ] T054 [P] [US1] Add error messages with actionable next steps
- [ ] T055 [US1] Test full flow on Chrome, Firefox, Safari (desktop + mobile)

**MANDATORY VALIDATION - Phase 3 (MVP)**:
- [ ] VALIDATE Phase 3: Verify MVP works end-to-end
  - Manual test: Start app at localhost:5173
  - Complete full evaluation: Answer all 20 questions
  - Verify category boxes change colors in real-time (green/yellow/red/grey)
  - Generate PDF report - verify it downloads and looks professional
  - Refresh browser - verify localStorage persistence works
  - **BLOCKER**: Phase 4+ tasks CANNOT start until MVP is fully functional

**Checkpoint**: User Story 1 complete and validated - full evaluation flow works end-to-end, reports generate successfully

---

## Phase 4: User Story 2 - Executive Learns Framework (Priority: P2)

**Goal**: Provide comprehensive documentation explaining the 6 evaluation criteria and maturity model

**Independent Test**: Navigate to docs site, read all framework sections, toggle voice modes, verify search works

### Tests for User Story 2

- [ ] T056 [P] [US2] Manual test: All documentation pages load in <3 seconds
- [ ] T057 [P] [US2] Manual test: Search returns results in <500ms
- [ ] T058 [US2] Manual test: Voice mode toggle switches all content appropriately

### Implementation for User Story 2

#### Docusaurus Setup

- [ ] T059 [US2] Configure Docusaurus in apps/docs/docusaurus.config.js (theme, sidebar, search)
- [ ] T060 [P] [US2] Install Tailwind plugin for Docusaurus in apps/docs/
- [ ] T061 [P] [US2] Configure shared Tailwind theme in apps/docs/tailwind.config.js
- [ ] T062 [P] [US2] Create custom homepage in apps/docs/src/pages/index.tsx

#### Framework Documentation

- [ ] T063 [P] [US2] Write framework overview in apps/docs/docs/framework/index.md
- [ ] T064 [P] [US2] Write "Why AI Procurement is Different" in apps/docs/docs/framework/why-different.md
- [ ] T065 [P] [US2] Write SEE criterion docs (dual voice) in apps/docs/docs/framework/see.md
- [ ] T066 [P] [US2] Write CHANGE criterion docs (dual voice) in apps/docs/docs/framework/change.md
- [ ] T067 [P] [US2] Write USE criterion docs (dual voice) in apps/docs/docs/framework/use.md
- [ ] T068 [P] [US2] Write ADAPT criterion docs (dual voice) in apps/docs/docs/framework/adapt.md
- [ ] T069 [P] [US2] Write LEAVE criterion docs (dual voice) in apps/docs/docs/framework/leave.md
- [ ] T070 [P] [US2] Write LEARN criterion docs (dual voice) in apps/docs/docs/framework/learn.md

#### Maturity Model Documentation

- [ ] T071 [P] [US2] Write maturity model overview in apps/docs/docs/maturity-model/overview.md
- [ ] T072 [P] [US2] Write Level 1 (Individual Use) in apps/docs/docs/maturity-model/level-1.md
- [ ] T073 [P] [US2] Write Level 2 (Workflow Augmentation) in apps/docs/docs/maturity-model/level-2.md
- [ ] T074 [P] [US2] Write Level 3 (Organizational Transformation) in apps/docs/docs/maturity-model/level-3.md
- [ ] T075 [P] [US2] Write Level 4 (B2B Integration) in apps/docs/docs/maturity-model/level-4.md

#### Using Tool Documentation

- [ ] T076 [P] [US2] Write evaluation walkthrough in apps/docs/docs/using-tool/walkthrough.md
- [ ] T077 [P] [US2] Write questions explained in apps/docs/docs/using-tool/questions-explained.md
- [ ] T078 [P] [US2] Write red flags guide in apps/docs/docs/using-tool/red-flags.md

#### Voice Mode Integration

- [ ] T079 [US2] Create VoiceModeToggle component for Docusaurus in apps/docs/src/components/VoiceModeToggle.tsx
- [ ] T080 [US2] Add voice mode context to Docusaurus theme in apps/docs/src/theme/Root.tsx
- [ ] T081 [US2] Configure sidebar structure in apps/docs/sidebars.js

**Checkpoint**: Documentation site complete - all content readable in both voice modes, search functional

---

## Phase 5: User Story 3 - Executive Reviews Pre-Analyzed Vendor (Priority: P2)

**Goal**: Show pre-analyzed Glean evaluation as reference example

**Independent Test**: Navigate to /vendors/glean, see complete evaluation with all 20 questions answered and evidence

### Tests for User Story 3

- [ ] T082 [P] [US3] Component test for VendorDetail in apps/evaluation-tool/src/pages/VendorDetail.test.tsx
- [ ] T083 [US3] Manual test: Glean evaluation displays all 20 answers with evidence

### Implementation for User Story 3

#### Pre-Analyzed Vendor Data

- [ ] T084 [P] [US3] Create Glean evaluation data in apps/evaluation-tool/src/data/vendors.ts (all 20 questions answered)
- [ ] T085 [P] [US3] Add Glean logo to apps/evaluation-tool/public/vendors/glean-logo.png

#### Vendor Pages

- [ ] T086 [US3] Create VendorDetail page in apps/evaluation-tool/src/pages/VendorDetail.tsx
- [ ] T087 [P] [US3] Create PreAnalyzedView component in apps/evaluation-tool/src/components/vendors/PreAnalyzedView.tsx
- [ ] T088 [US3] Add Glean link to landing page vendor section

#### Documentation Integration

- [ ] T089 [P] [US3] Write Glean analysis in apps/docs/docs/vendors/glean.md (dual voice)
- [ ] T090 [US3] Cross-link evaluation tool and docs (link to /vendors/glean from both apps)

**Checkpoint**: Pre-analyzed vendor complete - Glean serves as reference example for users

---

## Phase 6: User Story 4 - Executive Switches Voice Modes (Priority: P3)

**Goal**: Enable seamless voice mode toggling throughout application with persistent preference

**Independent Test**: Toggle voice mode in evaluation tool and docs, verify content switches and preference persists across sessions

### Tests for User Story 4

- [ ] T091 [P] [US4] Hook test for useVoiceMode persistence in apps/evaluation-tool/src/hooks/useVoiceMode.test.ts
- [ ] T092 [US4] Integration test: Voice mode preference persists after browser close/reopen

### Implementation for User Story 4

**Note**: Most voice mode infrastructure was built in Phase 2 (foundational). This phase adds polish and ensures consistency.

#### Voice Mode Refinements

- [ ] T093 [P] [US4] Ensure all question explanations have complete dual voice content
- [ ] T094 [P] [US4] Ensure all documentation has complete dual voice content
- [ ] T095 [US4] Add voice mode indicator to report generation modal
- [ ] T096 [US4] Ensure voice mode toggle is accessible (keyboard navigation, screen reader)
- [ ] T097 [US4] Test voice mode content preservation (meaning intact, tone adapted)

#### Cross-App Consistency

- [ ] T098 [US4] Sync voice mode between evaluation tool and docs (if linking between apps)
- [ ] T099 [US4] Ensure voice mode preference persists in both apps independently

**Checkpoint**: Voice mode works seamlessly - users can toggle throughout app, preference persists

---

## Phase 7: User Story 5 - Executive Exports and Shares Evaluation (Priority: P3)

**Goal**: Enable export of evaluations as professional PDF or Markdown for sharing with stakeholders

**Independent Test**: Complete evaluation, export as PDF and Markdown, verify both formats are well-formatted and complete

### Tests for User Story 5

- [ ] T100 [P] [US5] Unit test for PDF export in apps/evaluation-tool/src/utils/exportPDF.test.ts
- [ ] T101 [P] [US5] Unit test for Markdown export in apps/evaluation-tool/src/utils/exportMarkdown.test.ts
- [ ] T102 [US5] Manual test: PDF renders correctly and is <5 seconds generation time
- [ ] T103 [US5] Manual test: Markdown renders correctly in Confluence/Notion/GitHub

### Implementation for User Story 5

**Note**: Most export infrastructure was built in Phase 3 (US1). This phase adds JSON export and polish.

#### JSON Export

- [ ] T104 [P] [US5] Create JSON export utility in apps/evaluation-tool/src/utils/exportJSON.ts
- [ ] T105 [P] [US5] Create JSON import utility in apps/evaluation-tool/src/utils/importJSON.ts
- [ ] T106 [US5] Add JSON export/import to ReportGenerator component

#### Export Polish

- [ ] T107 [P] [US5] Ensure PDF layout is professional (exec summary, category breakdowns, metadata)
- [ ] T108 [P] [US5] Ensure Markdown has proper formatting (headings, lists, tables)
- [ ] T109 [P] [US5] Test PDF on iOS/Android (email to self, open in native viewer)
- [ ] T110 [P] [US5] Test Markdown in Confluence, Notion, GitHub
- [ ] T111 [US5] Add export success/error toast notifications

**Checkpoint**: Export complete - PDFs and Markdown are professional and shareable

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final touches that affect multiple user stories and ensure production readiness

### Accessibility (WCAG 2.1 AA)

- [ ] T112 [P] Ensure all text meets 4.5:1 contrast ratio (run axe-core)
- [ ] T113 [P] Test keyboard navigation (Tab, Enter, Escape work throughout app)
- [ ] T114 [P] Add ARIA labels to all interactive elements
- [ ] T115 [P] Ensure screen reader compatibility (test with VoiceOver/NVDA)
- [ ] T116 [P] Add visible focus indicators to all focusable elements
- [ ] T117 [P] Test `prefers-reduced-motion` (disable animations if user prefers)

### Performance Optimization

- [ ] T118 [P] Implement code splitting with React.lazy for routes
- [ ] T119 [P] Lazy-load jsPDF library (only load on report generation)
- [ ] T120 [P] Optimize Tailwind CSS (PurgeCSS to meet <50KB target)
- [ ] T121 [P] Add memoization to category grade calculations
- [ ] T122 [P] Debounce LocalStorage writes (500ms idle)
- [ ] T123 Run Lighthouse audit (target: >90 performance score)

### Error Handling

- [ ] T124 [P] Add ErrorBoundary to all route components
- [ ] T125 [P] Add fallback UI for ErrorBoundary (friendly message + reload option)
- [ ] T126 [P] Ensure all async operations have try-catch with user-friendly errors
- [ ] T127 [P] Test LocalStorage quota exceeded error handling

### Documentation

- [ ] T128 [P] Update README.md with final setup instructions
- [ ] T129 [P] Add inline JSDoc comments to complex functions (scoring, LocalStorage schema)
- [ ] T130 [P] Document LocalStorage schema in utils/storage.ts comments
- [ ] T131 Create deployment guide in specs/001-ai-vendor-evaluation/deployment.md

### Testing

- [ ] T132 Run full test suite with coverage (target: >70% for business logic)
- [ ] T133 Manual testing on Chrome (desktop + mobile)
- [ ] T134 Manual testing on Firefox (desktop + mobile)
- [ ] T135 Manual testing on Safari (desktop + iOS)
- [ ] T136 Test LocalStorage persistence across sessions
- [ ] T137 Test voice mode toggle throughout application
- [ ] T138 Complete end-to-end evaluation with real vendor data

### Deployment Prep

- [ ] T139 [P] Build evaluation tool for production (npm run build)
- [ ] T140 [P] Build documentation site for production (npm run build)
- [ ] T141 Verify bundle sizes (evaluation tool <500KB, docs optimized)
- [ ] T142 Test production builds locally (npm run preview)
- [ ] T143 Create .env.example files with documented variables

**Checkpoint**: Application is production-ready - all quality gates passed, accessible, performant, tested

---

## Dependencies (User Story Completion Order)

```
Phase 1: Setup
  ↓
Phase 2: Foundational ← MUST complete before ANY user story
  ↓
Phase 3: User Story 1 (P1) 🎯 MVP ← Can ship after this
  ↓
Phase 4: User Story 2 (P2) ← Can work in parallel with US3
Phase 5: User Story 3 (P2) ← Can work in parallel with US2
  ↓
Phase 6: User Story 4 (P3) ← Requires US1
Phase 7: User Story 5 (P3) ← Requires US1
  ↓
Phase 8: Polish
```

**Parallel Opportunities**:
- User Story 2 (docs) and User Story 3 (pre-analyzed vendor) can be built simultaneously
- User Story 4 and User Story 5 can be built simultaneously (both build on US1)
- Within each phase, all tasks marked [P] can run in parallel

---

## Implementation Strategy

### MVP Scope (Week 1 Alpha)

**Minimum Viable Product** = **User Story 1 only** (Phase 1 + Phase 2 + Phase 3)

This delivers:
- ✅ Full evaluation flow (20 questions, category grading)
- ✅ Real-time category color updates
- ✅ Professional PDF and Markdown reports
- ✅ LocalStorage persistence
- ✅ Voice mode toggle
- ✅ Mobile-responsive design
- ✅ 70%+ test coverage

**After MVP**, incrementally add:
- Week 2: User Story 2 (documentation site)
- Week 2: User Story 3 (Glean pre-analysis)
- Week 3: User Stories 4 & 5 (polish)
- Week 3: Phase 8 (cross-cutting concerns)

### Task Execution Order

1. Complete Phase 1 (Setup) - T001 to T010
2. Complete Phase 2 (Foundational) - T011 to T023
3. Write tests for US1 - T024 to T029
4. Implement US1 - T030 to T055
5. Test US1 end-to-end
6. **SHIP MVP** (if passing all tests)
7. Continue with US2-US5 and Polish

### Parallel Execution Examples

**Phase 2 - Multiple developers**:
- Developer A: T011-T015 (data + utilities)
- Developer B: T016-T018 (hooks + contexts)
- Developer C: T019-T023 (routing + shared components)

**Phase 3 (US1) - Multiple developers**:
- Developer A: T030-T033 (landing page)
- Developer B: T034-T041 (evaluation tool)
- Developer C: T042-T046 (reports)
- Then synchronize for T047-T050 (state management)

**Phase 4 & 5 (US2 & US3) - Parallel work**:
- Developer A: All of Phase 4 (docs)
- Developer B: All of Phase 5 (pre-analyzed vendor)

---

## Summary

**Total Tasks**: 143
**MVP Tasks**: 65 (Phase 1 + Phase 2 + Phase 3 including tests)
**Parallel Opportunities**: 89 tasks marked [P]
**User Stories**: 5 (US1-US5, mapped to spec.md priorities)

**Task Breakdown by Phase**:
- Phase 1 (Setup): 10 tasks
- Phase 2 (Foundational): 13 tasks
- Phase 3 (US1 - MVP): 32 tasks (6 tests + 26 implementation)
- Phase 4 (US2): 23 tasks (3 tests + 20 implementation)
- Phase 5 (US3): 9 tasks (2 tests + 7 implementation)
- Phase 6 (US4): 7 tasks (2 tests + 5 implementation)
- Phase 7 (US5): 12 tasks (4 tests + 8 implementation)
- Phase 8 (Polish): 32 tasks

**Independent Test Criteria**:
- US1: Complete evaluation flow with report generation
- US2: All documentation pages load with search working
- US3: Glean evaluation displays with all evidence
- US4: Voice mode toggles and persists preference
- US5: PDF and Markdown exports work professionally

**Format Validation**: ✅ All 143 tasks follow checklist format (checkbox, ID, optional [P] and [Story] labels, file paths)

---

**Tasks Version**: 1.0.0
**Generated**: 2025-10-19
**Status**: Ready for execution
