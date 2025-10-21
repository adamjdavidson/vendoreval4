-- Migration: Vendor Tables
-- Description: Tables for vendors and official vendor evaluations
-- Phase: 2 - Foundational

-- ============================================================================
-- TABLE: vendors
-- Purpose: AI vendors that can be evaluated (official library + user-created)
-- ============================================================================

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

-- ============================================================================
-- TABLE: vendor_evaluations
-- Purpose: Official pre-analyzed vendor assessments (e.g., Glean analysis)
-- ============================================================================

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

-- ============================================================================
-- TRIGGERS: Auto-update timestamps
-- ============================================================================

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_evaluations_updated_at
  BEFORE UPDATE ON vendor_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
