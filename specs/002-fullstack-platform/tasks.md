# Tasks: Full-Stack VendorEval Platform

**Feature Branch**: `002-fullstack-platform`
**Input**: Design documents from `/specs/002-fullstack-platform/`
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, contracts/api-spec.md ✅

**Organization**: Tasks organized by user story (P1-P3) to enable independent implementation and testing.

**Tests**: Integration and E2E tests included per spec requirement (test after each feature area).

---

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US7)
- All tasks include exact file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, environment configuration, and basic structure setup.

- [ ] T001 Create Supabase project and configure local development environment per quickstart.md
- [ ] T002 Install and configure Supabase CLI for local database management
- [ ] T003 [P] Create environment variable templates in .env.example for all required configs
- [ ] T004 [P] Install frontend dependencies: @supabase/supabase-js v2.x, lucide-react in apps/evaluation-tool/
- [ ] T005 [P] Configure TypeScript strict mode in apps/evaluation-tool/tsconfig.json
- [ ] T006 [P] Setup ESLint + Prettier configurations for code quality standards
- [ ] T007 [P] Configure Vitest test runner in apps/evaluation-tool/vite.config.ts
- [ ] T008 [P] Configure Playwright for E2E testing in apps/evaluation-tool/playwright.config.ts
- [ ] T009 Create scripts directory with helper scripts: scripts/setup-discord-bot.ts, scripts/generate-types.ts

**Checkpoint**: Development environment ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required by ALL user stories - database schema, authentication framework, and base services.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Database Foundation

- [ ] T010 Create migration 00001_initial_schema.sql with users, categories, questions tables per data-model.md in supabase/migrations/
- [ ] T011 Create migration 00002_vendor_tables.sql with vendors, vendor_evaluations tables in supabase/migrations/
- [ ] T012 Create migration 00003_evaluation_tables.sql with evaluations table in supabase/migrations/
- [ ] T013 Create migration 00004_admin_tables.sql with admin_users, invite_codes tables in supabase/migrations/
- [ ] T014 Create migration 00005_feedback_tables.sql with feedback table in supabase/migrations/
- [ ] T015 Create migration 00006_rls_policies.sql with all Row Level Security policies in supabase/migrations/
- [ ] T016 Apply all migrations to local Supabase: supabase db reset
- [ ] T017 Generate TypeScript types from schema: supabase gen types typescript --local > apps/evaluation-tool/src/types/database.ts

### Authentication Framework

- [ ] T018 [P] Create Supabase client initialization in apps/evaluation-tool/src/lib/supabase.ts
- [ ] T019 [P] Create AuthContext provider in apps/evaluation-tool/src/contexts/AuthContext.tsx
- [ ] T020 [P] Create useAuth hook in apps/evaluation-tool/src/hooks/useAuth.ts
- [ ] T021 [P] Create auth service with signIn, signOut, getSession methods in apps/evaluation-tool/src/services/auth.ts
- [ ] T022 [P] Create ProtectedRoute component in apps/evaluation-tool/src/components/auth/ProtectedRoute.tsx

### Base Services

- [ ] T023 [P] Create database service with Supabase query helpers in apps/evaluation-tool/src/services/database.ts
- [ ] T024 [P] Create ToneContext provider for dual-tone toggle in apps/evaluation-tool/src/contexts/ToneContext.tsx
- [ ] T025 [P] Create useTone hook in apps/evaluation-tool/src/hooks/useTone.ts
- [ ] T026 [P] Create validation utilities in apps/evaluation-tool/src/utils/validation.ts
- [ ] T027 [P] Create error handling utilities in apps/evaluation-tool/src/utils/errors.ts

### Seed Data

- [ ] T028 Create seed data JSON files: categories.json, questions.json, vendors.json, pages.json in supabase/seed/data/
- [ ] T029 Create seed script in supabase/seed/seed.ts to populate database from JSON files
- [ ] T030 Run seed script to populate local database with initial content

**Checkpoint**: Foundation complete - database, auth, and base services ready. User story implementation can now begin.

---

## Phase 3: User Story 1 - Discord Member Authentication (Priority: P1) 🎯 MVP

**Goal**: Authenticate users via Discord OAuth with server membership verification (Guild 1254761492608188517), re-check membership every 10 logins, handle non-members gracefully.

**Independent Test**: User can log in with Discord, membership is verified, access is granted/denied accordingly, login count increments, membership re-checked on 10th visit.

### Edge Function: check-discord-membership

- [ ] T031 [US1] Create Edge Function directory: supabase/functions/check-discord-membership/
- [ ] T032 [US1] Implement Discord API client in supabase/functions/check-discord-membership/discord-api.ts
- [ ] T033 [US1] Implement membership check logic in supabase/functions/check-discord-membership/index.ts per contracts/api-spec.md
- [ ] T034 [US1] Add error handling and rate limiting (50 req/sec, cache 24h) to check-discord-membership
- [ ] T035 [US1] Deploy Edge Function locally: supabase functions serve check-discord-membership

### Frontend Auth Components

- [ ] T036 [P] [US1] Create Login page component in apps/evaluation-tool/src/pages/Login.tsx
- [ ] T037 [P] [US1] Create AuthCallback page component in apps/evaluation-tool/src/pages/AuthCallback.tsx
- [ ] T038 [P] [US1] Create Discord OAuth button component in apps/evaluation-tool/src/components/auth/DiscordButton.tsx
- [ ] T039 [P] [US1] Create membership error message component in apps/evaluation-tool/src/components/auth/MembershipError.tsx

### Auth Flow Implementation

- [ ] T040 [US1] Implement Discord OAuth sign-in flow in apps/evaluation-tool/src/services/auth.ts per contracts/api-spec.md
- [ ] T041 [US1] Implement auth callback handler with membership check in apps/evaluation-tool/src/pages/AuthCallback.tsx
- [ ] T042 [US1] Add login count increment logic to auth service in apps/evaluation-tool/src/services/auth.ts
- [ ] T043 [US1] Implement periodic membership re-check (every 10 logins) in apps/evaluation-tool/src/services/auth.ts
- [ ] T044 [US1] Add logout logic when membership is revoked in apps/evaluation-tool/src/services/auth.ts

### Integration Tests for US1

- [ ] T045 [P] [US1] Integration test: Discord OAuth flow succeeds for guild members in apps/evaluation-tool/tests/integration/auth.test.ts
- [ ] T046 [P] [US1] Integration test: Discord OAuth flow denies non-guild members in apps/evaluation-tool/tests/integration/auth.test.ts
- [ ] T047 [P] [US1] Integration test: Login count increments and triggers re-check on 10th visit in apps/evaluation-tool/tests/integration/auth.test.ts
- [ ] T048 [P] [US1] Integration test: User logged out when membership revoked on re-check in apps/evaluation-tool/tests/integration/auth.test.ts

**Checkpoint US1**: Discord authentication fully functional, members can log in, non-members see error, re-checks work correctly.

---

## Phase 4: User Story 2 - Create and Save Evaluations (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can create evaluations, answer 20 questions, add notes, auto-save to database, access from any device, export as Markdown.

**Independent Test**: User creates evaluation, answers questions, closes browser, reopens, sees answers persisted, exports Markdown successfully.

### Evaluation Services

- [ ] T049 [P] [US2] Create evaluation service with CRUD operations in apps/evaluation-tool/src/services/evaluation.ts per contracts/api-spec.md
- [ ] T050 [P] [US2] Update existing evaluation.ts to use database instead of LocalStorage in apps/evaluation-tool/src/services/evaluation.ts
- [ ] T051 [P] [US2] Implement auto-save logic (500ms debounce) in apps/evaluation-tool/src/services/evaluation.ts
- [ ] T052 [P] [US2] Create Markdown export utility in apps/evaluation-tool/src/utils/export.ts

### Evaluation UI Components

- [ ] T053 [P] [US2] Update Evaluate page to fetch/save to database in apps/evaluation-tool/src/pages/Evaluate.tsx
- [ ] T054 [P] [US2] Create evaluation list component in apps/evaluation-tool/src/components/evaluation/EvaluationList.tsx
- [ ] T055 [P] [US2] Create new evaluation modal in apps/evaluation-tool/src/components/evaluation/NewEvaluationModal.tsx
- [ ] T056 [P] [US2] Add export button with Markdown generation in apps/evaluation-tool/src/components/evaluation/ExportButton.tsx

### Content Queries for US2

- [ ] T057 [P] [US2] Implement getCategories query with tone support in apps/evaluation-tool/src/services/database.ts
- [ ] T058 [P] [US2] Implement getQuestions query with tone support in apps/evaluation-tool/src/services/database.ts
- [ ] T059 [US2] Integrate tone-aware content rendering in evaluation UI components

### Integration Tests for US2

- [ ] T060 [P] [US2] Integration test: Create new evaluation persists to database in apps/evaluation-tool/tests/integration/evaluation.test.ts
- [ ] T061 [P] [US2] Integration test: Answers auto-save and persist across sessions in apps/evaluation-tool/tests/integration/evaluation.test.ts
- [ ] T062 [P] [US2] Integration test: Evaluation accessible from different devices in apps/evaluation-tool/tests/integration/evaluation.test.ts
- [ ] T063 [P] [US2] Integration test: Export as Markdown generates correct format in apps/evaluation-tool/tests/integration/export.test.ts

### E2E Tests for US2

- [ ] T064 [US2] E2E test: Complete user journey (login → create → answer → export) in apps/evaluation-tool/tests/e2e/evaluation-flow.spec.ts

**Checkpoint US2**: Users can create, save, and export evaluations. Data persists to database and syncs across devices.

---

## Phase 5: User Story 3 - Dual-Tone Content Toggle (Priority: P2)

**Goal**: Users can toggle between "No BS" and "Corporate Friendly" modes, all content (questions, categories, pages) changes instantly (<500ms), preference saved in localStorage.

**Independent Test**: User toggles tone, sees all content change, reloads page, tone preference persists.

### Tone Toggle Implementation

- [ ] T065 [P] [US3] Create tone service with toggle logic in apps/evaluation-tool/src/services/tone.ts
- [ ] T066 [P] [US3] Create tone toggle button component in apps/evaluation-tool/src/components/ui/ToneToggle.tsx
- [ ] T067 [P] [US3] Implement localStorage persistence for tone preference in apps/evaluation-tool/src/services/tone.ts
- [ ] T068 [US3] Add tone toggle to app header in apps/evaluation-tool/src/components/layout/Header.tsx

### Content Transformation

- [ ] T069 [P] [US3] Create tone-aware content mapper utility in apps/evaluation-tool/src/utils/toneMapper.ts
- [ ] T070 [P] [US3] Update category components to display tone-specific content in apps/evaluation-tool/src/components/evaluation/CategoryBox.tsx
- [ ] T071 [P] [US3] Update question components to display tone-specific content in apps/evaluation-tool/src/components/evaluation/QuestionCard.tsx
- [ ] T072 [US3] Add performance optimization: client-side caching of dual-tone content in apps/evaluation-tool/src/services/tone.ts

### Integration Tests for US3

- [ ] T073 [P] [US3] Integration test: Tone toggle updates all visible content in apps/evaluation-tool/tests/integration/tone.test.ts
- [ ] T074 [P] [US3] Integration test: Tone preference persists across page reloads in apps/evaluation-tool/tests/integration/tone.test.ts
- [ ] T075 [P] [US3] Integration test: Tone toggle completes in <500ms in apps/evaluation-tool/tests/integration/tone.test.ts

### E2E Tests for US3

- [ ] T076 [US3] E2E test: Toggle tone and verify all content changes in apps/evaluation-tool/tests/e2e/tone-toggle.spec.ts

**Checkpoint US3**: Tone toggle fully functional, fast (<500ms), preference persists, all content adapts.

---

## Phase 6: User Story 4 - Admin Content Management (Priority: P2)

**Goal**: Admins can access /admin panel, CRUD questions/categories/vendors/pages, auto-generate corporate versions with Claude API, manage users and feedback.

**Independent Test**: Admin logs in, accesses /admin, edits question, sees changes immediately (<5s), non-admins cannot access admin panel.

### Edge Function: generate-corporate-tone

- [ ] T077 [US4] Create Edge Function directory: supabase/functions/generate-corporate-tone/
- [ ] T078 [US4] Implement Anthropic Claude API client in supabase/functions/generate-corporate-tone/anthropic-client.ts
- [ ] T079 [US4] Implement tone generation logic in supabase/functions/generate-corporate-tone/index.ts per contracts/api-spec.md
- [ ] T080 [US4] Add error handling and rate limiting (50 req/min) to generate-corporate-tone
- [ ] T081 [US4] Deploy Edge Function locally: supabase functions serve generate-corporate-tone

### Admin Panel Structure

- [ ] T082 [P] [US4] Create Admin page component with routing in apps/evaluation-tool/src/pages/Admin.tsx
- [ ] T083 [P] [US4] Create admin navigation sidebar component in apps/evaluation-tool/src/components/admin/AdminSidebar.tsx
- [ ] T084 [P] [US4] Create admin dashboard overview in apps/evaluation-tool/src/components/admin/Dashboard.tsx
- [ ] T085 [US4] Add admin route protection (check admin_users table) in apps/evaluation-tool/src/components/auth/ProtectedRoute.tsx

### Admin CMS Components

- [ ] T086 [P] [US4] Create Questions manager component in apps/evaluation-tool/src/components/admin/QuestionsManager.tsx
- [ ] T087 [P] [US4] Create Categories manager component in apps/evaluation-tool/src/components/admin/CategoriesManager.tsx
- [ ] T088 [P] [US4] Create Vendors manager component in apps/evaluation-tool/src/components/admin/VendorsManager.tsx
- [ ] T089 [P] [US4] Create Pages manager component in apps/evaluation-tool/src/components/admin/PagesManager.tsx
- [ ] T090 [P] [US4] Create Users manager component in apps/evaluation-tool/src/components/admin/UsersManager.tsx
- [ ] T091 [P] [US4] Create Feedback manager component in apps/evaluation-tool/src/components/admin/FeedbackManager.tsx
- [ ] T092 [P] [US4] Create Site Settings editor in apps/evaluation-tool/src/components/admin/SiteSettings.tsx

### Dual-Tone Editor

- [ ] T093 [P] [US4] Create side-by-side dual-tone editor component in apps/evaluation-tool/src/components/admin/DualToneEditor.tsx
- [ ] T094 [US4] Add "Auto-Generate Corporate" button with Claude API integration in apps/evaluation-tool/src/components/admin/DualToneEditor.tsx
- [ ] T095 [US4] Implement manual edit capability for auto-generated corporate versions in apps/evaluation-tool/src/components/admin/DualToneEditor.tsx

### Admin Services

- [ ] T096 [P] [US4] Create admin service with CMS CRUD operations in apps/evaluation-tool/src/services/admin.ts per contracts/api-spec.md
- [ ] T097 [US4] Implement optimistic UI updates with rollback on error in apps/evaluation-tool/src/services/admin.ts

### Integration Tests for US4

- [ ] T098 [P] [US4] Integration test: Admin can create/update/delete questions in apps/evaluation-tool/tests/integration/admin.test.ts
- [ ] T099 [P] [US4] Integration test: Auto-generate corporate version via Claude API in apps/evaluation-tool/tests/integration/admin.test.ts
- [ ] T100 [P] [US4] Integration test: Admin changes reflect in user-facing content <5s in apps/evaluation-tool/tests/integration/admin.test.ts
- [ ] T101 [P] [US4] Integration test: Non-admin users cannot access /admin in apps/evaluation-tool/tests/integration/admin.test.ts

### E2E Tests for US4

- [ ] T102 [US4] E2E test: Admin edits question and sees changes in evaluation UI in apps/evaluation-tool/tests/e2e/admin-cms.spec.ts

**Checkpoint US4**: Admin CMS fully functional, all content manageable, auto-generate works, access control enforced.

---

## Phase 7: User Story 5 - Invite Code System (Priority: P3)

**Goal**: Admins can create invite codes (7-day default expiration), non-Discord users can use codes to request magic link, gain access after clicking link.

**Independent Test**: Admin creates invite code, non-Discord user enters code, receives magic link email, clicks link, gains access, code marked as used.

### Invite Code Components

- [ ] T103 [P] [US5] Create invite code generator utility in apps/evaluation-tool/src/utils/inviteCode.ts
- [ ] T104 [P] [US5] Create invite code manager in admin panel in apps/evaluation-tool/src/components/admin/InviteCodesManager.tsx
- [ ] T105 [P] [US5] Create invite code entry form on login page in apps/evaluation-tool/src/components/auth/InviteCodeForm.tsx
- [ ] T106 [US5] Add magic link authentication flow for invite code users in apps/evaluation-tool/src/services/auth.ts per contracts/api-spec.md

### Invite Code Logic

- [ ] T107 [US5] Implement invite code validation (active, not expired, not used) in apps/evaluation-tool/src/services/database.ts
- [ ] T108 [US5] Implement invite code redemption (mark as used) after successful login in apps/evaluation-tool/src/services/auth.ts
- [ ] T109 [US5] Add email validation for invite codes with specific email restrictions in apps/evaluation-tool/src/services/auth.ts

### Integration Tests for US5

- [ ] T110 [P] [US5] Integration test: Admin creates invite code with 7-day expiration in apps/evaluation-tool/tests/integration/invites.test.ts
- [ ] T111 [P] [US5] Integration test: User enters valid invite code and receives magic link in apps/evaluation-tool/tests/integration/invites.test.ts
- [ ] T112 [P] [US5] Integration test: Invite code marked as used after redemption in apps/evaluation-tool/tests/integration/invites.test.ts
- [ ] T113 [P] [US5] Integration test: Expired invite code rejected in apps/evaluation-tool/tests/integration/invites.test.ts

**Checkpoint US5**: Invite code system functional, non-Discord users can gain access, codes expire and track usage.

---

## Phase 8: User Story 6 - Feedback System (Priority: P3)

**Goal**: Users see feedback widget on every page, can submit feedback, feedback stored in database AND creates GitHub issue with "user-feedback" label, admin can review in panel.

**Independent Test**: User submits feedback, feedback appears in database, GitHub issue created, admin sees feedback in panel, can update status.

### Edge Function: submit-feedback

- [ ] T114 [US6] Create Edge Function directory: supabase/functions/submit-feedback/
- [ ] T115 [US6] Implement GitHub API client in supabase/functions/submit-feedback/github-api.ts
- [ ] T116 [US6] Implement feedback submission logic in supabase/functions/submit-feedback/index.ts per contracts/api-spec.md
- [ ] T117 [US6] Add error handling (save feedback even if GitHub fails) to submit-feedback
- [ ] T118 [US6] Deploy Edge Function locally: supabase functions serve submit-feedback

### Feedback UI Components

- [ ] T119 [P] [US6] Create feedback widget component in apps/evaluation-tool/src/components/feedback/FeedbackWidget.tsx
- [ ] T120 [P] [US6] Create feedback form modal in apps/evaluation-tool/src/components/feedback/FeedbackForm.tsx
- [ ] T121 [US6] Add feedback widget to app layout (appears on all pages) in apps/evaluation-tool/src/components/layout/Layout.tsx

### Feedback Service

- [ ] T122 [US6] Create feedback service with submit method in apps/evaluation-tool/src/services/feedback.ts per contracts/api-spec.md
- [ ] T123 [US6] Implement rate limiting (5 submissions per hour per user) in apps/evaluation-tool/src/services/feedback.ts

### Integration Tests for US6

- [ ] T124 [P] [US6] Integration test: Feedback submission creates database record in apps/evaluation-tool/tests/integration/feedback.test.ts
- [ ] T125 [P] [US6] Integration test: Feedback creates GitHub issue with "user-feedback" label in apps/evaluation-tool/tests/integration/feedback.test.ts
- [ ] T126 [P] [US6] Integration test: Feedback saved even when GitHub API fails in apps/evaluation-tool/tests/integration/feedback.test.ts
- [ ] T127 [P] [US6] Integration test: Rate limiting prevents >5 submissions per hour in apps/evaluation-tool/tests/integration/feedback.test.ts

### E2E Tests for US6

- [ ] T128 [US6] E2E test: Submit feedback from evaluation page and verify in admin panel in apps/evaluation-tool/tests/e2e/feedback.spec.ts

**Checkpoint US6**: Feedback system functional, submissions create GitHub issues, graceful degradation on API failures, admin can manage feedback.

---

## Phase 9: User Story 7 - View Official Vendor Analyses (Priority: P3)

**Goal**: Users can view pre-analyzed vendors (e.g., Glean) with official answers to all 20 questions, evidence for each answer, dual-tone support for questions and evidence.

**Independent Test**: User navigates to vendor library, views Glean analysis, sees official answers with evidence, toggles tone and both questions and evidence change.

### Vendor Library Components

- [ ] T129 [P] [US7] Create Vendors page component in apps/evaluation-tool/src/pages/Vendors.tsx
- [ ] T130 [P] [US7] Create vendor list component in apps/evaluation-tool/src/components/vendor/VendorList.tsx
- [ ] T131 [P] [US7] Create vendor detail view component in apps/evaluation-tool/src/components/vendor/VendorDetail.tsx
- [ ] T132 [P] [US7] Create vendor evaluation display component in apps/evaluation-tool/src/components/vendor/VendorEvaluation.tsx

### Vendor Services

- [ ] T133 [P] [US7] Implement getOfficialVendors query in apps/evaluation-tool/src/services/database.ts per contracts/api-spec.md
- [ ] T134 [US7] Implement getVendorEvaluation query with tone support in apps/evaluation-tool/src/services/database.ts

### Integration Tests for US7

- [ ] T135 [P] [US7] Integration test: Fetch official vendors from database in apps/evaluation-tool/tests/integration/vendors.test.ts
- [ ] T136 [P] [US7] Integration test: Fetch vendor evaluation with evidence in apps/evaluation-tool/tests/integration/vendors.test.ts
- [ ] T137 [P] [US7] Integration test: Tone toggle updates vendor evidence text in apps/evaluation-tool/tests/integration/vendors.test.ts

### E2E Tests for US7

- [ ] T138 [US7] E2E test: Navigate to vendor library, view Glean, toggle tone in apps/evaluation-tool/tests/e2e/vendor-library.spec.ts

**Checkpoint US7**: Vendor library functional, pre-analyzed vendors viewable, dual-tone works for questions and evidence.

---

## Phase 10: Data Migration & Content Generation

**Purpose**: Migrate existing Phase I content (categories, questions, Glean data) to database, auto-generate corporate versions using Claude API.

- [ ] T139 [P] Verify all seed data JSON files complete: categories.json, questions.json, vendors.json in supabase/seed/data/
- [ ] T140 [P] Create migration script to populate database from seed data in scripts/migrate-localstorage.ts
- [ ] T141 Run seed script to populate production database: npm run seed:production
- [ ] T142 Create batch tone generation script using Claude API in scripts/generate-corporate-versions.ts
- [ ] T143 Run batch generation for all content (estimate costs first) to populate corporate versions
- [ ] T144 Verify zero data loss: compare original content vs migrated content
- [ ] T145 Manual review of 20 samples to verify semantic meaning preserved per SC-010

**Checkpoint**: All content migrated, corporate versions generated, validated for quality.

---

## Phase 11: Testing After Feature Areas

**Purpose**: Comprehensive integration and E2E testing after all feature areas complete per spec requirement (test after each feature area).

### Integration Test Suite

- [ ] T146 [P] Run all integration tests for US1-US7: npm run test:integration
- [ ] T147 [P] Verify 70% code coverage for business logic: npm run test:coverage
- [ ] T148 [P] Test RLS policies: user data isolation, admin access control in apps/evaluation-tool/tests/integration/rls.test.ts
- [ ] T149 [P] Test error handling: database errors, API failures, network errors in apps/evaluation-tool/tests/integration/errors.test.ts

### E2E Test Suite

- [ ] T150 [P] Run complete evaluation flow E2E test: login → create → answer → export in apps/evaluation-tool/tests/e2e/complete-flow.spec.ts
- [ ] T151 [P] Run admin CMS E2E test: edit content → verify changes in apps/evaluation-tool/tests/e2e/admin-workflow.spec.ts
- [ ] T152 [P] Run feedback E2E test: submit → verify GitHub issue in apps/evaluation-tool/tests/e2e/feedback-flow.spec.ts
- [ ] T153 Run performance validation: tone toggle <500ms, page load <3s per success criteria

### Manual Testing

- [ ] T154 Manual test: Discord OAuth flow with guild member account
- [ ] T155 Manual test: Discord OAuth flow with non-guild member account
- [ ] T156 Manual test: Invite code flow with magic link authentication
- [ ] T157 Manual test: Admin CMS operations across all content types
- [ ] T158 Manual test: Evaluation creation and cross-device sync
- [ ] T159 Manual test: Mobile responsiveness on real devices (iOS, Android)

**Checkpoint**: All tests passing, coverage met, performance validated.

---

## Phase 12: Deployment & Production Setup

**Purpose**: Deploy frontend to Vercel, backend to Supabase production, configure external services.

### Supabase Production Setup

- [ ] T160 Create Supabase production project at supabase.com
- [ ] T161 Link local project to production: supabase link --project-ref YOUR_PROJECT_REF
- [ ] T162 Push database migrations to production: supabase db push
- [ ] T163 [P] Deploy check-discord-membership Edge Function: supabase functions deploy check-discord-membership
- [ ] T164 [P] Deploy submit-feedback Edge Function: supabase functions deploy submit-feedback
- [ ] T165 [P] Deploy generate-corporate-tone Edge Function: supabase functions deploy generate-corporate-tone
- [ ] T166 Set production environment secrets: supabase secrets set DISCORD_GUILD_ID DISCORD_BOT_TOKEN GITHUB_TOKEN ANTHROPIC_API_KEY

### Discord OAuth Production Config

- [ ] T167 Create production Discord application at discord.com/developers
- [ ] T168 Add production redirect URL to Discord app: https://YOUR-PROJECT.supabase.co/auth/v1/callback
- [ ] T169 Configure Supabase Auth Discord provider with production credentials
- [ ] T170 Add Discord bot to production server with member read permissions

### Vercel Deployment

- [ ] T171 Create Vercel project for apps/evaluation-tool
- [ ] T172 Set production environment variables in Vercel: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- [ ] T173 Deploy to Vercel: vercel deploy --prod
- [ ] T174 Verify production deployment: test all features on live site
- [ ] T175 Configure custom domain (optional): add DNS records, SSL certificate

### Production Validation

- [ ] T176 Test production Discord OAuth flow end-to-end
- [ ] T177 Test production evaluation creation and persistence
- [ ] T178 Test production feedback submission creates GitHub issues
- [ ] T179 Test production admin CMS operations
- [ ] T180 Verify all success criteria met (SC-001 through SC-010)

**Checkpoint**: Production deployment complete, all features functional, success criteria validated.

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, documentation updates, performance optimization.

- [ ] T181 [P] Update README.md with production setup instructions
- [ ] T182 [P] Document environment variables in .env.example
- [ ] T183 [P] Add JSDoc comments to complex functions (Edge Functions, services)
- [ ] T184 [P] Run Lighthouse audit: verify performance targets met
- [ ] T185 [P] Optimize bundle size: verify <500KB gzipped JavaScript
- [ ] T186 [P] Security audit: run npm audit, verify no critical vulnerabilities
- [ ] T187 [P] Accessibility audit: verify WCAG 2.1 AA compliance
- [ ] T188 Code cleanup: remove console.logs, unused imports, dead code
- [ ] T189 Performance optimization: add indexes, optimize queries, lazy load routes
- [ ] T190 Error logging: setup error tracking (Sentry optional)

**Final Checkpoint**: Production ready, documented, optimized, accessible, secure.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion - **BLOCKS all user stories**
- **Phase 3-9 (User Stories)**: All depend on Phase 2 completion
  - US1 (P1) + US2 (P1): MVP - implement first (can parallelize)
  - US3 (P2): Depends on US2 (needs evaluation UI)
  - US4 (P2): Independent, can start after Phase 2
  - US5 (P3): Depends on US1 (extends auth)
  - US6 (P3): Independent, can start after Phase 2
  - US7 (P3): Independent, can start after Phase 2
- **Phase 10 (Migration)**: Depends on database schema (Phase 2) + US4 (Claude API)
- **Phase 11 (Testing)**: Depends on all user stories complete
- **Phase 12 (Deployment)**: Depends on Phase 11 passing
- **Phase 13 (Polish)**: Depends on Phase 12 complete

### User Story Priority Order

**Recommended Sequence**:
1. Phase 1-2: Setup + Foundational (all developers together)
2. **US1 + US2 (P1)**: MVP - authentication + evaluations (parallel if 2+ developers)
3. **US3 (P2)**: Dual-tone toggle (depends on US2 UI)
4. **US4 (P2)**: Admin CMS (can parallelize with US3)
5. **US5 + US6 + US7 (P3)**: Enhancement features (can parallelize all three)

**MVP Delivery** (Phases 1-4 only):
- US1: Discord authentication ✅
- US2: Create/save evaluations ✅
- Result: Users can log in and evaluate vendors (core value)

**Incremental Delivery**:
- MVP (US1+US2) → Deploy/Demo
- Add US3 (tone toggle) → Deploy/Demo
- Add US4 (admin CMS) → Deploy/Demo
- Add US5+US6+US7 → Deploy/Final Launch

### Parallel Opportunities

**Within Phase 2 (Foundational)**:
- T018-T022: All auth framework tasks can run in parallel
- T023-T027: All base service tasks can run in parallel

**Across User Stories** (after Phase 2):
- US4, US6, US7 are fully independent (different files, no shared dependencies)
- US1 and US2 can parallelize if different developers
- All [P] tasks within each user story can run in parallel

**Within User Stories**:
- US1: T036-T039 (auth components) can all run in parallel
- US2: T049-T052 (services), T053-T056 (UI), T057-T058 (queries) can run in parallel
- US4: T086-T092 (all admin manager components) can run in parallel

**Example: 2-Developer Team**:
- Week 1-2: Together on Phase 1-2
- Week 3-4: Dev A on US1, Dev B on US2
- Week 5: Both on US3 (requires US2)
- Week 6: Dev A on US4, Dev B on US6+US7
- Week 7: Dev A on US5, Dev B on testing
- Week 8: Both on deployment + polish

---

## Implementation Strategy

### MVP First (Minimum Viable Product)

**Goal**: Deliver core value in 4-5 weeks

1. ✅ Phase 1: Setup (3 days)
2. ✅ Phase 2: Foundational (5 days)
3. ✅ Phase 3: US1 - Authentication (4 days)
4. ✅ Phase 4: US2 - Evaluations (5 days)
5. ✅ Test MVP (3 days)
6. ✅ Deploy MVP to production (2 days)

**Result**: Users can authenticate and evaluate vendors - core functionality live.

### Incremental Delivery (Full Phase I)

**Goal**: Complete all P1-P3 features in 8 weeks

- Week 1-2: MVP (US1+US2)
- Week 3: US3 (tone toggle)
- Week 4: US4 (admin CMS)
- Week 5: US5+US6+US7 (enhancement features)
- Week 6: Migration + Testing
- Week 7: Deployment
- Week 8: Polish + Launch

**Each increment is independently testable and valuable.**

---

## Success Criteria Validation

After Phase 11 (Testing), verify all success criteria from spec.md:

- [ ] **SC-001**: Discord members can create first evaluation within 2 minutes ✅
- [ ] **SC-002**: Users can answer 20 questions and export within 15 minutes ✅
- [ ] **SC-003**: Tone toggle changes content in <500ms ✅
- [ ] **SC-004**: Admin edits reflect in <5 seconds ✅
- [ ] **SC-005**: Evaluations accessible from any device ✅
- [ ] **SC-006**: Feedback creates GitHub issue within 30 seconds (95% of time) ✅
- [ ] **SC-007**: Discord membership check completes within 5 seconds ✅
- [ ] **SC-008**: System supports 100 concurrent users ✅
- [ ] **SC-009**: Content migration with zero data loss ✅
- [ ] **SC-010**: Auto-generated corporate versions maintain semantic meaning ✅

---

## Task Count Summary

- **Phase 1 (Setup)**: 9 tasks
- **Phase 2 (Foundational)**: 21 tasks
- **Phase 3 (US1 - Auth)**: 18 tasks
- **Phase 4 (US2 - Evaluations)**: 16 tasks
- **Phase 5 (US3 - Tone Toggle)**: 12 tasks
- **Phase 6 (US4 - Admin CMS)**: 26 tasks
- **Phase 7 (US5 - Invite Codes)**: 11 tasks
- **Phase 8 (US6 - Feedback)**: 15 tasks
- **Phase 9 (US7 - Vendor Library)**: 10 tasks
- **Phase 10 (Migration)**: 7 tasks
- **Phase 11 (Testing)**: 14 tasks
- **Phase 12 (Deployment)**: 21 tasks
- **Phase 13 (Polish)**: 10 tasks

**Total Tasks**: 190

**Parallel Tasks**: 87 tasks marked [P] (46% can run in parallel)

**MVP Tasks** (Phase 1-4 + testing): 79 tasks (~4-5 weeks)

**Full Implementation**: 190 tasks (~8 weeks with AI assistance)

---

## Notes

- [P] = Different files, no dependencies, can run in parallel
- [Story] label = Task belongs to specific user story for traceability
- Each user story independently completable and testable
- Test after each feature area per spec requirement
- Commit after each task or logical group
- Use Context7 for library documentation lookups during implementation
- Follow quickstart.md for local development setup
- Reference contracts/api-spec.md for all API implementations

**Ready for implementation!** 🚀
