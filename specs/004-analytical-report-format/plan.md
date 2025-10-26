# Implementation Plan: Analytical Report Format for Vendor Evaluations

**Branch**: `004-analytical-report-format` | **Date**: 2025-10-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-analytical-report-format/spec.md`

**Note**: This plan extends existing report generation infrastructure (feature 003) to transform category-based reports into executive-ready analytical format with Cons/Pros/Extended synthesis.

## Summary

Transform vendor evaluation reports from technical category-by-category breakdown into executive-ready analytical format. Key changes:
- **Report Structure**: Header → Headline → Cons → Pros → Extended → Category Analyses (supporting detail) → Research Findings
- **Synthesized Analysis**: AI generates cross-category Cons/Pros/Extended sections instead of just category analyses
- **Framework-Focused Research**: 6 targeted queries (one per framework category) using Brave Search + Exa APIs
- **User Notes Integration**: Pass evaluation notes to Extended section for additional context
- **Progress Feedback**: Real-time status updates during 5-minute Extended Report generation with cancel option
- **Error Recovery**: Retry failed APIs once, continue with partial research if needed

This is an opinionated evaluation focused exclusively on 6 AI adoption best practices (See/Change/Use/Adapt/Leave/Learn), NOT a general research report.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) / Node.js 20+ (Edge Functions)
**Primary Dependencies**:
- Frontend: React 19, Vite 7, Tailwind CSS v4
- Backend: Supabase Edge Functions (Deno runtime)
- AI: Anthropic Claude API (prompt caching enabled)
- Research: Brave Search API, Exa API
**Storage**: LocalStorage (client-side), Supabase PostgreSQL (optional backend sync)
**Testing**: Vitest (unit/component), Playwright (E2E), React Testing Library
**Target Platform**: Modern browsers (Chrome, Firefox, Safari), mobile responsive (320px+)
**Project Type**: Web application (monorepo: apps/evaluation-tool + apps/docs)
**Performance Goals**:
- Quick Report: < 60 seconds
- Extended Report: < 5 minutes (with 12 research queries + synthesis)
- Real-time progress updates every phase
**Constraints**:
- Client-side privacy (no tracking, LocalStorage only)
- Bundle size: < 500KB gzipped total JavaScript
- WCAG 2.1 AA accessibility compliance
- Offline-capable for Quick Reports (no research)
**Scale/Scope**:
- Single-user app (executives evaluating vendors)
- 20 questions per evaluation
- 6 framework categories
- 12 research queries per Extended Report (6 Brave + 6 Exa)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Article I: Code Quality Standards
✅ **PASS** - TypeScript strict mode, explicit types, component-based architecture
✅ **PASS** - ESLint + Prettier configured, max 300 lines per file

### Article II: Testing Standards
✅ **PASS** - Unit tests for reportService synthesis logic
✅ **PASS** - Component tests for progress feedback UI
✅ **PASS** - Integration tests for research API calls
✅ **PASS** - E2E tests for full Extended Report flow
⚠️ **DEFERRED** - 70% coverage target (current feature extends existing tested code)

### Article III: User Experience Standards
✅ **PASS** - Professional polish for C-level executives
✅ **PASS** - Mobile-first (progress UI works on 320px)
✅ **PASS** - WCAG 2.1 AA (progress updates, keyboard navigation, screen readers)
✅ **PASS** - Loading states (real-time progress for 5-minute operation)
✅ **PASS** - Error messages (user-friendly with actionable next steps)

### Article IV: Performance Requirements
✅ **PASS** - Quick Report < 60s (within target)
✅ **PASS** - Extended Report < 5 minutes (documented and expected)
✅ **PASS** - Bundle size (research service ~20KB, progress UI ~10KB)

### Article V: Security and Privacy Standards
✅ **PASS** - No sensitive data leaves browser (research queries use vendor names only)
✅ **PASS** - API keys stored in Supabase secrets (not client-side)
✅ **PASS** - Input validation (research queries sanitized)

### Article VI: Dependency Management
⚠️ **NEW DEPENDENCIES REQUIRED**:
- Brave Search API SDK (if available, otherwise fetch)
- Exa API SDK (if available, otherwise fetch)
- Both: Active maintenance, MIT license, < 50KB each

**Justification**: Required for external research (FR-015, FR-016). No alternative for accessing these specific research sources.

### Article VII: Error Handling
✅ **PASS** - Retry logic for failed API calls
✅ **PASS** - Graceful degradation (partial results)
✅ **PASS** - User-friendly error messages

### Article VIII: Content Standards
✅ **PASS** - Dual voice mode (No BS / Corporate) applied to all new sections
✅ **PASS** - Framework-focused (6 categories only, no generic research)

### Article IX: Documentation Requirements
✅ **PASS** - JSDoc for synthesis functions
✅ **PASS** - Update README with new report format
✅ **PASS** - quickstart.md for testing

### Article X: Deployment Architecture
✅ **PASS** - No deployment changes (extends existing evaluation tool)
✅ **PASS** - Two Vercel projects architecture unchanged

### Article XI: Quality Gates
✅ **PASS** - Constitution exists and current
✅ **PASS** - Specification complete (004-analytical-report-format/spec.md)
✅ **PASS** - Clarifications complete (5 questions resolved)
⏳ **IN PROGRESS** - Technical plan (this document)

**Overall Assessment**: ✅ **CONSTITUTION COMPLIANT** with 2 new dependencies justified by functional requirements.

## Project Structure

### Documentation (this feature)

```
specs/004-analytical-report-format/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (in progress)
├── research.md          # Phase 0: API research, prompt engineering
├── data-model.md        # Phase 1: Updated GeneratedReport interface
├── quickstart.md        # Phase 1: Developer testing guide
├── contracts/           # Phase 1: Edge Function API contracts
│   └── generate-report-content-v2.json
└── tasks.md             # Phase 2: Generated by /speckit.tasks
```

### Source Code (repository root)

**Existing Structure** (extends feature 003-ai-report-generation):

```
apps/evaluation-tool/
├── src/
│   ├── components/
│   │   └── report/
│   │       ├── ReportGenerator.tsx        # ADD: report mode toggle (Quick/Extended)
│   │       ├── ReportProgress.tsx         # MODIFY: phase-based progress
│   │       └── ReportPreview.tsx          # MODIFY: display Cons/Pros/Extended
│   ├── services/
│   │   ├── reportService.ts               # MODIFY: synthesis logic
│   │   └── researchService.ts             # NEW: Brave + Exa integration
│   └── utils/
│       ├── reportFormatter.ts             # MODIFY: new format
│       └── reportStorage.ts               # MODIFY: new fields
├── tests/
│   ├── unit/
│   │   ├── reportService.test.ts          # ADD: synthesis tests
│   │   └── researchService.test.ts        # NEW: API integration tests
│   ├── integration/
│   │   └── report-generation.test.ts      # MODIFY: new format tests
│   └── e2e/
│       └── extended-report.spec.ts        # NEW: full Extended Report flow
│
shared/types/
└── report.ts                               # MODIFY: add cons/pros/extended fields

supabase/functions/
├── generate-report-content/
│   ├── index.ts                            # MODIFY: synthesis prompts
│   └── prompts/
│       ├── no-bs.ts                        # MODIFY: Cons/Pros/Extended
│       └── corporate.ts                    # MODIFY: Cons/Pros/Extended
└── brave-search/                          # NEW: Brave API proxy
    └── index.ts
```

**Structure Decision**: Web application (Option 2). Monorepo with apps/evaluation-tool (React) and supabase/functions (Edge Functions). This feature modifies existing report generation infrastructure rather than creating new top-level structure.

## Complexity Tracking

*No constitutional violations requiring justification.*

**New Dependencies Justified**:

| Dependency | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Brave Search API | FR-015 requires external research from Brave | Manual web scraping would violate ToS and be unreliable |
| Exa API | FR-016 requires technical documentation research | Generic search engines lack deep technical indexing |

**Architectural Decisions**:

| Decision | Rationale | Alternative Considered |
|----------|-----------|----------------------|
| 6 separate queries per API | Framework-focused (one per category) | Single broad query - rejected because doesn't align with framework categories |
| Client-side research service | Matches existing LocalStorage architecture | Server-side research - rejected because adds backend complexity without privacy benefit |
| Edge Function synthesis | Claude API requires server-side execution | Client-side synthesis - rejected because can't expose API keys |
| Real-time progress updates | 5-minute operation requires user feedback | Spinner only - rejected because poor UX for long waits |

## Phase 0: Research & Decision Documentation

**Research Topics** (to be documented in `research.md`):

1. **Brave Search API Integration**
   - API authentication and rate limits
   - Query syntax for framework categories
   - Response parsing and error handling
   - Retry strategies

2. **Exa API Integration**
   - API authentication and capabilities
   - Technical documentation search patterns
   - Recency filtering (<6 months preferred)
   - Source quality indicators

3. **Prompt Engineering for Synthesis**
   - Cross-category analysis patterns
   - Positive/negative classification logic
   - User notes integration techniques
   - Balanced analysis without recommendations

4. **Progress Tracking Patterns**
   - Real-time updates from Edge Functions
   - Server-Sent Events vs polling
   - Cancel operation implementation
   - Time estimation algorithms

5. **Research Source Quality Assessment**
   - Domain authority scoring
   - Reddit/community site valuation
   - Recency indicators (age warnings)
   - Contradiction detection

**Output**: `research.md` with decisions, rationales, and alternatives for each topic.

## Phase 1: Design Artifacts

### Data Model (`data-model.md`)

**Updates to Existing Entities**:

```typescript
// shared/types/report.ts
export interface GeneratedReport {
  // EXISTING FIELDS (unchanged)
  id: string;
  evaluationId: string;
  vendorName: string;
  evaluationDate: string;
  generatedAt: number;
  voiceMode: VoiceMode;
  isPartial: boolean;

  // NEW FIELDS (add these)
  completionStatus: string;           // "20/20 questions answered (100%)"
  headline: string;                   // 1-2 sentence summary
  cons: string;                       // Synthesized negatives + why concerning
  pros: string;                       // Synthesized positives + why they matter
  extended: string;                   // Balanced analysis without recommendation

  // EXISTING FIELDS (repurposed as supporting detail)
  categoryAnalyses: CategoryAnalysis[];  // Now secondary to Cons/Pros/Extended
  researchFindings: ResearchFinding[];   // Now includes Brave + Exa results
  metadata: ReportMetadata;
}

export interface ResearchFinding {
  // EXISTING FIELDS
  category: string;
  finding: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';

  // NEW FIELDS
  sourceType: 'brave' | 'exa';        // Which API provided this
  sourceAge: string;                   // "2 months ago", "8 months ago"
  isFoundational: boolean;             // If >12 months, is it foundational?
  url: string;
  title: string;
  publishedDate?: string;
}

export interface ReportGenerationRequest {
  // EXISTING FIELDS
  evaluationId: string;
  vendorName: string;
  answers: Record<string, 'yes' | 'limited' | 'no' | 'not-enough-info'>;
  questions: Question[];
  categories: Category[];
  voiceMode: VoiceMode;

  // NEW FIELDS
  reportMode: 'quick' | 'extended';    // Quick = no research, Extended = with research
  notes: Record<string, string>;       // User notes by question key
  includeResearch: boolean;            // Derived from reportMode
}

export interface ReportProgressUpdate {
  phase: 'research' | 'synthesis' | 'complete';
  currentCategory?: string;             // "Researching See category..."
  currentAPI?: 'brave' | 'exa';
  progress: number;                     // 0-100
  estimatedTimeRemaining: number;       // seconds
  canCancel: boolean;
}
```

### API Contracts (`contracts/`)

**New Contract**: `generate-report-content-v2.json`

```json
{
  "endpoint": "/generate-report-content",
  "method": "POST",
  "request": {
    "vendorName": "string",
    "evaluationDate": "string (ISO)",
    "completionStatus": "string",
    "categoryAnalyses": "CategoryAnalysis[]",
    "researchFindings": "ResearchFinding[]",
    "userNotes": "Record<string, string>",
    "voiceMode": "'no-bs' | 'corporate'"
  },
  "response": {
    "headline": "string",
    "cons": "string",
    "pros": "string",
    "extended": "string",
    "categoryAnalyses": "CategoryAnalysis[]"
  },
  "errors": {
    "400": "Invalid request format",
    "429": "Rate limit exceeded",
    "500": "AI generation failed",
    "503": "Service unavailable"
  }
}
```

**New Contract**: `brave-search.json`

```json
{
  "endpoint": "/brave-search",
  "method": "POST",
  "request": {
    "vendorName": "string",
    "category": "'See' | 'Change' | 'Use' | 'Adapt' | 'Leave' | 'Learn'",
    "maxResults": "number (default: 10)"
  },
  "response": {
    "results": [{
      "title": "string",
      "url": "string",
      "description": "string",
      "publishedDate": "string | null",
      "sourceType": "string"
    }]
  }
}
```

### Quickstart Guide (`quickstart.md`)

**Content Outline**:
1. **Setup**: Install dependencies, configure API keys
2. **Testing Quick Report**: Generate report without research
3. **Testing Extended Report**: Generate report with Brave + Exa research
4. **Testing Progress UI**: Monitor real-time updates
5. **Testing Error Scenarios**: API failures, timeouts, partial results
6. **Manual Validation**: Verify Cons/Pros/Extended quality
7. **Performance Testing**: Verify < 60s Quick, < 5min Extended

## Phase 2: Task Breakdown

**Note**: Task breakdown will be generated by `/speckit.tasks` command after this plan is complete.

**Expected Task Categories**:
1. **Research Service** (researchService.ts, brave-search Edge Function)
2. **Report Synthesis** (update generate-report-content prompts)
3. **Progress Tracking** (ReportProgress component, SSE or polling)
4. **UI Updates** (ReportGenerator mode toggle, ReportPreview new sections)
5. **Type Updates** (shared/types/report.ts)
6. **Testing** (unit, integration, E2E)
7. **Documentation** (README, quickstart)

## Dependencies & Risks

### External Dependencies

| Dependency | Type | Risk | Mitigation |
|------------|------|------|------------|
| Brave Search API | Required | Rate limits, downtime | Retry logic, cache results, fallback to Quick Report |
| Exa API | Required | Rate limits, downtime | Retry logic, cache results, fallback to Quick Report |
| Claude API | Required | Rate limits, cost | Prompt caching, efficient synthesis prompts |

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Research APIs slow/unreliable | Extended Reports fail/timeout | Medium | Retry once, continue with partial, clear user messaging |
| Synthesis quality inconsistent | Reports lack coherence | Medium | Prompt engineering in Phase 0, human review of test cases |
| Bundle size exceeds 500KB | Performance degradation | Low | Lazy-load research service, tree-shake unused code |
| Progress updates lag behind | Poor UX perception | Low | Test with real network conditions, adjust polling interval |

### Implementation Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Prompt engineering takes longer than expected | Timeline slip | Medium | Allocate 2-3 days for prompt iteration, test with multiple vendors |
| Research API integration complex | Development delays | Low | Start with Brave only, add Exa incrementally |
| Cross-category synthesis logic difficult | Quality issues | Medium | Start with simple rules (transparency=positive), refine based on testing |

## Success Criteria (from spec.md)

- ✅ **SC-001**: Quick Report < 60 seconds
- ✅ **SC-002**: Extended Report < 5 minutes
- ✅ **SC-003**: 90% user preference for new format (post-launch survey)
- ✅ **SC-004**: ≥3 research findings per Extended Report
- ✅ **SC-005**: 100% user notes incorporation
- ✅ **SC-006**: Clear incomplete evaluation indicators
- ✅ **SC-007**: 95% voice consistency (No BS / Corporate)
- ✅ **SC-008**: 90% research API success rate
- ✅ **SC-009**: 100% contradiction presentation
- ✅ **SC-010**: Executive readability (user testing)

## Next Steps

1. ✅ Complete this plan document
2. ✅ Generate `research.md` (Phase 0) - Enhanced with Context7 API details
3. ✅ Generate `data-model.md` (Phase 1)
4. ✅ Generate `contracts/` (Phase 1)
5. ✅ Generate `quickstart.md` (Phase 1)
6. ✅ Update agent context
7. ✅ Run `/speckit.tasks` to generate task breakdown - **70 tasks generated, organized by user story**

**Planning Complete**: All design artifacts ready. Ready to begin implementation starting with Phase 1 (Setup) tasks.
