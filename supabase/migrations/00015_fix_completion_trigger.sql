-- Migration: Fix evaluation completion trigger
-- Description: Update trigger to use correct field name 'answer' instead of 'value'
-- Date: 2025-10-26

-- Drop the trigger first to ensure clean recreation
DROP TRIGGER IF EXISTS update_evaluation_completion_trigger ON evaluations;

-- Drop and recreate the trigger function with correct field name
DROP FUNCTION IF EXISTS update_evaluation_completion();

CREATE FUNCTION update_evaluation_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.completed_question_count := (
    SELECT COUNT(*)
    FROM jsonb_array_elements(NEW.answers) AS answer_elem
    WHERE answer_elem->>'answer' IS NOT NULL
  );
  NEW.completion_percentage := ROUND((NEW.completed_question_count::FLOAT / 20.0) * 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER update_evaluation_completion_trigger
  BEFORE INSERT OR UPDATE ON evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_evaluation_completion();
