-- ============================================================================
-- Migration: Add key column to questions table
-- Purpose: Allow unique identification of questions by key (e.g., 'see-1')
-- ============================================================================

ALTER TABLE questions
ADD COLUMN key TEXT UNIQUE;

-- Backfill existing questions with generated keys
-- (This won't apply now since we haven't seeded yet, but good for future)
UPDATE questions
SET key = CONCAT(
  (SELECT key FROM categories WHERE id = questions.category_id),
  '-',
  questions.order_index
)
WHERE key IS NULL;

-- Make key NOT NULL after backfill
ALTER TABLE questions
ALTER COLUMN key SET NOT NULL;

-- Add index for faster lookups
CREATE INDEX idx_questions_key ON questions(key);
