import { supabase } from '../lib/supabase';

/**
 * CMS Service
 *
 * Provides CRUD operations for the pages table in the CMS.
 * All operations require admin authentication (enforced by RLS policies).
 */

export interface Page {
  id: string;
  slug: string;
  title_no_bs: string;
  title_corporate: string;
  content_no_bs: string;
  content_corporate: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePageInput {
  slug: string;
  title_no_bs: string;
  title_corporate: string;
  content_no_bs: string;
  content_corporate: string;
  is_published?: boolean;
}

export interface UpdatePageInput {
  slug?: string;
  title_no_bs?: string;
  title_corporate?: string;
  content_no_bs?: string;
  content_corporate?: string;
  is_published?: boolean;
}

export const cmsService = {
  /**
   * Fetch all pages (admin view)
   * Returns both published and unpublished pages
   */
  async getAllPages(): Promise<Page[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch pages: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Fetch single page by ID
   * @param id - The page ID
   */
  async getPageById(id: string): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new Error(`Failed to fetch page: ${error.message}`);
    }

    return data;
  },

  /**
   * Fetch single page by slug
   * @param slug - The page slug (e.g., 'help', 'about')
   */
  async getPageBySlug(slug: string): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new Error(`Failed to fetch page: ${error.message}`);
    }

    return data;
  },

  /**
   * Fetch all published pages (public view)
   * Used by the Docusaurus plugin to render public pages
   */
  async getPublishedPages(): Promise<Page[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch published pages: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Create new page
   * @param pageData - Page data to create
   */
  async createPage(pageData: CreatePageInput): Promise<Page> {
    const { data, error } = await supabase
      .from('pages')
      .insert([pageData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create page: ${error.message}`);
    }

    return data;
  },

  /**
   * Update existing page
   * @param id - Page ID
   * @param updates - Fields to update
   */
  async updatePage(id: string, updates: UpdatePageInput): Promise<Page> {
    const { data, error } = await supabase
      .from('pages')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update page: ${error.message}`);
    }

    return data;
  },

  /**
   * Delete page
   * @param id - Page ID
   */
  async deletePage(id: string): Promise<void> {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete page: ${error.message}`);
    }
  },

  /**
   * Toggle publish status
   * @param id - Page ID
   * @param published - New publish status
   */
  async togglePublishStatus(id: string, published: boolean): Promise<Page> {
    const { data, error } = await supabase
      .from('pages')
      .update({
        is_published: published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update publish status: ${error.message}`);
    }

    return data;
  },

  /**
   * Auto-generate corporate version from no-bs content
   * Calls the generate-corporate-tone Edge Function
   * @param noBsContent - The no-bs content (Markdown)
   * @returns Corporate version (Markdown)
   */
  async generateCorporateTone(noBsContent: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke('generate-corporate-tone', {
      body: { noBsContent },
    });

    if (error) {
      throw new Error(`Failed to generate corporate tone: ${error.message}`);
    }

    return data.corporateContent;
  },
};
