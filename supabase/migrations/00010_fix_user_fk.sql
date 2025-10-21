-- Migration: Fix User Foreign Key
-- Description: Drop invalid foreign key constraint on evaluations.user_id
-- Phase: 2 - Development Fix
-- The original migration referenced users(id) which doesn't exist
-- We need to drop this constraint to allow dev users

-- Drop the invalid foreign key constraint
ALTER TABLE evaluations DROP CONSTRAINT IF EXISTS evaluations_user_id_fkey;
