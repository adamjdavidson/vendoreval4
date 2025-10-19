# Technical Specification

## Tech Stack Overview

This project consists of two main applications:
1. **Documentation Site**: Static documentation built with Docusaurus
2. **Evaluation Tool**: Interactive React application built with Vite

Both can be deployed independently but will be integrated through routing and shared styling.

---

## Evaluation Tool (Interactive App)

### Core Stack

**Framework & Build Tool**
- **React 19** - Latest stable version
- **Vite 6.x** - Fast build tool and dev server
- **TypeScript** - Type safety (optional but recommended)
- **React Router 7.x** - Client-side routing

**Styling**
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **PostCSS** - CSS processing (included with Tailwind)

**UI Components**
- **Lucide React** - Icon library (lightweight, tree-shakeable)
- **Headless UI** (optional) - Unstyled accessible components for modals

**PDF Generation**
- **jsPDF 2.x** - Client-side PDF generation
- **jsPDF-AutoTable** (optional) - For structured table content in PDFs

**Data & State**
- **React Hooks** - useState, useEffect, useContext for state management
- **LocalStorage** - Client-side persistence (no backend needed)
- **Context API** - For global state if needed (voice mode, current evaluation)

**Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vite PWA Plugin** (future) - For offline capability

---

## Documentation Site

### Core Stack

**Framework**
- **Docusaurus 3.x** - Static site generator for documentation
- **React** - Powers Docusaurus components
- **MDX** - Markdown + JSX for rich content

**Styling**
- **Tailwind CSS** - Integrated with Docusaurus
- **Custom CSS** - For Docusaurus theme customization

---

## Project Structure

```
ai-vendor-framework/
├── apps/
│   ├── evaluation-tool/           # Vite React app
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── landing/
│   │   │   │   │   ├── LandingPage.tsx
│   │   │   │   │   ├── HeroSection.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   └── VendorSection.tsx
│   │   │   │   ├── evaluation/
│   │   │   │   │   ├── EvaluationTool.tsx
│   │   │   │   │   ├── CategoryBox.tsx
│   │   │   │   │   ├── Question.tsx
│   │   │   │   │   ├── HelpModal.tsx
│   │   │   │   │   ├── NotesField.tsx
│   │   │   │   │   └── OverallAssessment.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   ├── ReportGenerator.tsx
│   │   │   │   │   ├── PDFExport.tsx
│   │   │   │   │   └── MarkdownExport.tsx
│   │   │   │   └── shared/
│   │   │   │       ├── Button.tsx
│   │   │   │       ├── Modal.tsx
│   │   │   │       └── VoiceToggle.tsx
│   │   │   ├── pages/
│   │   │   │   ├── Landing.tsx
│   │   │   │   ├── Evaluate.tsx
│   │   │   │   └── VendorDetail.tsx
│   │   │   ├── data/
│   │   │   │   ├── questions.ts
│   │   │   │   ├── explanations.ts
│   │   │   │   ├── vendors.ts
│   │   │   │   └── scoringLogic.ts
│   │   │   ├── utils/
│   │   │   │   ├── scoring.ts
│   │   │   │   ├── storage.ts
│   │   │   │   ├── export.ts
│   │   │   │   └── reportGenerator.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useEvaluation.ts
│   │   │   │   ├── useLocalStorage.ts
│   │   │   │   └── useVoiceMode.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   └── tsconfig.json
│   │
│   └── docs/                      # Docusaurus site
│       ├── docs/
│       │   ├── framework/
│       │   │   ├── why-different.md
│       │   │   ├── see.md
│       │   │   ├── change.md
│       │   │   ├── use.md
│       │   │   ├── adapt.md
│       │   │   ├── leave.md
│       │   │   └── learn.md
│       │   ├── maturity-model/
│       │   │   ├── overview.md
│       │   │   ├── level-1.md
│       │   │   ├── level-2.md
│       │   │   ├── level-3.md
│       │   │   └── level-4.md
│       │   ├── using-tool/
│       │   │   ├── walkthrough.md
│       │   │   ├── questions-explained.md
│       │   │   └── red-flags.md
│       │   └── vendors/
│       │       └── glean.md
│       ├── src/
│       │   ├── components/
│       │   ├── css/
│       │   └── pages/
│       ├── static/
│       ├── docusaurus.config.js
│       ├── sidebars.js
│       └── package.json
│
└── shared/                        # Shared utilities/types
    └── types/
        └── evaluation.ts
```

---

## Installation & Setup

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Evaluation Tool Setup

```bash
# Navigate to evaluation tool
cd apps/evaluation-tool

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Documentation Site Setup

```bash
# Navigate to docs
cd apps/docs

# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build

# Serve production build
npm run serve
```

---

## Key Dependencies

### Evaluation Tool (package.json)

```json
{
  "name": "ai-vendor-evaluation-tool",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "lucide-react": "^0.460.0",
    "jspdf": "^2.5.2",
    "jspdf-autotable": "^3.8.4"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "prettier": "^3.4.0"
  }
}
```

### Documentation Site (package.json)

```json
{
  "name": "ai-vendor-docs",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "docusaurus": "docusaurus",
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy",
    "clear": "docusaurus clear",
    "serve": "docusaurus serve",
    "write-translations": "docusaurus write-translations",
    "write-heading-ids": "docusaurus write-heading-ids"
  },
  "dependencies": {
    "@docusaurus/core": "^3.6.0",
    "@docusaurus/preset-classic": "^3.6.0",
    "@mdx-js/react": "^3.0.0",
    "clsx": "^2.0.0",
    "prism-react-renderer": "^2.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@docusaurus/module-type-aliases": "^3.6.0",
    "@docusaurus/tsconfig": "^3.6.0",
    "@docusaurus/types": "^3.6.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## Configuration Files

### Vite Configuration (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@data': path.resolve(__dirname, './src/data'),
      '@types': path.resolve(__dirname, './src/types'),
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable']
        }
      }
    }
  }
})
```

### Tailwind Configuration (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Category colors
        'category-see': '#DFF7FF',
        'category-change': '#DFFEF1',
        'category-use': '#FFF4E0',
        'category-adapt': '#F1D2FE',
        'category-leave': '#FFE8E8',
        'category-learn': '#E8F5E9',
        
        // Status colors
        'status-green': '#10B981',
        'status-yellow': '#F59E0B',
        'status-red': '#EF4444',
        'status-grey': '#9CA3AF',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        // 4px base unit
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
      },
    },
  },
  plugins: [],
}
```

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@data/*": ["./src/data/*"],
      "@types/*": ["./src/types/*"]
    }
  },
  "include": ["src"]
}
```

### Docusaurus Configuration (docusaurus.config.js)

```javascript
import {themes as prismThemes} from 'prism-react-renderer';

const config = {
  title: 'AI Vendor Evaluation Framework',
  tagline: 'Stop buying black boxes',
  favicon: 'img/favicon.ico',

  url: 'https://ai-vendor-framework.com',
  baseUrl: '/',

  organizationName: 'feedforward',
  projectName: 'ai-vendor-framework',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/feedforward/ai-vendor-framework/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'AI Vendor Framework',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'frameworkSidebar',
          position: 'left',
          label: 'Framework',
        },
        {
          to: '/evaluate',
          label: 'Evaluate',
          position: 'left',
        },
        {
          to: '/vendors',
          label: 'Vendors',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Framework',
              to: '/docs/framework/why-different',
            },
            {
              label: 'Using the Tool',
              to: '/docs/using-tool/walkthrough',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Feedforward. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },

  plugins: [
    async function tailwindPlugin(context, options) {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      };
    },
  ],
};

export default config;
```

---

## Data Structures & Types

### Core Types (src/types/index.ts)

```typescript
export type AnswerValue = 'yes' | 'no' | 'not-enough-info' | null;

export type VoiceMode = 'direct' | 'suitable-for-work';

export type CategoryKey = 'see' | 'change' | 'use' | 'adapt' | 'leave' | 'learn';

export type CategoryGrade = 'green' | 'yellow' | 'red' | 'grey' | null;

export interface Question {
  id: string;
  categoryKey: CategoryKey;
  text: string;
  isCritical: boolean;  // For red-flag logic
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
  color: string;  // Tailwind color class
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

export interface QuestionExplanation {
  questionId: string;
  direct: {
    whyMatters: string;
    goodLooksLike: string;
    badLooksLike: string;
    whatToAsk: string;
  };
  suitableForWork: {
    whyMatters: string;
    goodLooksLike: string;
    badLooksLike: string;
    whatToAsk: string;
  };
}

export interface VendorAnalysis {
  vendorName: string;
  logoUrl: string;
  completedAt: string;
  answers: Answer[];
  categoryGrades: Record<CategoryKey, CategoryGrade>;
  overallGrade: CategoryGrade;
  summary: string;
  redFlags: string[];
}
```

---

## State Management Strategy

### LocalStorage Schema

```typescript
// Key: 'ai-vendor-evaluations'
{
  currentEvaluationId: string | null,
  voiceMode: VoiceMode,
  evaluations: Evaluation[]
}
```

### Global State (Context API)

```typescript
// VoiceModeContext
{
  voiceMode: VoiceMode,
  setVoiceMode: (mode: VoiceMode) => void
}

// EvaluationContext
{
  currentEvaluation: Evaluation | null,
  setCurrentEvaluation: (eval: Evaluation) => void,
  saveAnswer: (answer: Answer) => void,
  loadEvaluation: (id: string) => void,
  exportEvaluation: (format: 'json' | 'pdf' | 'markdown') => void
}
```

---

## Routing Structure

```
/                           → Landing page
/evaluate                   → New evaluation
/evaluate/:id               → Resume evaluation
/vendors                    → List of pre-analyzed vendors
/vendors/:vendorName        → Specific vendor analysis
/framework/*                → Docusaurus docs (integrated)
```

---

## Performance Considerations

### Code Splitting
- Route-based splitting (React.lazy)
- Vendor chunking (React, PDF libs separate)
- Dynamic imports for heavy components

### Optimization
- Lazy load PDF library only when generating reports
- Debounce LocalStorage writes
- Memoize expensive calculations (scoring)
- Virtual scrolling if vendor list grows large

### Bundle Size Targets
- Initial JS: < 200KB (gzipped)
- Total JS: < 500KB (gzipped)
- CSS: < 50KB (gzipped)

---

## Browser Support

**Target Browsers:**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- iOS Safari: Last 2 versions

**Required Features:**
- LocalStorage
- ES2020
- CSS Grid & Flexbox
- CSS Custom Properties

---

## Deployment

### Evaluation Tool
**Recommended Platform:** Vercel, Netlify, or Cloudflare Pages
- Static build output
- Auto-deployments from Git
- Zero config needed

**Build Command:** `npm run build`
**Output Directory:** `dist`

### Documentation Site
**Recommended Platform:** Vercel, Netlify, GitHub Pages
- Static HTML output
- Built-in search
- Versioning support

**Build Command:** `npm run build`
**Output Directory:** `build`

---

## Environment Variables

### Evaluation Tool (.env)
```
VITE_APP_TITLE=AI Vendor Evaluation Framework
VITE_API_URL=https://api.example.com (future)
```

### Documentation Site (.env)
```
DOCUSAURUS_URL=https://ai-vendor-framework.com
DOCUSAURUS_BASE_URL=/
```

---

## Testing Strategy (Future)

### Unit Tests
- **Framework:** Vitest
- **Coverage:** Utils, scoring logic, data transformations
- **Target:** 80%+ coverage on business logic

### Component Tests
- **Framework:** React Testing Library
- **Coverage:** Interactive components, forms, modals
- **Target:** All user interactions tested

### E2E Tests
- **Framework:** Playwright
- **Coverage:** Critical user flows
  - Complete an evaluation
  - Generate a report
  - Load saved evaluation

---

## Security Considerations

**Client-Side Only (No Backend)**
- All data stored in browser LocalStorage
- No server-side vulnerabilities
- User responsible for their own data

**Future Backend Considerations:**
- CORS configuration
- Rate limiting
- Input sanitization
- Authentication/Authorization

---

## Accessibility Requirements

**WCAG 2.1 AA Compliance**
- Color contrast ratios meet standards
- Keyboard navigation for all interactions
- Screen reader compatibility
- Focus indicators visible
- Semantic HTML
- ARIA labels where needed

**Testing Tools:**
- axe DevTools
- Lighthouse accessibility audit
- Manual keyboard navigation testing

---

## Development Workflow

### Getting Started
1. Clone repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open `http://localhost:3000`

### Making Changes
1. Create feature branch
2. Make changes
3. Test locally
4. Format code: `npm run format`
5. Lint code: `npm run lint`
6. Commit and push

### Code Style
- **Formatting:** Prettier (automatic)
- **Linting:** ESLint rules
- **Naming:** 
  - Components: PascalCase
  - Utilities: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Files: Match export (PascalCase for components, camelCase for utils)

---

## Known Limitations

1. **LocalStorage Size:** 5-10MB limit (sufficient for dozens of evaluations)
2. **No Backend:** Cannot sync across devices or share evaluations
3. **PDF Generation:** Client-side only, large reports may be slow
4. **No Offline Mode:** Requires internet for initial load (PWA future)
5. **Browser Dependency:** Must support modern JavaScript features

---

## Future Enhancements

### Phase 2 (Post-Alpha)
- EXA/deep research integration for automated analysis
- Multi-vendor comparison view
- Export to PowerPoint/Slides
- Improved PDF styling and branding

### Phase 3 (Long-term)
- Backend API for data persistence
- User authentication
- Collaboration features (team evaluations)
- API for programmatic access
- Mobile apps (React Native)
- Advanced analytics and insights

---

## Questions & Support

**For Claude Code:** This spec should provide everything needed to build the application. If anything is unclear or needs more detail, please ask specific questions about:
- Implementation details
- Component behavior
- Data flow
- Integration points

**Key Files to Create First:**
1. Project setup (Vite + React)
2. Tailwind configuration
3. Type definitions
4. Data files (questions, explanations)
5. Core components (CategoryBox, Question)
6. Scoring logic
7. Storage utilities

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-15  
**Verified Against:** React 19, Vite 6, Tailwind 3.4, Docusaurus 3.6