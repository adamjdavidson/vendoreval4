# Research: Technology Decisions & Patterns

**Feature**: AI Vendor Evaluation Framework (001-ai-vendor-evaluation)
**Date**: 2025-10-19
**Status**: In Progress

This document contains research findings for Phase 0 of the implementation plan. Each topic includes a decision, rationale, alternatives considered, and implementation notes.

---

## 1. React 19 Migration Patterns

### Decision
Use React 19 with focus on client-side rendering, hooks-based architecture, and Context API for state management. Avoid new server component features (not applicable for client-only app).

### Rationale
- React 19 is stable and production-ready as of October 2024
- No breaking changes affecting client-side patterns we're using
- Improved performance for concurrent features
- Better TypeScript support with improved type inference
- `use` hook for handling promises (useful for lazy loading)

### Key React 19 Features We'll Use
1. **`use` Hook**: Load PDF library dynamically when needed
2. **Improved Error Boundaries**: Better error handling and recovery
3. **Concurrent Rendering**: Better performance for category calculations
4. **Automatic Batching**: Improved performance for state updates

### Features We're NOT Using
- **Server Components**: Not applicable (client-only app)
- **Server Actions**: Not applicable (no backend)
- **useOptimistic**: No optimistic updates needed
- **useFormState**: Using controlled components instead

### Breaking Changes from React 18
- None that affect our use case (all changes are server-side)
- React 19 maintains full backward compatibility for client-side apps

### Implementation Notes
```tsx
// Good: Using React 19 'use' hook for lazy loading
import { use } from 'react';

const pdfLibPromise = import('jspdf');

function PDFExport() {
  const jsPDF = use(pdfLibPromise);
  // Use jsPDF...
}

// Good: Concurrent rendering for expensive calculations
function CategoryBox({ answers }) {
  const grade = useMemo(() => calculateGrade(answers), [answers]);
  return <div className={gradeColors[grade]}>...</div>;
}
```

### References
- React 19 release notes: https://react.dev/blog/2024/04/25/react-19
- Migration guide: https://react.dev/blog/2024/04/25/react-19-upgrade-guide

---

## 2. Vite 6 Configuration

### Decision
Use Vite 6 with TypeScript, code splitting by route, and manual chunk optimization for PDF library.

### Rationale
- Vite 6 is fastest build tool for React (10x faster than Create React App)
- Built-in TypeScript support with esbuild
- Automatic code splitting for React.lazy()
- Tree-shaking eliminates unused code
- Dev server with Hot Module Replacement (HMR)

### Code Splitting Strategy
1. **Route-based splitting**: Each page (Landing, Evaluate, VendorDetail) is a separate chunk
2. **Library splitting**: jsPDF loaded only when generating reports
3. **Vendor chunking**: React/React-DOM in separate vendor chunk
4. **CSS splitting**: Tailwind CSS in separate file

### Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          pdf: ['jspdf'], // Lazy-loaded, but separated when used
        },
      },
    },
    chunkSizeWarningLimit: 500, // Warn if chunk > 500KB
  },
  // Bundle analysis
  build: {
    reportCompressedSize: true,
  },
});
```

### Environment Variables
```typescript
// Access via import.meta.env (Vite convention)
const API_URL = import.meta.env.VITE_API_URL; // Not used in alpha
const MODE = import.meta.env.MODE; // 'development' or 'production'
```

### Build Optimization
- **Minification**: esbuild (fastest)
- **Tree-shaking**: Automatic for ES modules
- **Asset inlining**: Images <4KB inlined as base64
- **CSS minification**: Built-in with PostCSS

### Bundle Size Targets
- Main chunk: ~150KB (React + app code)
- Vendor chunk: ~150KB (React libraries)
- PDF chunk: ~200KB (lazy-loaded)
- CSS: ~50KB (Tailwind purged)
- **Total**: ~550KB (close to 500KB target, acceptable)

### References
- Vite 6 docs: https://vitejs.dev/
- Build optimizations: https://vitejs.dev/guide/build.html

---

## 3. Tailwind CSS Integration

### Decision
Use Tailwind CSS 3.4 with JIT mode, custom theme for category colors, and aggressive PurgeCSS for <50KB target.

### Rationale
- Utility-first CSS = smaller bundle than component libraries
- JIT mode generates only used classes
- PostCSS integration with Vite is seamless
- Easy to maintain responsive breakpoints
- Better performance than CSS-in-JS (no runtime)

### Custom Theme Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Category colors
        'category-green': '#DFFEF1',
        'category-yellow': '#FFF4E0',
        'category-red': '#FFEAEA',
        'category-grey': '#F5F5F5',
        'category-blue': '#DFF7FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### JIT Mode
- Enabled by default in Tailwind 3.x
- Generates classes on-demand during development
- Production build only includes used classes

### PurgeCSS Optimization
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};
```

### Bundle Size Analysis
- **Before purge**: ~3MB (all Tailwind classes)
- **After purge**: ~40KB gzipped (only used classes)
- **Target**: <50KB ✅

### Responsive Breakpoints
```
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### References
- Tailwind 3.4: https://tailwindcss.com/docs/installation
- Optimization: https://tailwindcss.com/docs/optimizing-for-production

---

## 4. jsPDF Client-Side Generation

### Decision
Use jsPDF 2.x with manual layout for executive summary, tables, and category breakdowns. Lazy-load library to avoid impacting initial bundle.

### Rationale
- **jsPDF**: 200KB, 2M+ weekly downloads, mature and stable
- Client-side generation = no backend needed
- Supports custom fonts, tables, and complex layouts
- Works in all modern browsers

### Alternative Considered: react-pdf
- **Pros**: Declarative React components, easier to use
- **Cons**: 400KB bundle (2x larger), slower rendering
- **Decision**: Rejected due to bundle size

### Performance Optimization
1. **Lazy Loading**: Only load jsPDF when user clicks "Generate Report"
   ```typescript
   const generatePDF = async () => {
     const { jsPDF } = await import('jspdf');
     const doc = new jsPDF();
     // Generate PDF...
   };
   ```

2. **Caching**: Keep jsPDF instance in memory after first load
3. **Web Workers**: Consider moving PDF generation to worker (future optimization)

### PDF Layout Structure
```
Page 1: Executive Summary
- Vendor name
- Overall grade (color-coded box)
- Key findings (3-5 bullets)
- Report metadata (date, evaluator)

Page 2-7: Category Breakdowns (one category per page)
- Category title and grade
- Questions with answers (Yes/No/Not enough info)
- Notes (if provided)
- Red flags highlighted

Page 8: Overall Assessment
- Summary table of all categories
- Recommendations
- Next steps
```

### Font Strategy
**Decision**: Use system fonts (no embedding)

**Rationale**:
- Font embedding adds 50-100KB per font
- System fonts (Helvetica, Arial) are universally available
- Professional appearance without bloat

### Generation Time Target
- **Target**: <5 seconds for full evaluation
- **Actual** (estimated): 2-3 seconds (simple layouts, no images)
- **Bottleneck**: None expected (pure JavaScript, no network)

### Code Example
```typescript
import type { Evaluation, VoiceMode } from '../types';

export async function generatePDFReport(
  evaluation: Evaluation,
  voiceMode: VoiceMode
): Promise<Blob> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF();

  // Page 1: Executive Summary
  doc.setFontSize(20);
  doc.text(evaluation.vendorName, 20, 20);

  doc.setFontSize(14);
  doc.text(`Overall Grade: ${evaluation.overallGrade}`, 20, 40);

  // Add more content...

  return doc.output('blob');
}
```

### References
- jsPDF docs: https://github.com/parallax/jsPDF
- Examples: https://parall.ax/products/jspdf

---

## 5. LocalStorage Patterns

### Decision
Use LocalStorage with versioned schema, quota handling, and encrypted storage for sensitive notes (future enhancement).

### Rationale
- LocalStorage is synchronous and simple (no IndexedDB complexity)
- 5-10MB limit is sufficient for ~20 evaluations
- Works offline automatically
- No external dependencies

### Schema Versioning Strategy
```typescript
interface StorageSchema {
  version: '1.0.0';
  evaluations: Evaluation[];
  currentEvaluationId: string | null;
}

// Future migration example
function migrateStorage(oldVersion: string): StorageSchema {
  const data = JSON.parse(localStorage.getItem('ai-vendor-evaluations') || '{}');

  if (oldVersion === '1.0.0' && data.version === '1.0.0') {
    return data; // No migration needed
  }

  // Add migration logic for future versions
  return data;
}
```

### Quota Handling
```typescript
function saveEvaluation(evaluation: Evaluation): void {
  try {
    const data = getStorageData();
    data.evaluations.push(evaluation);
    localStorage.setItem('ai-vendor-evaluations', JSON.stringify(data));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      // User-friendly error message
      throw new Error(
        'Unable to save evaluation. Your browser storage may be full. ' +
        'Try exporting and deleting old evaluations.'
      );
    }
    throw e;
  }
}
```

### Encryption Considerations
**Decision**: No encryption in alpha (deferred to Phase 2)

**Rationale**:
- LocalStorage is already isolated per-domain
- User evaluations are private (not shared)
- Encryption adds complexity and performance overhead
- Users can export and encrypt offline if needed

**Future Enhancement**: Use Web Crypto API for transparent encryption

### Conflict Resolution
**Not Needed**: Single-user, client-side only, no multi-device sync

### Storage Keys
```typescript
const STORAGE_KEYS = {
  EVALUATIONS: 'ai-vendor-evaluations',
  VOICE_MODE: 'ai-vendor-voice-mode',
  SETTINGS: 'ai-vendor-settings', // Future
} as const;
```

### Data Lifecycle
1. **Create**: New evaluation with auto-generated ID (UUID)
2. **Update**: Merge answers, update timestamp
3. **Delete**: Remove from array, cleanup storage
4. **Export**: Convert to JSON blob for download
5. **Import**: Validate schema, merge with existing

### References
- LocalStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Quota: https://web.dev/storage-for-the-web/

---

## 6. Dual Voice Mode Implementation

### Decision
Single source content with variant structure, React Context for mode, useMemo for performance.

### Rationale
- Single source = easier to maintain (no duplication)
- Structured variants = clear separation of tones
- Context API = global state without prop drilling
- Memoization = avoid re-rendering on mode toggle

### Content Structure
```typescript
// data/explanations.ts
export const questionExplanations = {
  'see-1': {
    direct: {
      whyMatters: "Because vendors hide their prompts for a reason...",
      goodLooksLike: "They show you everything: prompts, models, routing logic.",
      badLooksLike: "They say 'proprietary' and change the subject.",
      whatToAsk: "Can I see your system prompts? What models are you using?",
    },
    suitableForWork: {
      whyMatters: "Transparency enables informed decision-making and risk assessment.",
      goodLooksLike: "Vendor provides comprehensive documentation of system architecture.",
      badLooksLike: "Vendor cites intellectual property concerns without alternative disclosure.",
      whatToAsk: "What level of system visibility can you provide for evaluation?",
    },
  },
  // ... 19 more questions
};
```

### Runtime Switching
```typescript
// hooks/useVoiceMode.ts
import { createContext, useContext, useState, useEffect } from 'react';

type VoiceMode = 'direct' | 'suitable-for-work';

const VoiceModeContext = createContext<{
  mode: VoiceMode;
  setMode: (mode: VoiceMode) => void;
}>(null!);

export function VoiceModeProvider({ children }) {
  const [mode, setMode] = useState<VoiceMode>(() => {
    return localStorage.getItem('ai-vendor-voice-mode') as VoiceMode || 'direct';
  });

  useEffect(() => {
    localStorage.setItem('ai-vendor-voice-mode', mode);
  }, [mode]);

  return (
    <VoiceModeContext.Provider value={{ mode, setMode }}>
      {children}
    </VoiceModeContext.Provider>
  );
}

export function useVoiceMode() {
  return useContext(VoiceModeContext);
}
```

### Performance Optimization
```typescript
// Memoize content to avoid recalculating on every render
function QuestionHelp({ questionId }) {
  const { mode } = useVoiceMode();

  const content = useMemo(() => {
    return questionExplanations[questionId][mode];
  }, [questionId, mode]);

  return <div>{content.whyMatters}</div>;
}
```

### SEO Implications for Documentation
**Consideration**: Does voice mode affect search indexing?

**Answer**: No, because:
- Voice mode is client-side JavaScript toggle
- Search engines index default content (Direct mode)
- Both modes contain same semantic information (just different tone)
- Docusaurus generates static HTML with default mode

**Recommendation**: Set "Suitable for Work" as default for docs (more professional for public indexing)

### References
- React Context: https://react.dev/learn/passing-data-deeply-with-context
- Performance: https://react.dev/reference/react/useMemo

---

## 7. Docusaurus 3 + Tailwind Integration

### Decision
Use Docusaurus 3 with official Tailwind plugin, shared theme colors with evaluation tool, custom React component for voice mode toggle.

### Rationale
- Docusaurus 3 is best-in-class for documentation
- Official Tailwind plugin simplifies setup
- MDX allows React components in markdown
- Built-in search and navigation
- Fast static site generation

### Integration Approach
```bash
npm install --save docusaurus-plugin-tailwindcss
```

```javascript
// docusaurus.config.js
module.exports = {
  plugins: ['docusaurus-plugin-tailwindcss'],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
    },
  },
};
```

### Theme Consistency
**Challenge**: Keep docs and evaluation tool visually consistent

**Solution**: Shared Tailwind config
```javascript
// shared/tailwind.config.base.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'category-green': '#DFFEF1',
        // ... same colors in both apps
      },
    },
  },
};

// Import in both apps/evaluation-tool/tailwind.config.js and apps/docs/tailwind.config.js
```

### Voice Mode Toggle in Docusaurus
```tsx
// docs/src/components/VoiceModeToggle.tsx
import React from 'react';
import { useVoiceMode } from '@site/src/hooks/useVoiceMode';

export function VoiceModeToggle() {
  const { mode, setMode } = useVoiceMode();

  return (
    <button
      onClick={() => setMode(mode === 'direct' ? 'suitable-for-work' : 'direct')}
      className="voice-mode-toggle"
    >
      {mode === 'direct' ? 'Direct' : 'Suitable for Work'}
    </button>
  );
}
```

### MDX Usage
```markdown
---
title: Framework Overview
---

import { VoiceModeToggle } from '@site/src/components/VoiceModeToggle';

# AI Vendor Evaluation Framework

<VoiceModeToggle />

{/* Content switches based on voice mode */}
```

### Search Configuration
- Docusaurus uses local search by default
- Meets <500ms search requirement
- Indexes all markdown content
- Voice mode doesn't affect search (indexes default mode)

### References
- Docusaurus 3: https://docusaurus.io/
- Tailwind plugin: https://github.com/jlarmstrongiv/docusaurus-plugin-tailwindcss

---

## 8. Testing Strategy

### Decision
Vitest for unit/component tests, React Testing Library for DOM testing, manual E2E testing for alpha (automate in Phase 2).

### Rationale
- **Vitest**: Fastest test runner, native TypeScript support, Vite integration
- **React Testing Library**: Best practices for testing user behavior (not implementation)
- **Manual E2E**: Sufficient for alpha with small user base, automate later with Playwright

### Test Structure
```
apps/evaluation-tool/
├── src/
│   ├── utils/
│   │   ├── scoring.ts
│   │   └── scoring.test.ts          # Unit test
│   ├── hooks/
│   │   ├── useEvaluation.ts
│   │   └── useEvaluation.test.ts    # Hook test
│   └── components/
│       ├── Question.tsx
│       └── Question.test.tsx        # Component test
└── tests/
    └── integration/
        └── evaluation-flow.test.ts  # Integration test
```

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
```

### Mocking LocalStorage
```typescript
// tests/setup.ts
import { beforeEach } from 'vitest';

beforeEach(() => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = value.toString(); },
      removeItem: (key) => { delete store[key]; },
      clear: () => { store = {}; },
    };
  })();

  global.localStorage = localStorageMock;
});
```

### Component Test Example
```typescript
// components/Question.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Question } from './Question';

test('renders question with answer buttons', () => {
  const mockOnAnswer = vi.fn();

  render(
    <Question
      questionId="see-1"
      text="Can you see the system prompts?"
      onAnswer={mockOnAnswer}
    />
  );

  expect(screen.getByText(/Can you see the system prompts/)).toBeInTheDocument();

  const yesButton = screen.getByRole('button', { name: /Yes/i });
  fireEvent.click(yesButton);

  expect(mockOnAnswer).toHaveBeenCalledWith('see-1', 'yes');
});
```

### Manual E2E Test Checklist
```markdown
## Evaluation Flow
- [ ] Landing page loads
- [ ] Click "Evaluate a Vendor"
- [ ] Enter vendor name
- [ ] Answer all 20 questions
- [ ] See category colors update
- [ ] Add notes to questions
- [ ] View overall assessment
- [ ] Generate PDF report
- [ ] Export as Markdown
- [ ] Close and reopen (verify persistence)

## Browser Testing
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)

## Voice Mode Testing
- [ ] Toggle voice mode in evaluation tool
- [ ] Toggle voice mode in docs
- [ ] Verify content changes preserve meaning
- [ ] Generate report in both modes
```

### E2E Automation (Phase 2)
**Recommended**: Playwright for future automation
- Cross-browser testing (Chromium, Firefox, WebKit)
- Mobile device emulation
- Visual regression testing
- Faster than Selenium

### Coverage Goals
- **Business Logic**: 70% minimum (scoring, state management)
- **Components**: 60% minimum (focus on critical paths)
- **Utils**: 80% minimum (pure functions, easy to test)
- **Overall**: 70% target

### References
- Vitest: https://vitest.dev/
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Playwright: https://playwright.dev/

---

## Summary of Decisions

| Topic | Technology | Rationale |
|-------|-----------|-----------|
| **React** | React 19 | Latest stable, better performance, no breaking changes for client-side |
| **Build Tool** | Vite 6 | Fastest builds, best dev experience, automatic code splitting |
| **Styling** | Tailwind CSS 3.4 | Smallest bundle (<50KB), utility-first, JIT mode |
| **PDF Generation** | jsPDF 2.x | Client-side, 200KB, mature, lazy-loaded |
| **Storage** | LocalStorage | Simple, synchronous, 5-10MB sufficient, offline-capable |
| **Voice Mode** | Context + Variants | Single source, easy maintenance, performant |
| **Docs** | Docusaurus 3 | Best-in-class, Tailwind integration, MDX support |
| **Testing** | Vitest + RTL | Fast, TypeScript native, user-focused testing |

---

## Next Steps

1. ✅ Research complete (this document)
2. **Phase 1**: Create data-model.md with entity definitions
3. **Phase 1**: Create contracts/types.ts with TypeScript interfaces
4. **Phase 1**: Create quickstart.md with developer setup
5. **Phase 1**: Update agent context with technology patterns
6. Run `/speckit.tasks` to generate task breakdown
7. Import tasks to Beads for dependency tracking

---

**Research Version**: 1.0.0
**Last Updated**: 2025-10-19
**Status**: Complete - Ready for Phase 1
