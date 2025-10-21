# VendorEval Technical Documentation

## Architecture Overview

VendorEval is a modern web application built with React, TypeScript, and Supabase, deployed on Vercel.

**Version**: v0.1.0-alpha
**Repository**: https://github.com/adamjdavidson/vendoreval4
**Production URL**: https://vendoreval3.vercel.app

---

## Technology Stack

### Frontend

- **React 18** - UI framework
- **TypeScript 5.9** - Type safety and tooling
- **Vite 7.1** - Build tool and dev server
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Lucide React** - Icon library
- **jsPDF** - PDF generation

### Backend & Database

- **Supabase** - Backend-as-a-Service (currently connected but not used in alpha)
  - PostgreSQL database
  - Authentication service (disabled in test mode)
  - Real-time subscriptions (planned)

### Deployment

- **Vercel** - Hosting and continuous deployment
- **GitHub** - Version control and source repository

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **Playwright** - End-to-end testing

---

## Project Structure

```
vendoreval3/
├── apps/
│   └── evaluation-tool/          # Main application
│       ├── src/
│       │   ├── components/       # React components
│       │   │   └── evaluation/   # Evaluation-specific components
│       │   ├── config/           # App configuration
│       │   ├── contexts/         # React contexts (Auth, etc.)
│       │   ├── hooks/            # Custom React hooks
│       │   ├── pages/            # Page components
│       │   ├── services/         # Business logic and API clients
│       │   ├── types/            # TypeScript type definitions
│       │   └── utils/            # Utility functions
│       ├── public/               # Static assets
│       ├── dist/                 # Build output
│       └── tests/                # Test files
├── shared/
│   └── types/                    # Shared TypeScript types
│       └── index.ts              # Type definitions used across apps
├── supabase/
│   └── migrations/               # Database migrations (11 migrations)
├── docs/                         # Documentation
├── scripts/                      # Helper scripts
├── .beads/                       # Beads issue tracking
├── .specify/                     # SpecKit workflow
├── specs/                        # Feature specifications
└── vercel.json                   # Vercel deployment config
```

---

## Key Components

### Application Entry Points

**`src/main.tsx`**
- Application entry point
- Renders React app into DOM
- Sets up global providers

**`src/App.tsx`**
- Root component
- Routing configuration
- Layout structure

### Pages

**`src/pages/Landing.tsx`**
- Landing page with "Start New Evaluation" CTA
- Lists past evaluations (from local storage)
- Provides navigation to evaluation flow

**`src/pages/Evaluate.tsx`**
- Main evaluation interface
- Manages evaluation state
- Renders category navigation and questions
- Handles answer submission

### Core Components

**`src/components/evaluation/Question.tsx`**
- Individual question display
- Answer button group
- Notes input field
- Voice mode integration

**`src/components/evaluation/AnswerButtons.tsx`**
- Excellent / Good / Fair / Poor / N/A buttons
- Visual feedback for selected answer
- Keyboard shortcuts

**`src/components/evaluation/CategoryBox.tsx`**
- Category navigation
- Progress indicator
- Grade display (when category complete)

**`src/components/evaluation/OverallAssessment.tsx`**
- Final assessment form
- Overall grade selection (A-F)
- Summary notes and recommendation

**`src/components/evaluation/ExportButton.tsx`**
- PDF generation
- Formats evaluation data for export
- Handles download

**`src/components/evaluation/EvaluationList.tsx`**
- Displays past evaluations
- Provides access to completed assessments

### Contexts

**`src/contexts/AuthContext.tsx`**
- Authentication state management
- Test mode vs. production mode handling
- User session management

### Hooks

**`src/hooks/useVoiceMode.tsx`**
- Web Speech API integration
- Voice command interpretation
- Transcription and command mapping

**`src/hooks/useLocalStorage.ts`**
- Persistent state management
- Browser local storage wrapper
- Type-safe storage operations

### Services

**`src/services/database.ts`**
- Supabase client configuration
- Database query functions
- CRUD operations for evaluations (not used in alpha)

**`src/services/auth.ts`**
- Authentication methods
- OAuth providers (Discord, GitHub, Email)
- Session management

**`src/services/evaluation.ts`**
- Evaluation business logic
- Data validation
- State transformations

### Utilities

**`src/utils/grading.ts`**
- Grade calculation logic
- Answer to score conversion
- Category grade determination

**`src/utils/export.ts`**
- PDF generation using jsPDF
- Formatting evaluation data
- Report layout and styling

**`src/utils/storage.ts`**
- Local storage helpers
- Evaluation persistence
- Data serialization/deserialization

### Configuration

**`src/config/app.config.ts`**
- Application-wide configuration
- Feature flags (test mode, etc.)
- Environment-agnostic settings

---

## Data Models

### Type Definitions

Located in `shared/types/index.ts`:

```typescript
// Answer values for questions
type AnswerValue = 'excellent' | 'good' | 'fair' | 'poor' | 'n/a';

// Voice mode state
type VoiceMode = 'idle' | 'listening' | 'processing';

// Evaluation categories
type CategoryKey =
  | 'search_discovery'
  | 'content_quality'
  | 'user_experience'
  | 'integration_workflow'
  | 'performance_reliability'
  | 'value_roi';

// Category grades (calculated)
type CategoryGrade = 'A' | 'B' | 'C' | 'D' | 'F' | null;

// Question structure
interface Question {
  id: string;
  category: CategoryKey;
  text: string;
  weight: number;
}

// Answer structure
interface Answer {
  question_id: string;
  answer: AnswerValue;
  notes?: string;
}

// Evaluation structure
interface Evaluation {
  id: string;
  vendor_name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  answers: Answer[];
  overall_grade?: string;
  overall_notes?: string;
  status: 'in_progress' | 'completed';
}

// Category metadata
interface Category {
  id: CategoryKey;
  name: string;
  description: string;
  icon: string;
}
```

### Database Schema

Located in `supabase/migrations/`:

**Categories Table**
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL
);
```

**Questions Table**
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT REFERENCES categories(id),
  question_text TEXT NOT NULL,
  weight DECIMAL DEFAULT 1.0,
  display_order INTEGER NOT NULL
);
```

**Evaluations Table**
```sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  overall_grade TEXT,
  overall_notes TEXT,
  status TEXT DEFAULT 'in_progress'
);
```

**Answers Table**
```sql
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  answer TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Configuration

### TypeScript Configuration

**`tsconfig.app.json`**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "verbatimModuleSyntax": true,
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["../../shared/*"]
    }
  },
  "include": ["src", "../../shared"]
}
```

**Key settings:**
- `verbatimModuleSyntax: true` - Strict module syntax checking
- Path aliases for monorepo structure
- Includes shared types directory

### Vite Configuration

**`vite.config.ts`**
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared'),
    },
  },
});
```

Mirrors TypeScript path aliases for runtime module resolution.

### Vercel Configuration

**Root `vercel.json`**
```json
{
  "buildCommand": "cd apps/evaluation-tool && npm run build",
  "installCommand": "cd apps/evaluation-tool && npm install",
  "outputDirectory": "apps/evaluation-tool/dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Key aspects:**
- Builds from repository root (monorepo support)
- Executes commands in app subdirectory
- SPA rewrite rules for client-side routing

### Environment Variables

**Development (`.env.local`)**
```
VITE_SUPABASE_URL=https://leicgzljnodyrdbbcgoq.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

**Production (Vercel)**
- Same variables configured in Vercel dashboard
- Not currently used due to test mode

### App Configuration

**`src/config/app.config.ts`**
```typescript
export const APP_CONFIG = {
  ENABLE_TEST_MODE: true,  // Set to false for production
  ANONYMOUS_USER: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'anonymous@vendoreval.app',
  },
};
```

**Toggle test mode:**
1. Change `ENABLE_TEST_MODE` to `false`
2. Commit and deploy
3. Authentication will be required

---

## Development Workflow

### Local Development

**Prerequisites:**
- Node.js 18+
- npm 9+

**Setup:**
```bash
# Clone repository
git clone https://github.com/adamjdavidson/vendoreval4.git
cd vendoreval3

# Install dependencies
cd apps/evaluation-tool
npm install

# Start dev server
npm run dev
```

**Available commands:**
```bash
npm run dev        # Start development server (port 5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm run test       # Run unit tests
npm run test:e2e   # Run Playwright tests
```

### Code Style

**ESLint Configuration:**
- React hooks rules
- TypeScript strict mode
- Import order enforcement

**Prettier Configuration:**
- 2-space indentation
- Single quotes
- Trailing commas
- 80 character line width

### Git Workflow

**Branch naming:**
- `NNN-feature-name` (e.g., `002-fullstack-platform`)

**Commit message format:**
```
<type>: <description>

<body>

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Pre-commit hooks:**
- ESLint checking
- Prettier formatting
- TypeScript compilation

---

## Deployment

### Vercel Deployment

**Automatic Deployment:**
- Connected to GitHub repository
- Deploys on push to tracked branch
- Preview deployments for PRs

**Manual Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

**Deployment process:**
1. Upload source files to Vercel
2. Install dependencies (`npm install`)
3. Run TypeScript build (`tsc -b`)
4. Run Vite build (`vite build`)
5. Deploy static files to CDN
6. Update production URL

### Environment Setup

**Vercel Environment Variables:**
- Set in Vercel dashboard
- Available at build time and runtime
- Prefix with `VITE_` for client-side access

**Current variables:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Build Output

**Production build generates:**
- `index.html` - SPA entry point
- `assets/index-[hash].js` - Application bundle
- `assets/index-[hash].css` - Styles
- `assets/[component]-[hash].js` - Code-split chunks

**Build optimizations:**
- Tree shaking
- Minification
- Code splitting
- Asset hashing for cache busting

---

## Testing

### Unit Tests (Vitest)

**Test files:** `*.test.ts`, `*.test.tsx`

**Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grading';

describe('calculateGrade', () => {
  it('should calculate correct grade for all excellent answers', () => {
    const answers = [
      { question_id: '1', answer: 'excellent' },
      { question_id: '2', answer: 'excellent' },
    ];
    expect(calculateGrade(answers)).toBe('A');
  });
});
```

**Run tests:**
```bash
npm run test
```

### End-to-End Tests (Playwright)

**Test files:** `tests/*.spec.ts`

**Example:**
```typescript
import { test, expect } from '@playwright/test';

test('complete evaluation flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Start New Evaluation');
  await page.fill('input[name="vendorName"]', 'Test Vendor');
  await page.click('text=Start Evaluation');
  // ... continue test
});
```

**Run E2E tests:**
```bash
npm run test:e2e
```

---

## Supabase Integration

### Database Setup

**Local development:**
```bash
# Install Supabase CLI
npm install -g supabase

# Link to cloud project
supabase link --project-ref leicgzljnodyrdbbcgoq

# Pull latest migrations
supabase db pull

# Apply migrations locally
supabase db push
```

**Cloud project:**
- URL: https://leicgzljnodyrdbbcgoq.supabase.co
- Database: PostgreSQL 15
- 11 migrations applied
- Seeded with default categories and questions

### Authentication

**Configured providers:**
- Discord OAuth
- GitHub OAuth
- Email magic links

**Currently disabled** in test mode via `APP_CONFIG.ENABLE_TEST_MODE`.

**To enable authentication:**
1. Set `ENABLE_TEST_MODE: false` in `app.config.ts`
2. Configure OAuth apps in Supabase dashboard
3. Set callback URLs
4. Deploy

---

## Feature Flags

### Test Mode

**Location:** `src/config/app.config.ts`

**Purpose:**
- Allow anonymous access during alpha testing
- Bypass authentication requirements
- Store data locally instead of database

**Implementation:**
```typescript
if (APP_CONFIG.ENABLE_TEST_MODE) {
  // Use anonymous user
  setUser(anonymousUser);
} else {
  // Use real Supabase authentication
  authService.getSession();
}
```

**Migration to production:**
1. Change `ENABLE_TEST_MODE: true` → `false`
2. Verify authentication providers configured
3. Test authentication flow
4. Commit and deploy

---

## Performance Considerations

### Bundle Size

**Current production build:**
- Main bundle: ~368 KB (gzipped: ~110 KB)
- CSS: ~30 KB (gzipped: ~6 KB)
- Total initial load: ~400 KB

**Code splitting:**
- Page components lazy-loaded
- Vendor chunks separated
- Dynamic imports for heavy dependencies

### Optimization Strategies

**Implemented:**
- Vite tree-shaking
- Minification (Terser)
- Asset compression
- Cache headers via Vercel CDN

**Future improvements:**
- Image optimization
- Component-level code splitting
- Service worker for offline support
- Database query optimization

---

## Security

### Current Security Posture (Alpha)

**No authentication:**
- Anonymous access allowed
- Data stored client-side only
- No sensitive user data collected

**XSS Protection:**
- React escapes user input by default
- No `dangerouslySetInnerHTML` usage

**CSRF Protection:**
- Not applicable (no server mutations in alpha)

### Production Security Requirements

**When authentication is enabled:**

1. **Authentication & Authorization**
   - Implement Supabase Row Level Security (RLS)
   - Verify user identity on all database operations
   - Validate tokens server-side

2. **Data Protection**
   - Encrypt sensitive data at rest
   - Use HTTPS for all connections
   - Secure environment variables

3. **Input Validation**
   - Sanitize all user inputs
   - Validate data types and ranges
   - Prevent SQL injection (use parameterized queries)

4. **Access Control**
   - Users can only access their own evaluations
   - Role-based permissions for team features
   - Audit logging for sensitive operations

---

## Monitoring and Observability

### Current Monitoring (Alpha)

**Vercel Analytics:**
- Deployment status
- Build logs
- Error tracking

**Browser DevTools:**
- Console errors
- Network requests
- Performance metrics

### Future Monitoring

**Planned:**
- Application performance monitoring (APM)
- Error tracking (Sentry)
- User analytics
- Database query performance

---

## Troubleshooting

### Common Development Issues

**Issue: TypeScript can't find `@shared/types`**
```bash
# Verify tsconfig includes shared directory
cat tsconfig.app.json | grep include

# Should show: "include": ["src", "../../shared"]
```

**Issue: Vite dev server CORS errors**
```bash
# Check Supabase URL in .env.local
# Verify VITE_ prefix on environment variables
```

**Issue: Build fails with path alias errors**
```bash
# Ensure vite.config.ts has matching aliases
# Check that shared/types/index.ts exists
```

### Common Deployment Issues

**Issue: Vercel build fails with module not found**
- Verify `vercel.json` builds from repository root
- Check that `shared/` directory is in git
- Ensure `installCommand` runs in correct directory

**Issue: Environment variables not working**
- Check Vercel dashboard for variable configuration
- Verify `VITE_` prefix for client-side variables
- Redeploy after changing variables

**Issue: 404 on page refresh**
- Verify `rewrites` configuration in `vercel.json`
- Ensure SPA routing is properly configured

---

## API Reference

### Local Storage API

**`storage.ts`**

```typescript
// Save evaluation
saveEvaluation(evaluation: Evaluation): void

// Load evaluation by ID
loadEvaluation(id: string): Evaluation | null

// Load all evaluations
loadAllEvaluations(): Evaluation[]

// Delete evaluation
deleteEvaluation(id: string): void
```

### Grading API

**`grading.ts`**

```typescript
// Calculate category grade from answers
calculateCategoryGrade(
  answers: Answer[],
  category: CategoryKey
): CategoryGrade

// Convert answer to numeric score
answerToScore(answer: AnswerValue): number

// Get grade letter from percentage
percentageToGrade(percentage: number): CategoryGrade
```

### Export API

**`export.ts`**

```typescript
// Generate PDF from evaluation
exportToPDF(evaluation: Evaluation): void

// Format evaluation data for export
formatEvaluationData(evaluation: Evaluation): FormattedData
```

---

## Roadmap

### Planned Features

**v0.2.0 - Authentication & Cloud Storage**
- Enable Supabase authentication
- Migrate to cloud storage
- User account management

**v0.3.0 - Team Collaboration**
- Share evaluations with team members
- Comment and discussion threads
- Team workspaces

**v0.4.0 - Comparison & Analytics**
- Side-by-side vendor comparison
- Historical trend analysis
- Decision-making dashboard

**v0.5.0 - Customization**
- Custom question sets
- Configurable categories
- Weighted scoring models

**v1.0.0 - Production Release**
- Enterprise authentication (SSO)
- Advanced reporting
- API access
- Mobile applications

---

## Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make changes following code style
4. Run tests and linting
5. Commit with descriptive message
6. Push and create pull request

### Code Review Process

- All changes require review
- Tests must pass
- No linting errors
- TypeScript strict mode compliance
- Documentation updates for new features

---

## Support and Contact

### Issues and Bugs

- Report via GitHub Issues
- Include reproduction steps
- Provide browser and version info
- Share console error messages

### Feature Requests

- Open GitHub Discussion
- Describe use case and benefit
- Suggest implementation approach

---

## License

*To be determined*

---

## Appendix

### Full Dependency List

**Production Dependencies:**
```json
{
  "@supabase/supabase-js": "^2.48.1",
  "jspdf": "^2.5.2",
  "lucide-react": "^0.468.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.0.2"
}
```

**Development Dependencies:**
```json
{
  "@eslint/js": "^9.18.0",
  "@playwright/test": "^1.49.1",
  "@tailwindcss/vite": "^4.0.0-beta.7",
  "@types/react": "^19.0.6",
  "@types/react-dom": "^19.0.2",
  "@vitejs/plugin-react-swc": "^3.7.2",
  "eslint": "^9.18.0",
  "eslint-plugin-react-hooks": "^5.1.0",
  "eslint-plugin-react-refresh": "^0.4.16",
  "prettier": "^3.4.2",
  "tailwindcss": "^4.0.0-beta.7",
  "typescript": "~5.9.0",
  "typescript-eslint": "^8.18.2",
  "vite": "^7.1.10",
  "vitest": "^2.1.8"
}
```

### Database Seed Data

**6 Categories:**
1. Search & Discovery
2. Content Quality
3. User Experience
4. Integration & Workflow
5. Performance & Reliability
6. Value & ROI

**20 Questions** distributed across categories

**1 Sample Vendor:** Glean (for testing)

---

*Last Updated: October 21, 2025*
*Documentation Version: 1.0*
*Code Version: v0.1.0-alpha*
