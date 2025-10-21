# Phase 0: Research and Technology Verification

**Feature**: Full-Stack VendorEval Platform
**Branch**: `002-fullstack-platform`
**Date**: 2025-10-19
**Plan**: [plan.md](plan.md)

## Purpose

This document verifies all major technology choices using Context7 to ensure current best practices, compatible versions, and validated architecture patterns. Per user requirement (Option C), we verify technologies both upfront AND in each implementation task.

---

## Technology Stack Verification

### 1. Supabase (Backend Platform)

**Selected Version**: Supabase v2.x, @supabase/supabase-js v2.39+
**Purpose**: PostgreSQL database, authentication provider, Edge Functions hosting
**Context7 Verification**: ✅ Completed during planning phase

**Key Findings**:
- **Auth Provider**: Supabase Auth supports Discord OAuth 2.0 via built-in provider
- **Row Level Security**: PostgreSQL RLS enforces user data isolation at database level
- **Edge Functions**: Deno runtime, supports TypeScript natively
- **Client Library**: @supabase/supabase-js provides React hooks via @supabase/auth-helpers-react
- **Deployment**: Managed PostgreSQL, automatic backups, free tier: 500MB DB, 50K MAU

**Best Practices Identified**:
1. Use `createClient()` with environment variables for Supabase URL and anon key
2. RLS policies MUST be defined for all tables (default deny, explicit allow)
3. Edge Functions should validate JWT tokens using `createClient()` with service role key
4. Use `@supabase/auth-helpers-react` for React integration (AuthProvider, useUser, useSession)
5. Database types can be auto-generated using Supabase CLI: `supabase gen types typescript`

**Architecture Pattern**:
```typescript
// Client initialization (apps/evaluation-tool/src/lib/supabase.ts)
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Edge Function (supabase/functions/check-discord-membership/index.ts)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
  // Function logic
});
```

**Risks Mitigated**:
- Free tier limits: 500MB DB sufficient for ~10,000 evaluations, 50K MAU far exceeds Phase I target (100 users)
- RLS misconfiguration: Will write comprehensive tests for RLS policies
- Edge Function cold starts: < 1 second, acceptable for non-critical operations

---

### 2. Discord OAuth Integration

**Selected Library**: Discord.js v14.x (bot setup), Discord API v10 (OAuth + membership check)
**Purpose**: Authentication provider, server membership verification
**Context7 Verification**: ✅ Completed during planning phase

**Key Findings**:
- **OAuth Flow**: Supabase Auth handles OAuth flow, returns Discord user ID + access token
- **Membership Verification**: Requires Discord API call to `/users/@me/guilds` endpoint
- **Bot Setup**: One-time Discord bot creation to get client ID/secret, add bot to server
- **Rate Limits**: Discord API: 50 requests/second per endpoint (sufficient for 100 users)

**Best Practices Identified**:
1. Use Supabase Auth Discord provider (no custom OAuth implementation needed)
2. Store Discord Guild ID in environment variable (not hardcoded)
3. Membership checks should be cached (check on signup + every 10th visit)
4. Use Discord API v10 with Bearer token authentication
5. Handle rate limits with exponential backoff (unlikely to hit with 100 users)

**Architecture Pattern**:
```typescript
// Supabase Auth Discord provider configuration (Supabase Dashboard)
// Provider: Discord
// Client ID: <from Discord Developer Portal>
// Client Secret: <from Discord Developer Portal>
// Scopes: identify, guilds

// Edge Function: Check membership (supabase/functions/check-discord-membership/index.ts)
async function checkDiscordMembership(accessToken: string, guildId: string): Promise<boolean> {
  const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const guilds = await response.json();
  return guilds.some((guild: { id: string }) => guild.id === guildId);
}
```

**Risks Mitigated**:
- Access token expiration: Supabase handles refresh token flow automatically
- Guild ID changes: Stored in environment variable, easily updated
- Rate limiting: Caching (every 10th visit) keeps requests well below limits

---

### 3. React 19 + TypeScript

**Selected Version**: React 19.0.0, TypeScript 5.9+
**Purpose**: Frontend framework, type safety
**Context7 Verification**: ✅ (React 19 already used in Phase I)

**Key Findings**:
- **React 19 Changes**: Compiler optimizations, improved hooks (useActionState for forms)
- **TypeScript Strict Mode**: Required by constitution (Article I)
- **Context API**: Recommended for auth and tone state (avoid prop drilling)
- **Custom Hooks**: Encapsulate Supabase operations (useAuth, useTone, useSupabase)

**Best Practices Identified**:
1. Use AuthContext + ToneContext for global state (auth user, tone mode)
2. Custom hooks for Supabase operations (useAuth, useSupabase, useTone)
3. Protected routes using React Router + auth context
4. Optimistic UI updates for database operations (immediate feedback, rollback on error)
5. Error boundaries for each major route (admin, evaluation, vendors)

**Architecture Pattern**:
```typescript
// Auth Context (apps/evaluation-tool/src/contexts/AuthContext.tsx)
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  checkMembership: () => Promise<boolean>;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading, signIn, signOut, checkMembership }}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**Risks Mitigated**:
- Prop drilling: Context API provides global auth/tone state
- Auth state synchronization: onAuthStateChange listener keeps React state in sync
- Type safety: Strict TypeScript mode catches errors at compile time

---

### 4. Vite 7 + Tailwind CSS v4

**Selected Version**: Vite 7.x, Tailwind CSS v4.x with @tailwindcss/vite
**Purpose**: Build tool, styling framework
**Context7 Verification**: ✅ (Already configured in Phase I)

**Key Findings**:
- **Vite 7**: Faster builds, better HMR, native ESM
- **Tailwind v4**: New architecture with @tailwindcss/vite plugin (no PostCSS needed)
- **Code Splitting**: Automatic route-based code splitting with React.lazy
- **Environment Variables**: Vite uses `import.meta.env.VITE_*` prefix

**Best Practices Identified**:
1. Use `import.meta.env.VITE_SUPABASE_URL` for environment variables
2. Code split admin routes using React.lazy (reduce main bundle)
3. Tree-shake unused Tailwind classes (automatic in production build)
4. Use Tailwind @layer for custom components

**Architecture Pattern**:
```typescript
// Lazy-loaded admin route (apps/evaluation-tool/src/App.tsx)
const AdminPage = lazy(() => import('./pages/Admin'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/evaluate" element={<Evaluate />} />
      <Route path="/admin" element={
        <Suspense fallback={<LoadingSpinner />}>
          <ProtectedRoute><AdminPage /></ProtectedRoute>
        </Suspense>
      } />
    </Routes>
  );
}
```

**Risks Mitigated**:
- Bundle size: Code splitting keeps admin CMS out of main bundle
- Performance: Tailwind tree-shaking removes unused styles
- Environment variable leaks: VITE_ prefix ensures only intended vars exposed

---

### 5. Vitest + Playwright

**Selected Version**: Vitest 1.x, Playwright 1.x
**Purpose**: Unit/integration testing (Vitest), E2E testing (Playwright)
**Context7 Verification**: ✅ (Already configured in Phase I)

**Key Findings**:
- **Vitest**: Drop-in replacement for Jest, native ESM support, faster execution
- **React Testing Library**: Test components by user behavior (not implementation)
- **Playwright**: Cross-browser E2E testing, auto-wait for elements, screenshot on failure
- **Supabase Testing**: Use Supabase local development server for tests

**Best Practices Identified**:
1. Use Supabase CLI `supabase start` for local development (PostgreSQL container)
2. Mock Supabase client in unit tests (avoid hitting real database)
3. Integration tests use local Supabase instance (reset between tests)
4. E2E tests use Playwright with `baseURL` pointing to local dev server
5. Test RLS policies by authenticating as different users

**Architecture Pattern**:
```typescript
// Integration test for auth flow (apps/evaluation-tool/tests/integration/auth.test.ts)
import { createClient } from '@supabase/supabase-js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Authentication Flow', () => {
  let supabase: ReturnType<typeof createClient>;

  beforeEach(() => {
    supabase = createClient(
      'http://localhost:54321', // Local Supabase
      'test-anon-key'
    );
  });

  it('should authenticate user with Discord OAuth', async () => {
    // Test authentication flow
  });
});

// E2E test (apps/evaluation-tool/tests/e2e/evaluation.spec.ts)
import { test, expect } from '@playwright/test';

test('complete evaluation flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Start New Evaluation');
  // Test evaluation flow
});
```

**Risks Mitigated**:
- Flaky tests: Playwright auto-waits for elements (no manual timeouts)
- Database state pollution: Reset Supabase local instance between tests
- RLS testing: Integration tests authenticate as different users to verify policies

---

### 6. Anthropic Claude API (Tone Generation)

**Selected Library**: @anthropic-ai/sdk (server-side only, Edge Function)
**Purpose**: Auto-generate corporate tone versions from no-BS baseline
**Context7 Verification**: ⏳ Will verify in implementation task

**Preliminary Research**:
- **Usage**: Edge Function calls Claude API when admin saves content (no-BS version)
- **Model**: claude-3-5-sonnet (high quality, supports tone translation)
- **Rate Limits**: Tier 1: 50 requests/minute (sufficient for admin CMS usage)
- **Cost**: $3/million input tokens, $15/million output tokens (negligible for Phase I)

**Architecture Pattern** (preliminary):
```typescript
// Edge Function: Generate corporate tone (supabase/functions/generate-corporate-tone/index.ts)
import Anthropic from 'npm:@anthropic-ai/sdk';

Deno.serve(async (req) => {
  const { noBsText } = await req.json();

  const anthropic = new Anthropic({
    apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
  });

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Convert this direct text to corporate-friendly tone while preserving meaning:\n\n${noBsText}`
    }]
  });

  return new Response(JSON.stringify({ corporateText: message.content[0].text }));
});
```

**Note**: Full Context7 verification will occur during implementation task (per Option C).

---

### 7. GitHub API (Feedback System)

**Selected Library**: Octokit (REST API client)
**Purpose**: Create GitHub issues from user feedback
**Context7 Verification**: ⏳ Will verify in implementation task

**Preliminary Research**:
- **Usage**: Edge Function creates GitHub issue when user submits feedback
- **Authentication**: Personal access token with `repo` scope
- **Rate Limits**: 5,000 requests/hour (sufficient for feedback system)
- **Issue Labels**: Auto-apply "user-feedback" label

**Architecture Pattern** (preliminary):
```typescript
// Edge Function: Submit feedback (supabase/functions/submit-feedback/index.ts)
import { Octokit } from 'npm:octokit';

Deno.serve(async (req) => {
  const { title, body } = await req.json();

  const octokit = new Octokit({
    auth: Deno.env.get('GITHUB_TOKEN')
  });

  const issue = await octokit.rest.issues.create({
    owner: 'your-username',
    repo: 'vendoreval3',
    title: `[Feedback] ${title}`,
    body: body,
    labels: ['user-feedback']
  });

  return new Response(JSON.stringify({ issueUrl: issue.data.html_url }));
});
```

**Note**: Full Context7 verification will occur during implementation task (per Option C).

---

## Unknown/Uncertain Areas

### 1. Supabase Free Tier Limits

**Question**: Will 500MB database be sufficient for Phase I?

**Estimation**:
- User record: ~500 bytes (Discord ID, email, metadata)
- Evaluation: ~5KB (20 questions × 250 bytes per answer + notes)
- Vendor analysis: ~10KB (20 answers + evidence notes)
- Categories/Questions: ~50KB total (static content)

**Calculation**:
- 100 users × 500 bytes = 50KB
- 100 users × 10 evaluations × 5KB = 5MB
- 10 pre-analyzed vendors × 10KB = 100KB
- **Total estimated: ~5.2MB (1% of free tier)**

**Conclusion**: Free tier is MORE than sufficient for Phase I. Scale to ~10,000 evaluations before hitting limits.

---

### 2. Discord Membership Check Performance

**Question**: Will checking membership on every 10th visit cause noticeable lag?

**Performance Target**: < 5 seconds (from spec SC-003)

**Discord API Latency**:
- `/users/@me/guilds` endpoint: Typically 200-500ms
- Edge Function overhead: ~100-200ms
- Total: ~300-700ms (well under 5s target)

**Conclusion**: Performance acceptable. Caching strategy (every 10th visit) prevents excessive API calls.

---

### 3. Tone Toggle Performance with Database

**Question**: Can we achieve < 500ms tone toggle when fetching from database?

**Performance Target**: < 500ms perceived lag (from spec SC-004)

**Analysis**:
- Supabase query: ~50-150ms (single table, indexed)
- React re-render: ~10-50ms
- Total: ~60-200ms (well under 500ms target)

**Optimization**: Client-side caching of dual-tone content after first load. Toggle switches between cached versions (< 10ms).

**Conclusion**: Performance target easily achievable with client-side caching.

---

## Phase 0 Completion Checklist

- [x] Verify Supabase architecture (PostgreSQL + Auth + Edge Functions)
- [x] Verify Discord OAuth integration pattern
- [x] Verify React 19 + TypeScript best practices
- [x] Verify Vite 7 + Tailwind CSS v4 configuration
- [x] Verify Vitest + Playwright testing approach
- [x] Preliminary research: Anthropic Claude API (full verification in implementation)
- [x] Preliminary research: GitHub API (full verification in implementation)
- [x] Estimate free tier limits (5.2MB / 500MB = 1% usage)
- [x] Validate performance targets (all achievable)
- [x] Identify unknown areas (none blocking)

**Phase 0 Status**: ✅ COMPLETE

**Next Steps**: Proceed to Phase 1 (data-model.md, contracts/, quickstart.md)

---

## References

- Supabase Docs: https://supabase.com/docs
- Discord API Docs: https://discord.com/developers/docs
- React 19 Docs: https://react.dev
- Tailwind CSS v4 Docs: https://tailwindcss.com/docs
- Vitest Docs: https://vitest.dev
- Playwright Docs: https://playwright.dev
- Anthropic Claude API: https://docs.anthropic.com
- GitHub REST API: https://docs.github.com/rest

**Note**: Per user requirement (Option C), all libraries will be re-verified using Context7 during implementation tasks to ensure current best practices.
