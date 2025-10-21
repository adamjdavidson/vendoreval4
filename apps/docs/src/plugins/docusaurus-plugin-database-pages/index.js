/**
 * Docusaurus Plugin: Database Pages
 *
 * Fetches published pages from Supabase and renders them as Docusaurus pages
 * with dual-tone toggle (No BS vs Corporate).
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-database-pages',

    async loadContent() {
      // Initialize Supabase client
      // Note: Using hardcoded values for local dev (same as apps/docs/src/lib/supabase.ts)
      const supabaseUrl = 'http://127.0.0.1:54321';
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      try {
        // Fetch all published pages
        const { data: pages, error } = await supabase
          .from('pages')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading pages from database:', error);
          return { pages: [] };
        }

        console.log(`[Database Pages Plugin] Loaded ${pages?.length || 0} published pages from database`);
        return { pages: pages || [] };
      } catch (err) {
        console.error('Error in loadContent:', err);
        return { pages: [] };
      }
    },

    async contentLoaded({ content, actions }) {
      const { createData, addRoute } = actions;
      const { pages } = content;

      if (!pages || pages.length === 0) {
        console.log('[Database Pages Plugin] No pages to create routes for');
        return;
      }

      // Create routes for each page
      for (const page of pages) {
        try {
          // Create JSON data file for this page
          const pageDataPath = await createData(
            `db-page-${page.id}.json`,
            JSON.stringify(page)
          );

          // Add route for this page
          addRoute({
            path: `/db/${page.slug}`,
            component: path.resolve(__dirname, './DatabasePage.js'),
            modules: {
              pageData: pageDataPath,
            },
            exact: true,
          });

          console.log(`[Database Pages Plugin] Created route: /db/${page.slug}`);
        } catch (err) {
          console.error(`Error creating route for page ${page.slug}:`, err);
        }
      }
    },

    getPathsToWatch() {
      // Watch for changes to the plugin files
      return [path.resolve(__dirname, './')];
    },
  };
};
