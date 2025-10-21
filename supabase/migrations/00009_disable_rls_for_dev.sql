-- Migration: Disable RLS for Development
-- Description: Temporarily disable RLS on evaluations table for local development
-- Phase: 2 - Development
-- NOTE: This should be removed or conditional in production!

-- Disable RLS on evaluations table for development
ALTER TABLE evaluations DISABLE ROW LEVEL SECURITY;
