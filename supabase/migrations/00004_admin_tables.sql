-- Migration: Admin Tables
-- Description: Admin users and invite codes for access control
-- Phase: 2 - Foundational

-- ============================================================================
-- TABLE: admin_users
-- Purpose: Users with admin CMS access
-- ============================================================================

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES users(id) ON DELETE SET NULL,  -- Which admin granted this
  is_super_admin BOOLEAN DEFAULT FALSE NOT NULL,  -- Super admin cannot be demoted
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,  -- Soft delete for audit trail
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);

-- RLS Policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can read all admin records
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- Only super admins can grant admin access
CREATE POLICY "Super admins can manage admin users"
  ON admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_super_admin = TRUE
        AND au.revoked_at IS NULL
    )
  );

-- Trigger to prevent super admin demotion
CREATE OR REPLACE FUNCTION prevent_super_admin_demotion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_super_admin = TRUE AND NEW.is_super_admin = FALSE THEN
    RAISE EXCEPTION 'Cannot demote super admin';
  END IF;
  IF OLD.is_super_admin = TRUE AND NEW.revoked_at IS NOT NULL THEN
    RAISE EXCEPTION 'Cannot revoke super admin access';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_super_admin_protection
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_super_admin_demotion();

-- ============================================================================
-- TABLE: invite_codes
-- Purpose: Invitation codes for non-Discord users
-- ============================================================================

CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,  -- Unique invite code (e.g., "EVAL-2024-ABC123")
  email TEXT,  -- Optional: restrict to specific email
  created_by UUID NOT NULL REFERENCES admin_users(user_id) ON DELETE CASCADE,
  used_by UUID REFERENCES users(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,  -- Default: 7 days from creation
  is_active BOOLEAN DEFAULT TRUE NOT NULL,  -- Can be manually disabled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_email ON invite_codes(email);

-- RLS Policies
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- Admins can view all invite codes
CREATE POLICY "Admins can view invite codes"
  ON invite_codes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- Admins can create invite codes
CREATE POLICY "Admins can create invite codes"
  ON invite_codes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- Public read for code validation (during signup)
CREATE POLICY "Public can validate invite codes"
  ON invite_codes FOR SELECT
  USING (
    is_active = TRUE
    AND expires_at > NOW()
    AND used_at IS NULL
  );
