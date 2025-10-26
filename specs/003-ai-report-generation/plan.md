# Implementation Plan: AI-Powered Vendor Evaluation Report

**Branch**: `003-ai-report-generation` | **Date**: 2025-10-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-ai-report-generation/spec.md`

## Summary

Replace the current "Generate Report" function with an AI-powered report generation system that:
1. Uses user's 20 evaluation answers as primary input (not searching for answers)
2. Performs external research on vendor to augment user-provided answers
3. Generates comprehensive reports with headlines, category analysis, and research findings
4. Supports both "No BS" and "Corporate" voice modes
5. Exports to PDF format
6. Handles partial evaluations with prominent disclaimers

**Technical Approach**: Extend existing React evaluation tool with AI-powered report generation service using Claude API (via Supabase Edge Function), Exa MCP + Ref MCP for external research (Brave Search optional), and enhanced PDF export with jsPDF.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), React 19.2, Node.js 20+
**Primary Dependencies**: React 19, jsPDF 3.x, @anthropic-ai/sdk (via Supabase Edge Function), @supabase/supabase-js 2.x
**Storage**: LocalStorage for evaluation data, Supabase PostgreSQL for report templates and cached research
**Testing**: Vitest, React Testing Library, Playwright (E2E)
**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+), mobile-responsive
**Project Type**: Web application (frontend + serverless functions)
**Performance Goals**: Report generation < 30 seconds, PDF export < 5 seconds, UI remains responsive during generation
**Constraints**: Client-side bundle < 500KB gzipped, no sensitive data leaves browser except vendor name for research
**Scale/Scope**: Single-vendor reports, 20-question evaluations, research for 6 categories, PDF output < 2MB

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Implementation Gates (Article XI)

- [x] **Constitution exists and is current** - Version 1.1.0 ratified 2025-10-19
- [x] **Specification complete and approved** - spec.md validated with all clarifications resolved
- [x] **Technical plan validated** - This document (in progress)
- [ ] **Task breakdown created** - Will be created via `/speckit.tasks` after plan completion

### TypeScript Usage (Article I)

- [x] **All application code uses TypeScript with strict mode** - Existing codebase follows this
- [x] **Explicit type signatures for exports** - Will apply to all new report generation code
- [x] **Interfaces over type aliases** - Follow existing pattern in codebase

### Testing Standards (Article II)

- [x] **Minimum 70% code coverage for business logic** - Report generation logic must include unit tests
- [x] **UI components require happy-path rendering tests** - Report display components need tests
- [x] **Critical user flows have E2E tests** - "Generate Report" flow will get Playwright test

### User Experience Standards (Article III)

- [x] **Professional polish for C-level presentations** - PDF output must be presentation-ready
- [x] **Mobile-first approach** - Report generation UI works on 320px screens
- [x] **WCAG 2.1 AA compliance** - Loading states, error messages meet accessibility standards
- [x] **Loading indicators for operations > 200ms** - Report generation will show progress indicator
- [x] **User-friendly error messages** - "Unable to generate report" not "API timeout error"

### Performance Requirements (Article IV)

- [x] **PDF generation < 5 seconds** - Target met via jsPDF optimization
- [x] **Bundle size < 500KB** - Lazy load AI service, tree-shake unused code
- [x] **Debounce heavy operations** - Research calls debounced, cached when possible

### Security and Privacy (Article V)

- [x] **No sensitive data leaves browser** - Only vendor name sent for research, user answers stay local
- [x] **Input validation** - Sanitize user input before rendering in PDF
- [x] **No tracking in exports** - PDF contains no metadata or hidden tracking

### Dependency Management (Article VI)

- [ ] **New dependency: @anthropic-ai/sdk** - Active maintenance (Anthropic official), MIT license, used via Edge Function (not client bundle)
- [ ] **Consider: mcp-search or web-search library** - Need to evaluate options for external research in Phase 0
- [x] **Existing: jsPDF** - Already approved in constitution, used for PDF export

### Content Standards (Article VIII)

- [x] **Dual voice mode for all content** - Reports generated in both "No BS" and "Corporate" voice
- [x] **Preserve meaning when switching modes** - AI prompt engineering ensures translation accuracy
- [x] **Actionable content** - Reports include specific findings, not generic advice

### Deployment Architecture (Article X)

- [x] **Two separate Vercel projects** - Evaluation tool remains in `apps/evaluation-tool` project
- [x] **No monorepo routing** - New functionality contained within existing evaluation tool app
- [x] **Independent builds** - No changes to deployment architecture required

### Quality Gates

**No violations identified** - Feature aligns with all constitutional requirements.

## Project Structure

### Documentation (this feature)

```
specs/003-ai-report-generation/
├── plan.md              # This file
├── research.md          # Phase 0: Technology choices and research strategy
├── data-model.md        # Phase 1: Report data structures
├── quickstart.md        # Phase 1: Developer guide for report generation
├── contracts/           # Phase 1: API contracts
│   ├── report-service.md         # Report generation service interface
│   └── research-service.md       # External research service interface
└── tasks.md             # Phase 2: NOT created by /speckit.plan
```

### Source Code (repository root)

```
apps/evaluation-tool/
├── src/
│   ├── components/
│   │   └── report/                    # NEW: Report generation UI
│   │       ├── ReportGenerator.tsx    # Main report generation component
│   │       ├── ReportPreview.tsx      # Preview before export
│   │       ├── ReportProgress.tsx     # Progress indicator during generation
│   │       └── VoiceSelector.tsx      # No BS / Corporate toggle
│   │
│   ├── services/
│   │   ├── reportService.ts           # NEW: Report generation orchestration
│   │   ├── researchService.ts         # NEW: External research via web search
│   │   └── pdfExportService.ts        # ENHANCED: Advanced PDF generation
│   │
│   ├── utils/
│   │   ├── reportGenerator.ts         # NEW: AI-powered report text generation
│   │   ├── reportFormatter.ts         # NEW: Format report for display/export
│   │   └── grading.ts                 # EXISTING: Already has category grading logic
│   │
│   ├── types/
│   │   └── report.ts                  # NEW: Report-related TypeScript types
│   │
│   └── pages/
│       └── Evaluate.tsx               # MODIFIED: Add "Generate Report" button
│
└── tests/
    ├── unit/
    │   ├── reportGenerator.test.ts    # NEW: Test report generation logic
    │   ├── reportFormatter.test.ts    # NEW: Test formatting utilities
    │   └── researchService.test.ts    # NEW: Test research service
    │
    ├── integration/
    │   └── report-generation.test.ts  # NEW: Test full report workflow
    │
    └── e2e/
        └── generate-report.spec.ts    # NEW: Playwright E2E test

supabase/
└── functions/
    └── generate-report-content/       # NEW: Supabase Edge Function
        ├── index.ts                   # Claude API integration for report text
        └── prompts/                   # Report generation prompts
            ├── no-bs.ts               # "No BS" voice prompt
            └── corporate.ts           # "Corporate" voice prompt

shared/
└── types/
    └── report.ts                      # NEW: Shared report types across apps
```

**Structure Decision**: Extend existing web application structure (Option 2) in `apps/evaluation-tool`. New report generation functionality adds components, services, and utilities without requiring architectural changes. Supabase Edge Function handles AI integration server-side to keep client bundle small.

## Complexity Tracking

*No constitution violations - this section remains empty.*

## Phase 0: Research & Technology Decisions

### Research Tasks

1. **AI Integration Approach**
   - **Decision Needed**: How to integrate Claude API for report generation
   - **Options**:
     - (A) Supabase Edge Function (server-side, secure API key)
     - (B) Direct client-side API call (requires exposing API key mechanism)
     - (C) Custom backend service (adds deployment complexity)
   - **Research**: Evaluate security, performance, cost trade-offs

2. **External Research Strategy**
   - **Decision Needed**: How to perform web search for vendor information
   - **Options**:
     - (A) Brave Search API (privacy-focused, $5/month for 2000 queries)
     - (B) Ref MCP server (already available in environment)
     - (C) Claude web search capability (via prompt engineering)
     - (D) Manual curated research only (no automated search)
   - **Research**: Evaluate accuracy, cost, rate limits, privacy implications

3. **Report Generation Prompting Strategy**
   - **Decision Needed**: How to structure prompts for consistent, high-quality reports
   - **Options**:
     - (A) Single comprehensive prompt with all context
     - (B) Multi-step prompts (headline, then each category)
     - (C) Prompt chaining with refinement
   - **Research**: Test prompt approaches for quality, consistency, token efficiency

4. **Caching Strategy**
   - **Decision Needed**: Should external research be cached to reduce costs and improve speed
   - **Options**:
     - (A) No caching (fresh research every time)
     - (B) Browser localStorage caching (7-day TTL)
     - (C) Supabase database caching (shared across users)
   - **Research**: Balance freshness vs. cost vs. privacy

5. **PDF Generation Enhancements**
   - **Decision Needed**: Does jsPDF meet all requirements or do we need additional libraries
   - **Options**:
     - (A) jsPDF only (existing, proven)
     - (B) jsPDF + html2canvas (for rich formatting)
     - (C) pdfmake (alternative library with templates)
   - **Research**: Evaluate formatting capabilities, bundle size impact

### Best Practices Research

1. **Claude API for Report Generation**
   - Prompt engineering best practices for analytical reports
   - Token optimization for long-form content
   - Error handling and retry strategies
   - Rate limiting and quota management

2. **Web Search Integration**
   - Search query formulation for vendor research
   - Result filtering and relevance scoring
   - Source attribution and citation formatting
   - Handling low-quality or contradictory results

3. **Progressive Enhancement**
   - Graceful degradation when services unavailable
   - Offline-first approach for core evaluation (existing)
   - Optional enhancement with AI/research when available

4. **Performance Optimization**
   - Lazy loading AI service code
   - Streaming responses for long-running operations
   - Background processing without blocking UI
   - Progress indication best practices

**Output**: [research.md](./research.md) with decisions and rationale

## Phase 1: Design & Contracts

### Data Model (data-model.md)

**Key Entities**:

1. **GeneratedReport**
   - `id`: string (UUID)
   - `evaluationId`: string (references evaluation)
   - `vendorName`: string
   - `generatedAt`: timestamp
   - `voiceMode`: 'no-bs' | 'corporate'
   - `isPartial`: boolean
   - `completedCategories`: string[] (category keys)
   - `headline`: string
   - `categoryAnalyses`: CategoryAnalysis[]
   - `researchFindings`: ResearchFinding[]

2. **CategoryAnalysis**
   - `categoryKey`: string ('see' | 'change' | 'use' | 'adapt' | 'leave' | 'learn')
   - `grade`: Grade ('A' | 'B' | 'C' | 'D' | 'F')
   - `yesCount`: number
   - `noCount`: number
   - `unknownCount`: number
   - `analysisText`: string (generated analysis)
   - `userAnswerSummary`: string

3. **ResearchFinding**
   - `categoryKey`: string
   - `topic`: string (e.g., "Transparency", "Ease of Use")
   - `finding`: string (summary of research)
   - `sources`: Source[]
   - `confidence`: 'high' | 'medium' | 'low'
   - `researchedAt`: timestamp

4. **Source**
   - `url`: string
   - `title`: string
   - `snippet`: string (relevant excerpt)

5. **ReportGenerationRequest** (API input)
   - `vendorName`: string
   - `answers`: Answer[] (existing type)
   - `questions`: Question[] (existing type)
   - `categories`: Category[] (existing type)
   - `voiceMode`: 'no-bs' | 'corporate'
   - `includeResearch`: boolean

6. **ReportGenerationResponse** (API output)
   - `success`: boolean
   - `report`: GeneratedReport | null
   - `error`: string | null
   - `warnings`: string[] (e.g., "Research unavailable for Use category")

### API Contracts (contracts/)

#### 1. Report Generation Service (`contracts/report-service.md`)

**Purpose**: Orchestrate report generation from user answers

**Interface**:
```typescript
interface ReportService {
  generateReport(request: ReportGenerationRequest): Promise<GeneratedReport>;
  getReportById(id: string): GeneratedReport | null;
  deleteReport(id: string): void;
  listReports(): GeneratedReport[];
}
```

**Behavior**:
- Validates input (all required fields present)
- Calls AI service for text generation
- Calls research service for external findings (if enabled)
- Combines user answers + research into structured report
- Persists report to LocalStorage
- Returns complete GeneratedReport object

**Error Handling**:
- Validates vendor name is non-empty
- Handles AI service failures (returns user answers only)
- Handles research service failures (proceeds without research)
- Timeout after 30 seconds

#### 2. Research Service (`contracts/research-service.md`)

**Purpose**: Perform external research on vendor

**Interface**:
```typescript
interface ResearchService {
  researchVendor(vendorName: string, categories: string[]): Promise<ResearchFinding[]>;
  searchCategory(vendorName: string, categoryKey: string, searchTerms: string[]): Promise<ResearchFinding | null>;
}
```

**Behavior**:
- Performs web searches for each category with vendor-specific terms
- Filters results for relevance and quality
- Extracts key findings and sources
- Returns structured ResearchFinding objects
- Omits findings if confidence is too low

**Search Terms by Category**:
- See: "{vendor} transparency", "{vendor} system prompts visible"
- Change: "{vendor} customization", "{vendor} lock-in"
- Use: "{vendor} ease of use", "{vendor} user complexity"
- Adapt: "{vendor} model updates", "{vendor} autonomy controls"
- Leave: "{vendor} data export", "{vendor} migration"
- Learn: "{vendor} documentation", "{vendor} skill transferability"

#### 3. Supabase Edge Function (`supabase/functions/generate-report-content`)

**Purpose**: Generate report text using Claude API

**Endpoint**: POST `/functions/v1/generate-report-content`

**Request Body**:
```json
{
  "vendorName": "string",
  "categoryAnalyses": [
    {
      "categoryKey": "string",
      "grade": "string",
      "yesCount": number,
      "noCount": number,
      "unknownCount": number,
      "userAnswers": {
        "questionKey": "yes" | "no" | "not-enough-info"
      }
    }
  ],
  "researchFindings": [ /* optional */ ],
  "voiceMode": "no-bs" | "corporate"
}
```

**Response**:
```json
{
  "headline": "string",
  "categoryAnalyses": [
    {
      "categoryKey": "string",
      "analysisText": "string"
    }
  ]
}
```

**Prompt Structure**:
- System prompt defines voice mode and output format
- User prompt includes:
  - Vendor name
  - User's answer pattern for each category
  - Category grades
  - Research findings (if available)
  - Framework principles (See, Change, Use, Adapt, Leave, Learn)
- Output format: JSON with headline and category analysis texts

### Developer Guide (quickstart.md)

**Getting Started with Report Generation**:

1. **Setup**: No additional setup required (uses existing Supabase configuration)
2. **Generate Report**: Call `reportService.generateReport()` with evaluation data
3. **Preview**: Use `ReportPreview` component to display before export
4. **Export**: Call `pdfExportService.exportReport()` to generate PDF

**Example Usage**:
```typescript
import { reportService } from '@/services/reportService';

const report = await reportService.generateReport({
  vendorName: 'OpenAI GPT-4',
  answers: evaluationAnswers,
  questions: frameworkQuestions,
  categories: frameworkCategories,
  voiceMode: 'no-bs',
  includeResearch: true
});

// Display report
<ReportPreview report={report} />

// Export to PDF
const pdfBlob = await pdfExportService.exportReport(report);
```

**Testing**:
```bash
# Run unit tests
npm test -- reportGenerator

# Run integration tests
npm test -- report-generation

# Run E2E tests
npm run test:e2e -- generate-report
```

### Agent Context Update

After Phase 1 completion, run:
```bash
.specify/scripts/bash/update-agent-context.sh claude
```

This will add the following to `.claude/context.md`:
- Report generation data model
- Report service interface
- Research service interface
- PDF export enhancements
- Testing strategy for AI-powered features

## Next Steps

**This plan is now complete.** Next phases:

1. **Phase 0 Execution**: Research decisions documented in `research.md`
2. **Phase 1 Execution**: Design artifacts created (data-model.md, contracts/, quickstart.md)
3. **Agent Context**: Update `.claude/context.md` with new technical context
4. **Phase 2**: Run `/speckit.tasks` to generate implementation task breakdown

**Ready for**: Phase 0 research execution (will be completed as part of this `/speckit.plan` command).
