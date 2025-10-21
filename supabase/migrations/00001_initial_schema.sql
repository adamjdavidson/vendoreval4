-- Migration: Initial Schema - Users, Categories, Questions
-- Description: Core tables for authentication and evaluation framework
-- Phase: 2 - Foundational

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: users
-- Purpose: Authenticated users (Discord OAuth or magic link)
-- ============================================================================

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

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role has full access (for Edge Functions)
CREATE POLICY "Service role has full access"
  ON users FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- TABLE: categories
-- Purpose: Six evaluation categories (SEE, CHANGE, USE, ADAPT, LEAVE, LEARN)
-- ============================================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,  -- 'see', 'change', 'use', 'adapt', 'leave', 'learn'
  order_index INTEGER NOT NULL,  -- Display order (1-6)
  color TEXT NOT NULL,  -- Hex color (e.g., '#3B82F6')

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

-- ============================================================================
-- TABLE: questions
-- Purpose: 20 evaluation questions across six categories
-- ============================================================================

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

-- ============================================================================
-- TRIGGERS: Auto-update timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
