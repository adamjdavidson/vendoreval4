-- Migration: Feedback Table
-- Description: User feedback submissions with GitHub issue integration
-- Phase: 2 - Foundational

-- ============================================================================
-- TABLE: feedback
-- Purpose: User feedback submissions with GitHub issue integration
-- ============================================================================

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
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Authenticated users can create feedback
CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

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

-- Admins can update feedback status and notes
CREATE POLICY "Admins can update feedback"
  ON feedback FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- ============================================================================
-- TRIGGERS: Auto-update timestamps
-- ============================================================================

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
