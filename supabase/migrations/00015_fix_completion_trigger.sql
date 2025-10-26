-- Migration: Fix evaluation completion trigger
-- Description: Update trigger to use correct field name 'answer' instead of 'value'
-- Date: 2025-10-26

-- Drop and recreate the trigger function with correct field name
CREATE OR REPLACE FUNCTION update_evaluation_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.completed_question_count := (
    SELECT COUNT(*)
    FROM jsonb_array_elements(NEW.answers) AS answer
    WHERE answer->>'answer' IS NOT NULL
  );
  NEW.completion_percentage := ROUND((NEW.completed_question_count::FLOAT / 20.0) * 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger already exists, no need to recreate
-- Just replacing the function is enough
