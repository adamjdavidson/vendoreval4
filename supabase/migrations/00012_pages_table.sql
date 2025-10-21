-- Migration: Create pages table for CMS
-- Description: CMS pages with dual-tone content (No BS / Corporate)
-- Purpose: Documentation site content management

CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,  -- URL path (e.g., 'help', 'about', 'faq')

  -- Dual-tone content
  title_no_bs TEXT NOT NULL,
  title_corporate TEXT NOT NULL,
  content_no_bs TEXT NOT NULL,  -- Markdown content
  content_corporate TEXT NOT NULL,

  is_published BOOLEAN DEFAULT FALSE NOT NULL,  -- Draft vs published
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_published ON pages(is_published);

-- RLS Policies
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Public can view published pages
CREATE POLICY "Public can view published pages"
  ON pages FOR SELECT
  USING (is_published = TRUE);

-- Admins can manage all pages
CREATE POLICY "Admins can manage pages"
  ON pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.revoked_at IS NULL
    )
  );

-- Comments
COMMENT ON TABLE pages IS 'CMS pages with dual-tone content for documentation site';
COMMENT ON COLUMN pages.slug IS 'URL path (e.g., help, about, faq)';
COMMENT ON COLUMN pages.content_no_bs IS 'Markdown content - No BS version';
COMMENT ON COLUMN pages.content_corporate IS 'Markdown content - Corporate friendly version';
COMMENT ON COLUMN pages.is_published IS 'Draft vs published - allows admin preview before publishing';
