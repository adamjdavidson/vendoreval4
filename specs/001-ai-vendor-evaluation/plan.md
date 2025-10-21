# Implementation Plan: AI Vendor Evaluation Framework

**Branch**: `001-ai-vendor-evaluation` | **Date**: 2025-10-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-vendor-evaluation/spec.md`

## Summary

Build a comprehensive AI vendor evaluation system for Fortune 500 executives consisting of two applications: (1) an interactive React evaluation tool with 20-question assessment, dual voice modes, and professional report generation, and (2) a Docusaurus documentation site explaining the evaluation framework. Both applications are client-side only with LocalStorage persistence for the alpha release.

**Technical Approach**: Modern JavaScript stack with React 19 + Vite 6 for the evaluation tool and Docusaurus 3 for documentation. No backend required - all data persists in browser LocalStorage. Dual deployment to separate URLs with potential cross-linking.

## Technical Context

**Language/Version**: JavaScript/TypeScript (TypeScript strict mode), Node.js 20.x+, npm 10.x+
**Primary Dependencies**:
- **Evaluation Tool**: React 19, React-DOM 19, React-Router 7, Vite 6, Tailwind CSS 3.4, jsPDF 2.x, Lucide React
- **Documentation**: Docusaurus 3.6, React 19, MDX 3.0
**Storage**: Browser LocalStorage (5-10MB limit, ~20 evaluations max)
**Testing**: Vitest for unit/component tests, React Testing Library, manual cross-browser testing
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari on desktop + mobile), minimum iOS 15+ Safari, Chrome 90+
**Project Type**: Web application (dual app monorepo structure)
**Performance Goals**:
- Initial page load: <3 seconds on 3G
- Route transitions: <100ms
- PDF generation: <5 seconds
- Documentation search: <500ms
**Constraints**:
- No backend/database (client-side only)
- Bundle size: <500KB gzipped total JS
- Mobile-responsive down to 320px width
- WCAG 2.1 AA accessibility compliance
**Scale/Scope**:
- 2 applications (evaluation tool + docs)
- ~15-20 React components
- 20 questions with dual voice mode content
- 6 evaluation categories
- 1 pre-analyzed vendor (Glean) for alpha

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Article I: Code Quality Standards
- ✅ **TypeScript strict mode**: Will be enabled in tsconfig.json
- ✅ **ESLint + Prettier**: Will be configured with React/TypeScript rules
- ✅ **Component per file**: Architecture supports this (see Project Structure)
- ✅ **Max 300 lines per file**: Enforced via ESLint rule
- ✅ **No circular dependencies**: Vite build will catch these

### Article II: Testing Standards
- ✅ **70% coverage for business logic**: Vitest with coverage reporting
- ✅ **Test tools defined**: Vitest + React Testing Library
- ✅ **Manual testing plan**: Chrome, Firefox, Safari (desktop + mobile)
- ✅ **Tests colocated**: `Component.tsx` → `Component.test.tsx`

### Article III: User Experience Standards
- ✅ **WCAG 2.1 AA**: Design includes contrast ratios, keyboard nav, semantic HTML
- ✅ **Mobile-first**: Tailwind responsive breakpoints, 320px minimum
- ✅ **Loading states**: For >200ms operations (PDF gen, save to LocalStorage)
- ✅ **Error messages**: User-friendly with actionable next steps

### Article IV: Performance Requirements
- ✅ **Load time <3s**: Code splitting, lazy loading, optimized builds
- ✅ **Bundle <500KB**: Tree-shaking, lazy PDF library, minimal dependencies
- ✅ **Route transitions <100ms**: React Router with code splitting
- ✅ **PDF gen <5s**: jsPDF optimized for client-side generation

### Article V: Security and Privacy Standards
- ✅ **No data leaves browser**: LocalStorage only, no backend, no analytics
- ✅ **Input validation**: React auto-escapes, max note length enforced
- ✅ **Dependency security**: npm audit before adding, weekly security patches
- ✅ **No tracking**: No Google Analytics, no external fonts

### Article VI: Dependency Management
- ✅ **Core deps approved**: React 19, Vite 6, Tailwind, jsPDF, Docusaurus 3, Lucide React
- ✅ **Active maintenance**: All deps updated within 6 months
- ✅ **MIT/Apache/BSD licenses**: All approved deps use compatible licenses
- ✅ **Bundle impact considered**: jsPDF lazy-loaded, Lucide tree-shaken

### Article VII: Error Handling and Logging
- ✅ **Try-catch for async**: LocalStorage saves, PDF generation
- ✅ **console.log removed in prod**: ESLint no-console rule
- ✅ **Error boundaries**: React ErrorBoundary wraps all routes
- ✅ **Privacy-preserving logging**: No user data in console.error

### Article VIII: Content Standards
- ✅ **Dual voice modes**: All content (questions, help, docs, reports) in Direct + Suitable for Work
- ✅ **20 questions match framework**: SEE/CHANGE/USE/ADAPT/LEAVE/LEARN
- ✅ **Actionable explanations**: Each question has "why matters" + "what to ask"
- ✅ **Glean pre-analyzed**: Evidence-based answers for all 20 questions

### Article IX: Documentation Requirements
- ✅ **README.md**: Setup, install, run, test, deploy instructions
- ✅ **Inline comments**: For scoring logic, LocalStorage schema
- ✅ **LocalStorage schema**: Documented in utils/storage.ts

### Article X: Quality Gates
- ✅ **Constitution exists**: .specify/memory/constitution.md v1.1.0
- ✅ **Specification complete**: specs/001-ai-vendor-evaluation/spec.md
- ✅ **Pre-merge gates**: Tests pass, ESLint pass, manual testing
- ✅ **Pre-deploy gates**: E2E flow tested, exports verified, mobile tested

**Constitution Check Result**: ✅ PASS - All gates satisfied, no violations requiring justification.

## Project Structure

### Documentation (this feature)

```
specs/001-ai-vendor-evaluation/
├── spec.md              # Feature specification (✅ complete)
├── plan.md              # This file (in progress)
├── research.md          # Phase 0: Technology decisions and patterns (to be created)
├── data-model.md        # Phase 1: Data structures and LocalStorage schema (to be created)
├── quickstart.md        # Phase 1: Developer getting started guide (to be created)
├── contracts/           # Phase 1: TypeScript interfaces (to be created)
│   └── types.ts         # Shared TypeScript interfaces
└── tasks.md             # Phase 2: Task breakdown (created by /speckit.tasks)
```

### Source Code (repository root)

This is a **dual web application** structure with separate deployable apps sharing types:

```
apps/
├── evaluation-tool/                    # Interactive React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/
│   │   │   │   ├── LandingPage.tsx
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── ActionCard.tsx
│   │   │   │   └── VendorSection.tsx
│   │   │   ├── evaluation/
│   │   │   │   ├── EvaluationTool.tsx
│   │   │   │   ├── CategoryBox.tsx
│   │   │   │   ├── Question.tsx
│   │   │   │   ├── AnswerButtons.tsx
│   │   │   │   ├── NotesField.tsx
│   │   │   │   ├── HelpModal.tsx
│   │   │   │   └── OverallAssessment.tsx
│   │   │   ├── reports/
│   │   │   │   ├── ReportGenerator.tsx
│   │   │   │   ├── PDFExport.tsx
│   │   │   │   └── MarkdownExport.tsx
│   │   │   ├── vendors/
│   │   │   │   ├── VendorDetail.tsx
│   │   │   │   └── PreAnalyzedView.tsx
│   │   │   └── shared/
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── VoiceToggle.tsx
│   │   │       └── ErrorBoundary.tsx
│   │   ├── pages/
│   │   │   ├── Landing.tsx              # Route: /
│   │   │   ├── Evaluate.tsx             # Route: /evaluate (new or resume)
│   │   │   └── VendorDetail.tsx         # Route: /vendors/:vendorName
│   │   ├── data/
│   │   │   ├── questions.ts             # 20 questions with category mapping
│   │   │   ├── explanations.ts          # Dual voice mode help text
│   │   │   ├── vendors.ts               # Pre-analyzed vendor data (Glean)
│   │   │   └── scoringLogic.ts          # Category color calculation rules
│   │   ├── utils/
│   │   │   ├── scoring.ts               # Calculate category/overall grades
│   │   │   ├── storage.ts               # LocalStorage CRUD operations
│   │   │   ├── exportPDF.ts             # PDF generation logic
│   │   │   └── exportMarkdown.ts        # Markdown template generation
│   │   ├── hooks/
│   │   │   ├── useEvaluation.ts         # Evaluation state management
│   │   │   ├── useLocalStorage.ts       # Persistent state hook
│   │   │   └── useVoiceMode.ts          # Voice mode toggle + persistence
│   │   ├── types/
│   │   │   └── index.ts                 # TypeScript interfaces
│   │   ├── App.tsx                      # Root component with router
│   │   ├── main.tsx                     # React 19 entry point
│   │   └── index.css                    # Tailwind directives
│   ├── public/
│   │   └── favicon.ico
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts                   # Vite build config
│   ├── tailwind.config.js               # Tailwind theme (category colors)
│   ├── postcss.config.js
│   ├── tsconfig.json                    # TypeScript strict mode
│   ├── .eslintrc.js                     # ESLint rules
│   └── .prettierrc                      # Prettier config
│
└── docs/                                # Docusaurus documentation site
    ├── docs/
    │   ├── framework/
    │   │   ├── index.md                 # Framework overview
    │   │   ├── why-different.md         # Why AI procurement is different
    │   │   ├── see.md                   # Can you see how it works?
    │   │   ├── change.md                # Can you control it?
    │   │   ├── use.md                   # Is it actually useful?
    │   │   ├── adapt.md                 # Can it evolve?
    │   │   ├── leave.md                 # Can you exit?
    │   │   └── learn.md                 # Does it build capability?
    │   ├── maturity-model/
    │   │   ├── overview.md              # 4-level maturity model intro
    │   │   ├── level-1.md               # Individual use
    │   │   ├── level-2.md               # Workflow augmentation
    │   │   ├── level-3.md               # Organizational transformation
    │   │   └── level-4.md               # B2B integration
    │   ├── using-tool/
    │   │   ├── walkthrough.md           # How to use evaluation tool
    │   │   ├── questions-explained.md   # Deep dive on each question
    │   │   └── red-flags.md             # Critical warning signs
    │   └── vendors/
    │       └── glean.md                 # Pre-analyzed Glean evaluation
    ├── src/
    │   ├── components/
    │   │   └── VoiceModeToggle.tsx      # Global voice mode switcher
    │   ├── css/
    │   │   └── custom.css               # Docusaurus theme overrides
    │   └── pages/
    │       └── index.tsx                # Custom homepage (redirect to tool?)
    ├── static/
    │   └── img/
    ├── docusaurus.config.js             # Docusaurus configuration
    ├── sidebars.js                      # Documentation sidebar structure
    └── package.json

shared/                                  # Shared types (optional for alpha)
└── types/
    └── evaluation.ts                    # Shared TypeScript interfaces

tests/                                   # Root-level integration tests
├── evaluation-flow.test.ts              # E2E: Complete evaluation
├── report-generation.test.ts            # E2E: PDF + Markdown export
└── storage-persistence.test.ts          # E2E: LocalStorage save/load
```

**Structure Decision**: Dual web application (monorepo with `apps/` directory) because:
1. Two independently deployable applications (evaluation tool at `eval.domain.com`, docs at `docs.domain.com`)
2. Shared TypeScript types can be imported across apps (though alpha may inline them)
3. Separate package.json allows independent dependency management
4. Follows modern monorepo best practices (similar to Nx, Turborepo patterns)
5. Each app can be deployed to different platforms (Vercel for tool, GitHub Pages for docs)

## Complexity Tracking

*No constitutional violations - this section is empty.*

## Phase 0: Research & Technology Decisions

**Status**: To be completed in research.md

### Research Topics

1. **React 19 Migration Patterns**
   - New features: useOptimistic, useFormState, Server Components (not used)
   - Breaking changes from React 18
   - Best practices for client-only apps

2. **Vite 6 Configuration**
   - Code splitting strategies for optimal bundle size
   - Environment variable handling
   - Build optimization for production

3. **Tailwind CSS Integration**
   - Custom theme for category colors (#DFF7FF, #DFFEF1, #FFF4E0, etc.)
   - JIT mode configuration
   - PurgeCSS optimization to meet <50KB CSS target

4. **jsPDF Client-Side Generation**
   - Best practices for complex PDF layouts (executive summary + tables)
   - Performance optimization for <5s generation
   - Font embedding vs system fonts
   - Alternative: react-pdf (compare bundle size)

5. **LocalStorage Patterns**
   - Schema versioning for future migrations
   - Quota handling (5-10MB limit)
   - Encryption considerations (optional for sensitive notes)
   - Conflict resolution (none needed for single-user client-side)

6. **Dual Voice Mode Implementation**
   - Content structure (single source with variants vs separate files)
   - Runtime switching (React context + memo)
   - SEO implications for documentation (does voice mode affect search?)

7. **Docusaurus 3 + Tailwind Integration**
   - Official plugin vs custom configuration
   - Theme consistency between docs and evaluation tool
   - Voice mode toggle in Docusaurus (custom React component)

8. **Testing Strategy**
   - Vitest configuration for TypeScript
   - React Testing Library best practices for hooks
   - Mocking LocalStorage in tests
   - E2E testing without backend (Playwright vs manual)

**Output**: `research.md` with decisions, rationale, and alternatives considered for each topic.

## Phase 1: Design & Contracts

**Prerequisites**: research.md complete

### Data Model (`data-model.md`)

**Entities to Define**:

1. **Evaluation**
   - Fields: id, vendorName, createdAt, updatedAt, answers[], categoryGrades{}, overallGrade
   - Validation: vendorName required, answers array length = 20
   - State transitions: draft → complete (when all 20 answered)

2. **Question**
   - Fields: id, categoryKey, text, isCritical, explanations{ direct{}, suitableForWork{} }
   - Validation: id unique, categoryKey in [see, change, use, adapt, leave, learn]
   - Relationships: Belongs to Category

3. **Answer**
   - Fields: questionId, value (yes|no|not-enough-info|null), note, timestamp
   - Validation: questionId exists, value enum, note max 5000 chars
   - Relationships: Belongs to Evaluation

4. **Category**
   - Fields: key, title, subtitle, color, questions[]
   - Validation: key unique, color hex code, questions array length 3-4
   - Relationships: Has many Questions

5. **VoiceMode**
   - Fields: current (direct|suitable-for-work)
   - Validation: Enum value
   - Storage: LocalStorage separate key for user preference

6. **LocalStorage Schema**
   ```typescript
   {
     "ai-vendor-evaluations": {
       currentEvaluationId: string | null,
       evaluations: Evaluation[]
     },
     "ai-vendor-voice-mode": "direct" | "suitable-for-work"
   }
   ```

### API Contracts (`contracts/types.ts`)

**TypeScript Interfaces**:

```typescript
export type AnswerValue = 'yes' | 'no' | 'not-enough-info' | null;
export type VoiceMode = 'direct' | 'suitable-for-work';
export type CategoryKey = 'see' | 'change' | 'use' | 'adapt' | 'leave' | 'learn';
export type CategoryGrade = 'green' | 'yellow' | 'red' | 'grey' | null;

export interface Question {
  id: string;
  categoryKey: CategoryKey;
  text: string;
  isCritical: boolean;
  explanations: {
    direct: QuestionExplanation;
    suitableForWork: QuestionExplanation;
  };
}

export interface QuestionExplanation {
  whyMatters: string;
  goodLooksLike: string;
  badLooksLike: string;
  whatToAsk: string;
}

export interface Answer {
  questionId: string;
  value: AnswerValue;
  note: string;
  timestamp: string;
}

export interface Category {
  key: CategoryKey;
  title: string;
  subtitle: string;
  color: string;
  questions: Question[];
}

export interface Evaluation {
  id: string;
  vendorName: string;
  createdAt: string;
  updatedAt: string;
  answers: Answer[];
  categoryGrades: Record<CategoryKey, CategoryGrade>;
  overallGrade: CategoryGrade;
}

export interface PreAnalyzedVendor {
  vendorName: string;
  logoUrl: string;
  completedAt: string;
  evaluation: Evaluation;
  summary: string;
  redFlags: string[];
}

// Utility types
export interface StorageSchema {
  evaluations: Evaluation[];
  currentEvaluationId: string | null;
}

export interface ExportOptions {
  format: 'pdf' | 'markdown' | 'json';
  voiceMode: VoiceMode;
  includeNotes: boolean;
}
```

### Quickstart Guide (`quickstart.md`)

**Developer Getting Started**:

1. Prerequisites (Node 20+, npm 10+)
2. Clone and install
3. Run evaluation tool locally
4. Run docs locally
5. Run tests
6. Build for production
7. Environment variables (if any)
8. Troubleshooting common issues

### Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh claude` to update Claude-specific context with:
- React 19 + Vite 6 patterns
- Tailwind CSS configuration
- jsPDF usage patterns
- LocalStorage best practices
- Docusaurus 3 customization

**Output**: data-model.md, contracts/types.ts, quickstart.md, updated .claude/context.md

## Next Steps

1. ✅ Complete Phase 0: Research (`research.md`)
2. ✅ Complete Phase 1: Design (`data-model.md`, `contracts/`, `quickstart.md`)
3. Run `/speckit.tasks` to generate task breakdown
4. Import tasks to Beads for dependency tracking
5. Run `/speckit.implement` to execute tasks

## Architecture Decisions

### Decision: Client-Side Only (No Backend)

**Rationale**: Alpha targets Feedforward members (closed group, ~50 users max) with simple data needs. LocalStorage sufficient for 20 evaluations per user.

**Alternatives Considered**:
- Backend API + PostgreSQL: Overkill for alpha, adds deployment complexity
- Firebase/Supabase: Unnecessary vendor lock-in, privacy concerns with cloud storage

**Trade-offs**: No cross-device sync, no collaboration features, browser storage limits. Acceptable for alpha, can add backend in Phase 2 based on user feedback.

### Decision: Dual App Structure (Monorepo)

**Rationale**: Evaluation tool and documentation serve different purposes, may be deployed to different domains, have different update cadences.

**Alternatives Considered**:
- Single app with docs as routes: Creates unnecessary coupling, larger bundle
- Separate repos: Harder to share types, coordinate changes

**Trade-offs**: Slightly more complex setup, but better separation of concerns and deployment flexibility.

### Decision: jsPDF for PDF Generation

**Rationale**: Client-side generation avoids backend complexity, mature library (2M+ weekly downloads), supports tables and custom layouts.

**Alternatives Considered**:
- react-pdf: Better React integration but 2x bundle size (~400KB vs ~200KB)
- Server-side PDF generation: Requires backend, violates client-only constraint

**Trade-offs**: jsPDF API is imperative (not declarative), but acceptable for report generation use case. Lazy-loaded to avoid impacting initial bundle.

### Decision: Tailwind CSS Over Styled Components

**Rationale**: Utility-first CSS results in smaller bundle (<50KB after purge), faster development, better tree-shaking than CSS-in-JS.

**Alternatives Considered**:
- Styled Components: 15KB runtime overhead, slower builds
- Plain CSS: Harder to maintain, no design system

**Trade-offs**: Tailwind classes in JSX can be verbose, but PurgeCSS removes unused styles in production.

### Decision: TypeScript Strict Mode

**Rationale**: Catches type errors at compile time, improves maintainability, aligns with Constitution Article I.

**Alternatives Considered**:
- JavaScript only: Faster to write, but more runtime errors
- TypeScript loose mode: Allows gradual adoption, but defeats purpose

**Trade-offs**: Slower initial development (type annotations), but higher quality and fewer bugs.

---

**Plan Version**: 1.0.0
**Last Updated**: 2025-10-19
**Status**: Phase 0 pending (research.md creation)
