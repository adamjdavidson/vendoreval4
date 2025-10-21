-- Migration: Additional RLS Policies
-- Description: Admin management policies for content tables
-- Phase: 2 - Foundational

-- ============================================================================
-- ADMIN MANAGEMENT POLICIES
-- Purpose: Allow admins to manage content (categories, questions, vendors)
-- ============================================================================

-- Admins can manage categories (insert, update, delete)
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- Admins can manage questions (insert, update, delete)
CREATE POLICY "Admins can manage questions"
  ON questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- Admins can manage vendors (insert, update, delete)
CREATE POLICY "Admins can manage vendors"
  ON vendors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- Admins can manage vendor evaluations (insert, update, delete)
CREATE POLICY "Admins can manage vendor evaluations"
  ON vendor_evaluations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- Admins can view all evaluations (read-only, for support)
CREATE POLICY "Admins can view all evaluations"
  ON evaluations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );
