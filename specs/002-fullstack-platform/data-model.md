# Phase 1: Data Model and Database Schema

**Feature**: Full-Stack VendorEval Platform
**Branch**: `002-fullstack-platform`
**Date**: 2025-10-19
**Plan**: [plan.md](plan.md)

## Purpose

This document defines the complete database schema for the full-stack VendorEval platform, including all tables, columns, relationships, indexes, and Row Level Security (RLS) policies. The schema is designed for Supabase PostgreSQL with dual-tone content columns and comprehensive access control.

---

## Schema Overview

**Database**: PostgreSQL 15+ (Supabase managed)
**Total Tables**: 11
**Key Features**:
- Dual-tone content (field_no_bs, field_corporate) for all text fields
- Row Level Security (RLS) on all tables
- UUID primary keys for all entities
- Timestamps (created_at, updated_at) for audit trail
- Foreign key relationships with cascade rules

**Entity Groups**:
1. **Authentication**: users, admin_users, invite_codes
2. **Content**: categories, questions, pages, site_settings
3. **Vendor Data**: vendors, vendor_evaluations
4. **User Data**: evaluations, feedback

---

## Tables

### 1. users

**Purpose**: Represents authenticated users (Discord OAuth or magic link)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  discord_id TEXT UNIQUE,  -- Discord user ID (nullable for magic link users)
  discord_username TEXT,    -- Discord username#discriminator
  display_name TEXT,        -- User-facing name
  avatar_url TEXT,          -- Profile picture URL
  login_count INTEGER DEFAULT 0 NOT NULL,  -- Track logins for membership re-check
  last_membership_check TIMESTAMP WITH TIME ZONE,  -- When we last verified Discord membership
  is_active BOOLEAN DEFAULT TRUE NOT NULL,  -- Soft delete flag
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_users_discord_id ON users(discord_id);
CREATE INDEX idx_users_email ON users(email);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own record
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except admin fields)
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role can manage all users (for Edge Functions)
CREATE POLICY "Service role has full access"
  ON users FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');
```

**Notes**:
- `discord_id` is nullable (magic link users don't have Discord)
- `login_count` increments on each login (trigger: check membership every 10 logins)
- `last_membership_check` tracks when we verified Discord server membership
- Supabase Auth manages passwords/sessions (not stored here)

---

### 2. admin_users

**Purpose**: Represents users with admin CMS access

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES users(id) ON DELETE SET NULL,  -- Which admin granted this
  is_super_admin BOOLEAN DEFAULT FALSE NOT NULL,  -- Super admin cannot be demoted
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,  -- Soft delete for audit trail
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);

-- RLS Policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can read all admin records
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- Only super admins can grant admin access
CREATE POLICY "Super admins can manage admin users"
  ON admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_super_admin = TRUE
        AND au.revoked_at IS NULL
    )
  );
```

**Notes**:
- `is_super_admin` flag prevents accidental demotion of primary admin
- `revoked_at` provides soft delete (audit trail)
- `granted_by` tracks who granted admin access (accountability)

**Constraint**: Super admin cannot be demoted (enforced in application logic + database trigger)

```sql
-- Trigger to prevent super admin demotion
CREATE OR REPLACE FUNCTION prevent_super_admin_demotion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_super_admin = TRUE AND NEW.is_super_admin = FALSE THEN
    RAISE EXCEPTION 'Cannot demote super admin';
  END IF;
  IF OLD.is_super_admin = TRUE AND NEW.revoked_at IS NOT NULL THEN
    RAISE EXCEPTION 'Cannot revoke super admin access';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_super_admin_protection
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_super_admin_demotion();
```

---

### 3. invite_codes

**Purpose**: Represents invitation codes for non-Discord users

```sql
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,  -- Unique invite code (e.g., "EVAL-2024-ABC123")
  email TEXT,  -- Optional: restrict to specific email
  created_by UUID NOT NULL REFERENCES admin_users(user_id) ON DELETE CASCADE,
  used_by UUID REFERENCES users(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,  -- Default: 7 days from creation
  is_active BOOLEAN DEFAULT TRUE NOT NULL,  -- Can be manually disabled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_email ON invite_codes(email);

-- RLS Policies
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- Admins can view all invite codes
CREATE POLICY "Admins can view invite codes"
  ON invite_codes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- Admins can create invite codes
CREATE POLICY "Admins can create invite codes"
  ON invite_codes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- Public read for code validation (during signup)
CREATE POLICY "Public can validate invite codes"
  ON invite_codes FOR SELECT
  USING (
    is_active = TRUE
    AND expires_at > NOW()
    AND used_at IS NULL
  );
```

**Notes**:
- `code` format: "EVAL-{YEAR}-{RANDOM6}" (e.g., "EVAL-2024-ABC123")
- `email` is optional (if set, code only works for that email)
- `expires_at` defaults to 7 days from creation
- Once used, `used_by` and `used_at` are set (code becomes single-use)

---

### 4. categories

**Purpose**: Represents six evaluation categories (SEE, CHANGE, USE, ADAPT, LEAVE, LEARN)

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,  -- 'see', 'change', 'use', 'adapt', 'leave', 'learn'
  order_index INTEGER NOT NULL,  -- Display order (1-6)
  color TEXT NOT NULL,  -- Hex color (e.g., '#3B82F6' for blue)

  -- Dual-tone content
  title_no_bs TEXT NOT NULL,
  title_corporate TEXT NOT NULL,
  subtitle_no_bs TEXT NOT NULL,
  subtitle_corporate TEXT NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  UNIQUE(order_index)
);

-- Indexes
CREATE INDEX idx_categories_key ON categories(key);
CREATE INDEX idx_categories_order ON categories(order_index);

-- RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read (all users can view categories)
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (TRUE);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );
```

**Seed Data** (6 categories):
```json
[
  {
    "key": "see",
    "order_index": 1,
    "color": "#3B82F6",
    "title_no_bs": "SEE: What you're actually buying",
    "title_corporate": "SEE: Product Transparency",
    "subtitle_no_bs": "Can you actually see how the AI works, or is it magic?",
    "subtitle_corporate": "Understanding the underlying technology and capabilities"
  },
  {
    "key": "change",
    "order_index": 2,
    "color": "#10B981",
    "title_no_bs": "CHANGE: Will they screw you over later?",
    "title_corporate": "CHANGE: Vendor Control and Flexibility",
    "subtitle_no_bs": "How locked in are you? Can they change things without asking?",
    "subtitle_corporate": "Assessing vendor lock-in and control over the platform"
  }
  // ... (remaining 4 categories)
]
```

---

### 5. questions

**Purpose**: Represents 20 evaluation questions across six categories

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,  -- Display order within category (1-N)
  is_critical BOOLEAN DEFAULT FALSE NOT NULL,  -- Critical questions (red flag if "no")

  -- Dual-tone content
  text_no_bs TEXT NOT NULL,
  text_corporate TEXT NOT NULL,
  help_text_no_bs TEXT,  -- Optional: explanation for user
  help_text_corporate TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  UNIQUE(category_id, order_index)
);

-- Indexes
CREATE INDEX idx_questions_category ON questions(category_id);
CREATE INDEX idx_questions_order ON questions(order_index);
CREATE INDEX idx_questions_critical ON questions(is_critical);

-- RLS Policies
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Public read (all users can view questions)
CREATE POLICY "Public can view questions"
  ON questions FOR SELECT
  USING (TRUE);

-- Admins can manage questions
CREATE POLICY "Admins can manage questions"
  ON questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );
```

**Notes**:
- `is_critical` marks questions that reveal deal-breakers (e.g., hidden prompts, no data export)
- `help_text` provides context on why this question matters (optional, can be added later)
- Total: 20 questions across 6 categories

---

### 6. vendors

**Purpose**: Represents AI vendors that can be evaluated (official library + user-created)

```sql
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,  -- URL-friendly identifier (e.g., 'glean', 'openai')
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,

  -- Dual-tone content
  description_no_bs TEXT,
  description_corporate TEXT,

  is_official BOOLEAN DEFAULT FALSE NOT NULL,  -- Official pre-analyzed vendors
  last_refreshed_at TIMESTAMP WITH TIME ZONE,  -- Phase II: auto-refresh data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_vendors_slug ON vendors(slug);
CREATE INDEX idx_vendors_official ON vendors(is_official);

-- RLS Policies
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Public read (all users can view vendors)
CREATE POLICY "Public can view vendors"
  ON vendors FOR SELECT
  USING (TRUE);

-- Admins can manage official vendors
CREATE POLICY "Admins can manage vendors"
  ON vendors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );
```

**Notes**:
- `is_official` distinguishes pre-analyzed vendors (Glean) from user-created
- `last_refreshed_at` for Phase II (Exa API auto-refresh)
- Phase I: Only official vendors (Glean)

---

### 7. vendor_evaluations

**Purpose**: Represents official pre-analyzed vendor assessments (e.g., Glean analysis)

```sql
CREATE TABLE vendor_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL CHECK (answer IN ('yes', 'no', 'not-enough-info')),

  -- Dual-tone evidence
  evidence_no_bs TEXT,  -- Why we answered this way (no-BS explanation)
  evidence_corporate TEXT,  -- Corporate-friendly version

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  UNIQUE(vendor_id, question_id)
);

-- Indexes
CREATE INDEX idx_vendor_evaluations_vendor ON vendor_evaluations(vendor_id);
CREATE INDEX idx_vendor_evaluations_question ON vendor_evaluations(question_id);
CREATE INDEX idx_vendor_evaluations_answer ON vendor_evaluations(answer);

-- RLS Policies
ALTER TABLE vendor_evaluations ENABLE ROW LEVEL SECURITY;

-- Public read (all users can view official evaluations)
CREATE POLICY "Public can view vendor evaluations"
  ON vendor_evaluations FOR SELECT
  USING (TRUE);

-- Admins can manage vendor evaluations
CREATE POLICY "Admins can manage vendor evaluations"
  ON vendor_evaluations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );
```

**Notes**:
- One record per (vendor, question) pair
- `evidence` explains why we answered this way (shows sources, reasoning)
- Example: "Glean's documentation states... (link)" or "No public information available"

---

### 8. evaluations

**Purpose**: Represents user-created evaluations (their own assessments of vendors)

```sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- Anonymize on user deletion
  vendor_name TEXT NOT NULL,  -- Free-text vendor name (user can evaluate any vendor)

  -- Answers stored as JSONB array
  -- Format: [{ questionId: uuid, value: 'yes'|'no'|'not-enough-info', note: 'text' }]
  answers JSONB DEFAULT '[]'::jsonb NOT NULL,

  -- Computed fields (denormalized for performance)
  completed_question_count INTEGER DEFAULT 0 NOT NULL,  -- How many answered (0-20)
  completion_percentage INTEGER DEFAULT 0 NOT NULL,  -- 0-100

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_evaluations_user ON evaluations(user_id);
CREATE INDEX idx_evaluations_vendor ON evaluations(vendor_name);
CREATE INDEX idx_evaluations_answers ON evaluations USING GIN (answers);  -- JSONB index

-- RLS Policies
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Users can only view their own evaluations
CREATE POLICY "Users can view own evaluations"
  ON evaluations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create evaluations
CREATE POLICY "Users can create evaluations"
  ON evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own evaluations
CREATE POLICY "Users can update own evaluations"
  ON evaluations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own evaluations
CREATE POLICY "Users can delete own evaluations"
  ON evaluations FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all evaluations (for support, not edit)
CREATE POLICY "Admins can view all evaluations"
  ON evaluations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );
```

**Notes**:
- `user_id` SET NULL on user deletion (preserve evaluation data, anonymize)
- `answers` stored as JSONB (flexible, allows adding fields without migration)
- `completed_question_count` and `completion_percentage` denormalized for performance (updated via trigger)
- Users can evaluate ANY vendor (not restricted to official library)

**Example `answers` JSONB**:
```json
[
  {
    "questionId": "uuid-1",
    "value": "yes",
    "note": "They clearly show all prompts in the UI"
  },
  {
    "questionId": "uuid-2",
    "value": "no",
    "note": "No way to export data - major red flag"
  }
]
```

**Trigger to update completion fields**:
```sql
CREATE OR REPLACE FUNCTION update_evaluation_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.completed_question_count := (
    SELECT COUNT(*)
    FROM jsonb_array_elements(NEW.answers) AS answer
    WHERE answer->>'value' IS NOT NULL
  );
  NEW.completion_percentage := ROUND((NEW.completed_question_count::FLOAT / 20.0) * 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maintain_evaluation_completion
  BEFORE INSERT OR UPDATE ON evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_evaluation_completion();
```

---

### 9. pages

**Purpose**: Represents CMS pages (help, documentation, landing content)

```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,  -- URL path (e.g., 'help', 'about', 'faq')

  -- Dual-tone content
  title_no_bs TEXT NOT NULL,
  title_corporate TEXT NOT NULL,
  content_no_bs TEXT NOT NULL,  -- Markdown content
  content_corporate TEXT NOT NULL,

  is_published BOOLEAN DEFAULT FALSE NOT NULL,  -- Draft vs published
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_published ON pages(is_published);

-- RLS Policies
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Public can view published pages
CREATE POLICY "Public can view published pages"
  ON pages FOR SELECT
  USING (is_published = TRUE);

-- Admins can manage all pages
CREATE POLICY "Admins can manage pages"
  ON pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );
```

**Notes**:
- `content` stored as Markdown (rendered to HTML client-side)
- `is_published` allows drafts (admin preview before publishing)

---

### 10. feedback

**Purpose**: Represents user feedback submissions with GitHub issue integration

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- Allow anonymous feedback
  page_url TEXT NOT NULL,  -- Which page feedback was submitted from
  message TEXT NOT NULL,

  -- GitHub integration
  github_issue_number INTEGER,
  github_issue_url TEXT,
  github_status TEXT CHECK (github_status IN ('pending', 'created', 'failed')),

  -- Feedback lifecycle
  status TEXT DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_notes TEXT,  -- Admin can add notes

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_feedback_user ON feedback(user_id);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_github_status ON feedback(github_status);

-- RLS Policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

-- Users can submit feedback
CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
  ON feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- Admins can update feedback (add notes, change status)
CREATE POLICY "Admins can update feedback"
  ON feedback FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );
```

**Notes**:
- `user_id` nullable (allow anonymous feedback)
- `github_status`: 'pending' (queued), 'created' (success), 'failed' (error)
- Edge Function creates GitHub issue asynchronously, updates record after
- `status` tracks feedback lifecycle (admin workflow)

---

### 11. site_settings

**Purpose**: Represents global configuration (single row)

```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT NOT NULL,  -- Hex color
  contact_email TEXT NOT NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- Enforce single row
  CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid)
);

-- Insert default settings
INSERT INTO site_settings (id, site_name, primary_color, contact_email)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'VendorEval',
  '#3B82F6',
  'contact@vendoreval.com'
);

-- RLS Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read (all users can view settings)
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (TRUE);

-- Admins can update settings
CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );
```

**Notes**:
- Single row enforced via CHECK constraint (id must be specific UUID)
- No INSERT/DELETE allowed (only UPDATE after initial seed)

---

## Relationships

```
users (1) ───┬─ (N) evaluations
             ├─ (1) admin_users
             ├─ (N) invite_codes (created_by)
             ├─ (N) invite_codes (used_by)
             └─ (N) feedback

categories (1) ─── (N) questions

vendors (1) ─── (N) vendor_evaluations

questions (1) ─── (N) vendor_evaluations
```

---

## Indexes Summary

**Performance-critical indexes**:
- `users(discord_id)` - Fast Discord ID lookup during auth
- `users(email)` - Email-based auth
- `evaluations(user_id)` - User's evaluations list
- `evaluations USING GIN (answers)` - JSONB search
- `questions(category_id)` - Questions by category
- `vendor_evaluations(vendor_id, question_id)` - Vendor analysis lookup

**Total indexes**: 23 (including primary keys)

---

## Migration Strategy

**6 Incremental Migrations**:

1. **00001_initial_schema.sql**: Core tables (users, categories, questions)
2. **00002_vendor_tables.sql**: Vendor library (vendors, vendor_evaluations)
3. **00003_evaluation_tables.sql**: User evaluations
4. **00004_admin_tables.sql**: Admin users, invite codes
5. **00005_feedback_tables.sql**: Feedback system
6. **00006_rls_policies.sql**: Row Level Security policies

**Testing Approach**: Run migrations on local Supabase, test each feature area, then deploy to production.

---

## Data Volume Estimates

**Phase I (100 users)**:
- Users: 100 × 500 bytes = 50KB
- Categories: 6 × 500 bytes = 3KB
- Questions: 20 × 500 bytes = 10KB
- Vendors: 10 × 1KB = 10KB
- Vendor Evaluations: 10 vendors × 20 questions × 1KB = 200KB
- User Evaluations: 100 users × 10 evaluations × 5KB = 5MB
- Pages: 10 × 10KB = 100KB
- Feedback: 100 × 500 bytes = 50KB
- **Total: ~5.4MB (1% of 500MB free tier)**

**Scaling**:
- 1,000 users: ~54MB (10% of free tier)
- 10,000 users: ~540MB (hitting free tier limit)

**Conclusion**: Free tier sufficient for Phase I and beyond.

---

## RLS Security Model

**Access Levels**:

1. **Public** (unauthenticated):
   - Read: categories, questions, pages (published), vendors, vendor_evaluations
   - No write access

2. **Authenticated Users**:
   - Read: Own profile, own evaluations, own feedback
   - Write: Own evaluations, submit feedback, update own profile

3. **Admins**:
   - Read: All content, all evaluations (view-only), all feedback
   - Write: Content (categories, questions, vendors, pages), admin management

4. **Super Admin**:
   - All admin permissions
   - Cannot be demoted (database trigger enforces)

5. **Service Role** (Edge Functions):
   - Full access (bypasses RLS)
   - Used for Discord membership checks, GitHub issue creation

---

## Backup and Recovery

**Supabase Managed Backups**:
- Daily backups (retained 7 days on free tier)
- Point-in-time recovery (paid tier only)
- Export to SQL dump (manual backup option)

**Recommended**: Weekly manual SQL dumps during Phase I (critical data).

---

## Next Steps

- [x] Define database schema (this document)
- [ ] Create migration files (00001-00006)
- [ ] Create seed data JSON files
- [ ] Write seed script (populate from existing code)
- [ ] Test migrations on local Supabase
- [ ] Generate TypeScript types using Supabase CLI

**Status**: ✅ Data model complete, ready for contracts/ and quickstart.md

---

## Appendix: TypeScript Types

**Generated from schema using Supabase CLI**:

```bash
supabase gen types typescript --local > apps/evaluation-tool/src/types/database.ts
```

**Example output**:
```typescript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          discord_id: string | null;
          // ... all fields
        };
        Insert: {
          id?: string;
          email: string;
          // ... required fields for INSERT
        };
        Update: {
          id?: string;
          email?: string;
          // ... all fields optional for UPDATE
        };
      };
      // ... all tables
    };
  };
};
```

**Usage in application**:
```typescript
import type { Database } from '@/types/database';

const supabase = createClient<Database>(url, key);

// Type-safe queries
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
// data is typed as Database['public']['Tables']['users']['Row']
```
