/**
 * Application Configuration
 *
 * IMPORTANT: When ready for production authentication:
 * 1. Set ENABLE_TEST_MODE to false
 * 2. Commit and redeploy
 *
 * Test mode allows anonymous users to evaluate vendors without authentication.
 * This is useful for alpha testing and demos.
 */

export const APP_CONFIG = {
  /**
   * Enable test mode for anonymous access
   *
   * When true: Users are automatically logged in as anonymous
   * When false: Real authentication via Supabase is required
   */
  ENABLE_TEST_MODE: true,

  /**
   * Anonymous user configuration (used when ENABLE_TEST_MODE = true)
   */
  ANONYMOUS_USER: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'anonymous@vendoreval.app',
  },
} as const;
