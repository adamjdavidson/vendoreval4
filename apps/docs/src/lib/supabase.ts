import { createClient } from '@supabase/supabase-js';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Use the same Supabase instance as the evaluation tool
// Both apps share the same database (users, admin_users, pages, etc.)

// Get config from window object (set by Docusaurus at build time)
// This is safe because Supabase client is only used in browser context
let supabaseUrl: string;
let supabaseAnonKey: string;

if (ExecutionEnvironment.canUseDOM) {
  // Browser: get from window.__DOCUSAURUS_CONFIG__
  const docusaurusConfig = (window as any).__DOCUSAURUS_CONFIG__;
  supabaseUrl = docusaurusConfig?.customFields?.supabaseUrl || 'http://127.0.0.1:54321';
  supabaseAnonKey = docusaurusConfig?.customFields?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
} else {
  // SSR: use defaults (won't actually be used since Supabase client only runs in browser)
  supabaseUrl = 'http://127.0.0.1:54321';
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
