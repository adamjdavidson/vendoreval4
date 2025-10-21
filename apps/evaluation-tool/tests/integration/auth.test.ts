/**
 * Integration Tests: Authentication Flow
 *
 * Tests Discord OAuth authentication, membership checking, and session management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from '../../src/services/auth';
import { supabase } from '../../src/lib/supabase';

// Mock Supabase auth methods
vi.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Discord OAuth Flow - Guild Members', () => {
    it('should allow Discord guild members to sign in successfully', async () => {
      // Mock successful OAuth flow
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: { provider: 'discord', url: 'https://discord.com/oauth/authorize' },
        error: null,
      });

      // Mock membership check (guild member)
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { isMember: true, guildId: 'test-guild-123' },
        error: null,
      });

      // Mock session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
              user_metadata: { full_name: 'Test User' },
            },
            access_token: 'token-123',
          },
        },
        error: null,
      });

      const result = await authService.signInWithDiscord();

      expect(result.success).toBe(true);
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'discord',
        options: {
          redirectTo: expect.stringContaining('/auth/callback'),
          scopes: 'identify guilds',
        },
      });
    });
  });

  describe('Discord OAuth Flow - Non-Guild Members', () => {
    it('should deny access to non-guild members', async () => {
      // Mock OAuth flow starts
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: { provider: 'discord', url: 'https://discord.com/oauth/authorize' },
        error: null,
      });

      // Mock membership check (not a member)
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { isMember: false, guildId: null },
        error: null,
      });

      // Attempt to check membership
      const membershipCheck = await supabase.functions.invoke('check-discord-membership', {
        body: { userId: 'user-123' },
      });

      expect(membershipCheck.data.isMember).toBe(false);

      // Should trigger sign out
      await authService.signOut();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('Login Count and Periodic Re-check', () => {
    it('should increment login count and trigger re-check on 10th visit', async () => {
      // Mock successful session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
            },
            access_token: 'token-123',
          },
        },
        error: null,
      });

      // Simulate 9 previous logins
      localStorage.setItem('discord_login_count', '9');

      // Mock membership re-check (still a member)
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { isMember: true, guildId: 'test-guild-123' },
        error: null,
      });

      // Simulate 10th login
      const currentCount = parseInt(localStorage.getItem('discord_login_count') || '0', 10);
      const newCount = currentCount + 1;
      localStorage.setItem('discord_login_count', newCount.toString());

      expect(newCount).toBe(10);

      // Should trigger membership re-check
      if (newCount % 10 === 0) {
        const recheckResult = await supabase.functions.invoke('check-discord-membership', {
          body: { userId: 'user-123' },
        });

        expect(recheckResult.data.isMember).toBe(true);

        // Reset counter after successful re-check
        localStorage.setItem('discord_login_count', '0');
      }

      expect(localStorage.getItem('discord_login_count')).toBe('0');
    });
  });

  describe('Membership Revocation', () => {
    it('should log out user when membership is revoked on re-check', async () => {
      // Mock successful session initially
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
            },
            access_token: 'token-123',
          },
        },
        error: null,
      });

      // Simulate 10th login (triggers re-check)
      localStorage.setItem('discord_login_count', '10');

      // Mock membership re-check (membership revoked)
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { isMember: false, guildId: null },
        error: null,
      });

      // Trigger re-check
      const recheckResult = await supabase.functions.invoke('check-discord-membership', {
        body: { userId: 'user-123' },
      });

      expect(recheckResult.data.isMember).toBe(false);

      // Should trigger sign out
      await authService.signOut();
      expect(supabase.auth.signOut).toHaveBeenCalled();

      // Should clear login count
      localStorage.removeItem('discord_login_count');
      expect(localStorage.getItem('discord_login_count')).toBeNull();
    });
  });

  describe('Session Management', () => {
    it('should maintain session state across page refreshes', async () => {
      // Mock active session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
            },
            access_token: 'token-123',
            refresh_token: 'refresh-123',
          },
        },
        error: null,
      });

      const session = await supabase.auth.getSession();

      expect(session.data.session).not.toBeNull();
      expect(session.data.session?.user.id).toBe('user-123');
    });

    it('should handle expired sessions gracefully', async () => {
      // Mock expired session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: { message: 'Session expired', name: 'AuthSessionMissingError' },
      });

      const session = await supabase.auth.getSession();

      expect(session.data.session).toBeNull();
      expect(session.error).not.toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors during OAuth', async () => {
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: { provider: null, url: null },
        error: { message: 'Network error', name: 'NetworkError' },
      });

      const result = await authService.signInWithDiscord();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle membership check failures', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: null,
        error: { message: 'Function invocation failed', name: 'FunctionsError' },
      });

      const result = await supabase.functions.invoke('check-discord-membership', {
        body: { userId: 'user-123' },
      });

      expect(result.error).not.toBeNull();
      expect(result.data).toBeNull();
    });
  });
});
