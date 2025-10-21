# API Contracts and Endpoints

**Feature**: Full-Stack VendorEval Platform
**Branch**: `002-fullstack-platform`
**Date**: 2025-10-19
**Plan**: [../plan.md](../plan.md)

## Purpose

This document defines all API contracts for the full-stack VendorEval platform, including:
1. Supabase Edge Functions (server-side operations)
2. Supabase Database Queries (client-side data access)
3. Request/Response formats
4. Error handling
5. Authentication requirements

---

## Edge Functions

### 1. check-discord-membership

**Purpose**: Verify that a user is a member of the Discord server

**Endpoint**: `POST /functions/v1/check-discord-membership`

**Authentication**: Required (Supabase JWT token in Authorization header)

**Request**:
```typescript
interface CheckMembershipRequest {
  // No body - uses JWT token to identify user
}
```

**Response**:
```typescript
interface CheckMembershipResponse {
  isMember: boolean;
  checkedAt: string;  // ISO 8601 timestamp
  error?: string;
}
```

**Success (200)**:
```json
{
  "isMember": true,
  "checkedAt": "2025-10-19T12:00:00Z"
}
```

**Error Cases**:

1. **Unauthorized (401)**:
```json
{
  "error": "Unauthorized - no valid session"
}
```

2. **Discord Not Linked (400)**:
```json
{
  "isMember": false,
  "error": "No Discord account linked to this user"
}
```

3. **Discord API Error (502)**:
```json
{
  "isMember": false,
  "error": "Failed to check Discord membership - please try again"
}
```

**Implementation Notes**:
- Retrieves user's Discord access token from Supabase Auth session
- Calls Discord API: `GET /users/@me/guilds`
- Checks if Guild ID `1254761492608188517` is in response
- Updates `users.last_membership_check` timestamp
- Caches result for 24 hours (subsequent calls within 24h return cached value)

**Rate Limits**:
- Discord API: 50 requests/second (global)
- Caching prevents excessive calls

---

### 2. submit-feedback

**Purpose**: Submit user feedback and create GitHub issue

**Endpoint**: `POST /functions/v1/submit-feedback`

**Authentication**: Required (Supabase JWT token)

**Request**:
```typescript
interface SubmitFeedbackRequest {
  pageUrl: string;     // URL where feedback was submitted
  message: string;     // User's feedback (max 5000 characters)
  isAnonymous?: boolean;  // Optional: hide username from GitHub issue
}
```

**Response**:
```typescript
interface SubmitFeedbackResponse {
  feedbackId: string;  // UUID of feedback record
  githubIssueNumber?: number;
  githubIssueUrl?: string;
  status: 'pending' | 'created' | 'failed';
  message: string;
}
```

**Success (201)**:
```json
{
  "feedbackId": "uuid-123",
  "githubIssueNumber": 42,
  "githubIssueUrl": "https://github.com/username/vendoreval3/issues/42",
  "status": "created",
  "message": "Feedback submitted successfully"
}
```

**Partial Success** (feedback saved, GitHub failed) **(201)**:
```json
{
  "feedbackId": "uuid-123",
  "status": "failed",
  "message": "Feedback saved, but GitHub issue creation failed. We'll retry shortly."
}
```

**Error Cases**:

1. **Unauthorized (401)**:
```json
{
  "error": "Unauthorized - login required to submit feedback"
}
```

2. **Validation Error (400)**:
```json
{
  "error": "Invalid request: message exceeds 5000 characters"
}
```

3. **Rate Limit (429)**:
```json
{
  "error": "Too many feedback submissions. Please wait before trying again."
}
```

**Implementation Notes**:
- Always saves feedback to database (even if GitHub fails)
- GitHub issue creation is async (won't block response)
- Issue title: `[Feedback] ${pageUrl}`
- Issue body: User message + metadata (user, timestamp, browser)
- Auto-apply label: "user-feedback"
- If anonymous, replace username with "Anonymous User" in GitHub issue

**Rate Limits**:
- User-facing: 5 feedback submissions per hour (per user)
- GitHub API: 5000 requests/hour (global - unlikely to hit)

---

### 3. generate-corporate-tone

**Purpose**: Auto-generate corporate-friendly version from no-BS text

**Endpoint**: `POST /functions/v1/generate-corporate-tone`

**Authentication**: Required (Admin only - checks admin_users table)

**Request**:
```typescript
interface GenerateToneRequest {
  noBsText: string;      // Original no-BS text
  contentType: 'question' | 'category' | 'page' | 'vendor_description' | 'evidence';
  context?: string;      // Optional: additional context for better translation
}
```

**Response**:
```typescript
interface GenerateToneResponse {
  corporateText: string;
  model: string;         // e.g., "claude-3-5-sonnet-20241022"
  tokensUsed: number;
  generatedAt: string;   // ISO 8601 timestamp
}
```

**Success (200)**:
```json
{
  "corporateText": "This vendor provides comprehensive prompt visibility through their administrative interface.",
  "model": "claude-3-5-sonnet-20241022",
  "tokensUsed": 150,
  "generatedAt": "2025-10-19T12:00:00Z"
}
```

**Error Cases**:

1. **Unauthorized (401)**:
```json
{
  "error": "Unauthorized - admin access required"
}
```

2. **Validation Error (400)**:
```json
{
  "error": "Invalid request: noBsText is required"
}
```

3. **Claude API Error (502)**:
```json
{
  "error": "Failed to generate corporate version - please try again"
}
```

4. **Rate Limit (429)**:
```json
{
  "error": "Claude API rate limit exceeded - please wait before retrying"
}
```

**Implementation Notes**:
- Only admins can call this endpoint (verified via admin_users RLS policy)
- Uses Claude 3.5 Sonnet for high-quality tone translation
- Prompt template varies by `contentType`:
  - Question: "Convert this direct evaluation question to corporate-friendly tone..."
  - Category: "Convert this category title/subtitle to professional language..."
  - Page: "Convert this help text to executive-appropriate language..."
- Max input: 10,000 characters
- Response cached in browser (admin can regenerate if unhappy)

**Rate Limits**:
- Claude API: 50 requests/minute (Tier 1)
- Admin UI should batch generate (not call for every field)

---

## Supabase Database Queries

### Authentication

#### Sign In with Discord

**Client-side**:
```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'discord',
  options: {
    scopes: 'identify guilds',
    redirectTo: `${window.location.origin}/auth/callback`
  }
});
```

**Callback Handling**:
```typescript
// In /auth/callback route
const { data: { session }, error } = await supabase.auth.getSession();

if (session) {
  // Check Discord membership
  const { data } = await supabase.functions.invoke('check-discord-membership');

  if (!data.isMember) {
    // Show "Not a member" message + invite code option
  }
}
```

#### Sign In with Magic Link

**Request**:
```typescript
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`
  }
});
```

**Validation (requires invite code)**:
```typescript
// Before sending magic link, verify invite code
const { data: invite } = await supabase
  .from('invite_codes')
  .select('*')
  .eq('code', 'EVAL-2024-ABC123')
  .eq('is_active', true)
  .gt('expires_at', new Date().toISOString())
  .is('used_at', null)
  .single();

if (!invite || (invite.email && invite.email !== email)) {
  // Invalid or expired invite code
}
```

#### Sign Out

```typescript
const { error } = await supabase.auth.signOut();
```

---

### User Management

#### Get Current User Profile

```typescript
const { data: user, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', session.user.id)
  .single();
```

#### Check if User is Admin

```typescript
const { data: adminUser, error } = await supabase
  .from('admin_users')
  .select('*')
  .eq('user_id', session.user.id)
  .is('revoked_at', null)
  .single();

const isAdmin = !!adminUser;
const isSuperAdmin = adminUser?.is_super_admin ?? false;
```

#### Update User Profile

```typescript
const { error } = await supabase
  .from('users')
  .update({
    display_name: 'New Name',
    updated_at: new Date().toISOString()
  })
  .eq('id', session.user.id);
```

---

### Content Queries

#### Get All Categories (with tone)

```typescript
interface GetCategoriesRequest {
  tone: 'no_bs' | 'corporate';
}

const { data: categories, error } = await supabase
  .from('categories')
  .select('*')
  .order('order_index', { ascending: true });

// Map to include tone-specific content
const categoriesWithTone = categories.map(cat => ({
  id: cat.id,
  key: cat.key,
  color: cat.color,
  title: tone === 'no_bs' ? cat.title_no_bs : cat.title_corporate,
  subtitle: tone === 'no_bs' ? cat.subtitle_no_bs : cat.subtitle_corporate,
}));
```

#### Get All Questions (with tone and category)

```typescript
const { data: questions, error } = await supabase
  .from('questions')
  .select(`
    *,
    category:categories (*)
  `)
  .order('order_index', { ascending: true });

// Map to include tone-specific content
const questionsWithTone = questions.map(q => ({
  id: q.id,
  categoryId: q.category_id,
  categoryKey: q.category.key,
  isCritical: q.is_critical,
  text: tone === 'no_bs' ? q.text_no_bs : q.text_corporate,
  helpText: tone === 'no_bs' ? q.help_text_no_bs : q.help_text_corporate,
}));
```

---

### Vendor Library

#### Get All Official Vendors

```typescript
const { data: vendors, error } = await supabase
  .from('vendors')
  .select('*')
  .eq('is_official', true)
  .order('name', { ascending: true });

// Map to include tone-specific content
const vendorsWithTone = vendors.map(v => ({
  id: v.id,
  slug: v.slug,
  name: v.name,
  logoUrl: v.logo_url,
  website: v.website,
  description: tone === 'no_bs' ? v.description_no_bs : v.description_corporate,
}));
```

#### Get Vendor Evaluation (official pre-analysis)

```typescript
const { data: evaluation, error } = await supabase
  .from('vendor_evaluations')
  .select(`
    *,
    question:questions (*),
    vendor:vendors (*)
  `)
  .eq('vendor_id', vendorId)
  .order('question.order_index', { ascending: true });

// Map to include tone-specific evidence
const evaluationWithTone = evaluation.map(e => ({
  questionId: e.question_id,
  questionText: tone === 'no_bs' ? e.question.text_no_bs : e.question.text_corporate,
  answer: e.answer,
  evidence: tone === 'no_bs' ? e.evidence_no_bs : e.evidence_corporate,
}));
```

---

### User Evaluations

#### Get User's Evaluations

```typescript
const { data: evaluations, error } = await supabase
  .from('evaluations')
  .select('*')
  .eq('user_id', session.user.id)
  .order('updated_at', { ascending: false });
```

#### Create New Evaluation

```typescript
const { data: evaluation, error } = await supabase
  .from('evaluations')
  .insert({
    user_id: session.user.id,
    vendor_name: 'New Vendor',
    answers: [],
  })
  .select()
  .single();
```

#### Update Evaluation (save answers)

```typescript
interface Answer {
  questionId: string;
  value: 'yes' | 'no' | 'not-enough-info';
  note?: string;
}

const { error } = await supabase
  .from('evaluations')
  .update({
    answers: updatedAnswers,
    updated_at: new Date().toISOString(),
  })
  .eq('id', evaluationId)
  .eq('user_id', session.user.id);  // Ensure user owns evaluation
```

#### Delete Evaluation

```typescript
const { error } = await supabase
  .from('evaluations')
  .delete()
  .eq('id', evaluationId)
  .eq('user_id', session.user.id);
```

---

### Feedback

#### Submit Feedback (via Edge Function)

```typescript
const { data, error } = await supabase.functions.invoke('submit-feedback', {
  body: {
    pageUrl: window.location.pathname,
    message: 'This is feedback',
    isAnonymous: false,
  },
});
```

#### Get User's Feedback History

```typescript
const { data: feedback, error } = await supabase
  .from('feedback')
  .select('*')
  .eq('user_id', session.user.id)
  .order('created_at', { ascending: false });
```

---

### Admin CMS Operations

#### Create Category

```typescript
const { error } = await supabase
  .from('categories')
  .insert({
    key: 'new-category',
    order_index: 7,
    color: '#FF6B6B',
    title_no_bs: 'No BS Title',
    title_corporate: 'Corporate Title',
    subtitle_no_bs: 'No BS Subtitle',
    subtitle_corporate: 'Corporate Subtitle',
  });
```

#### Update Question

```typescript
const { error } = await supabase
  .from('questions')
  .update({
    text_no_bs: 'Updated no-BS text',
    text_corporate: 'Updated corporate text',
    updated_at: new Date().toISOString(),
  })
  .eq('id', questionId);
```

#### Generate Corporate Version (via Edge Function)

```typescript
const { data, error } = await supabase.functions.invoke('generate-corporate-tone', {
  body: {
    noBsText: 'Can you actually see the prompts they use, or is it magic fairy dust?',
    contentType: 'question',
  },
});

// data.corporateText: "Does the vendor provide visibility into the prompts used by the AI system?"
```

#### Grant Admin Access

```typescript
// Must be super admin to grant access
const { error } = await supabase
  .from('admin_users')
  .insert({
    user_id: targetUserId,
    granted_by: session.user.id,
    is_super_admin: false,
  });
```

#### Create Invite Code

```typescript
const { data: invite, error } = await supabase
  .from('invite_codes')
  .insert({
    code: generateInviteCode(),  // e.g., "EVAL-2024-ABC123"
    email: 'specific@example.com',  // Optional
    created_by: session.user.id,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),  // 7 days
  })
  .select()
  .single();

function generateInviteCode(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EVAL-${year}-${random}`;
}
```

---

## Error Handling

### Standard Error Response Format

All API errors follow this format:

```typescript
interface ApiError {
  error: string;         // Human-readable error message
  code?: string;         // Error code (e.g., "INVALID_REQUEST", "UNAUTHORIZED")
  details?: any;         // Additional error context
}
```

### Client-Side Error Handling Pattern

```typescript
async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await queryFn();

    if (error) {
      console.error('Database error:', error);
      throw new Error(error.message || 'An error occurred');
    }

    if (!data) {
      throw new Error('No data returned');
    }

    return data;
  } catch (err) {
    // Log error, show toast, etc.
    throw err;
  }
}

// Usage
const categories = await safeQuery(() =>
  supabase.from('categories').select('*')
);
```

---

## Rate Limiting

### Discord API
- **Limit**: 50 requests/second (global)
- **Strategy**: Cache membership checks for 24 hours
- **Backoff**: Exponential backoff on 429 responses

### GitHub API
- **Limit**: 5,000 requests/hour (authenticated)
- **Strategy**: Queue feedback submissions, process async
- **Backoff**: Retry failed submissions with exponential backoff

### Claude API
- **Limit**: 50 requests/minute (Tier 1)
- **Strategy**: Admin UI batches tone generation (not per-field)
- **Backoff**: Show error message, allow manual retry

### Supabase
- **Limit**: Free tier - no hard limits, soft throttling on excessive usage
- **Strategy**: Optimize queries (avoid N+1), use pagination
- **Monitoring**: Track request counts, optimize slow queries

---

## Authentication Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ Click "Sign in with Discord"
       ▼
┌─────────────────────┐
│ Supabase Auth       │ ──────► Discord OAuth (redirects to Discord)
└─────────────────────┘
       │
       │ Discord callback with code
       ▼
┌─────────────────────┐
│ Supabase Auth       │ ──────► Exchange code for Discord tokens
└─────────────────────┘
       │
       │ Create session + JWT token
       ▼
┌─────────────────────┐
│ Client: /auth/      │
│ callback            │
└──────┬──────────────┘
       │
       │ Call Edge Function
       ▼
┌─────────────────────────────┐
│ check-discord-membership    │ ──────► Discord API: GET /users/@me/guilds
└─────────────────────────────┘
       │
       │ Return { isMember: boolean }
       ▼
┌─────────────────────┐
│ Client              │
│ ─ isMember = true   │ ──────► Redirect to /evaluate
│ ─ isMember = false  │ ──────► Show "Enter invite code"
└─────────────────────┘
```

---

## Testing Contracts

### Integration Tests

**Test auth flow**:
```typescript
test('Discord OAuth authentication', async () => {
  // Mock Supabase Auth response
  const { data } = await supabase.auth.signInWithOAuth({ provider: 'discord' });

  expect(data.session).toBeDefined();
  expect(data.user.app_metadata.provider).toBe('discord');
});
```

**Test membership check**:
```typescript
test('Discord membership verification', async () => {
  const { data } = await supabase.functions.invoke('check-discord-membership');

  expect(data.isMember).toBe(true);
  expect(data.checkedAt).toBeDefined();
});
```

**Test RLS policies**:
```typescript
test('User can only read own evaluations', async () => {
  // Create evaluation as user1
  const { data: eval1 } = await supabaseUser1
    .from('evaluations')
    .insert({ vendor_name: 'Test' })
    .select()
    .single();

  // Try to read as user2 (should fail)
  const { data: eval2, error } = await supabaseUser2
    .from('evaluations')
    .select()
    .eq('id', eval1.id)
    .single();

  expect(error).toBeDefined();
  expect(data).toBeNull();
});
```

---

## API Versioning

**Current Version**: v1

**Versioning Strategy**:
- Edge Functions: `/functions/v1/{function-name}`
- Database schema: Migrations numbered sequentially
- Breaking changes: Create v2 endpoints, deprecate v1 after 6 months
- Non-breaking changes: Update existing endpoints

**Deprecation Policy**:
- Announce deprecation 30 days in advance
- Support deprecated endpoints for 6 months
- Provide migration guide in docs

---

## Next Steps

- [x] Define API contracts (this document)
- [ ] Implement Edge Functions (check-discord-membership, submit-feedback, generate-corporate-tone)
- [ ] Implement client-side Supabase queries (services/database.ts)
- [ ] Write integration tests for all endpoints
- [ ] Document environment variables in quickstart.md

**Status**: ✅ API contracts complete, ready for implementation
