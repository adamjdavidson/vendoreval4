-- Temporarily disable RLS on pages table for local development
-- In production, you'll need proper admin authentication

-- Disable RLS
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;

-- Add a comment explaining this is for dev only
COMMENT ON TABLE pages IS 'CMS pages - RLS disabled for local development. Enable for production with proper admin auth.';
