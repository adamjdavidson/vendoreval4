-- Migration: Evaluation Tables
-- Description: User-created vendor evaluations
-- Phase: 2 - Foundational

-- ============================================================================
-- TABLE: evaluations
-- Purpose: User-created evaluations (their own assessments of vendors)
-- ============================================================================

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

-- ============================================================================
-- TRIGGERS: Auto-update timestamps and completion fields
-- ============================================================================

CREATE TRIGGER update_evaluations_updated_at
  BEFORE UPDATE ON evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update completion fields
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

CREATE TRIGGER update_evaluation_completion_trigger
  BEFORE INSERT OR UPDATE ON evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_evaluation_completion();
