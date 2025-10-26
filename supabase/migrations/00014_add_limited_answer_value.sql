-- Migration: Add 'limited' answer value support
-- Description: Update documentation to reflect new 'limited' answer option
-- Date: 2025-10-26

-- Update comment on evaluations.answers column
COMMENT ON COLUMN evaluations.answers IS
'Answers stored as JSONB array. Format: [{ questionId: uuid, value: ''yes''|''limited''|''no''|''not-enough-info'', note: ''text'' }]';

-- No schema changes needed - JSONB already supports any value
-- This migration exists to document the change in allowed answer values
