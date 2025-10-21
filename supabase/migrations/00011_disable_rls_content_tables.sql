-- Migration: Disable RLS on Content Tables for Development
-- Description: Fix infinite recursion in RLS policies by disabling RLS on content tables
-- Phase: 2 - Development Fix

-- Disable RLS on content tables (categories, questions, vendors, vendor_evaluations)
-- These tables have admin-only policies that cause infinite recursion
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_evaluations DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes DISABLE ROW LEVEL SECURITY;
