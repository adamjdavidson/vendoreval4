import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser extends User {
  email: string;
}

export const authService = {

  /**
   * Sign in with magic link (email)
   */
  async signInWithEmail(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign out current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get current user
   */
  async getUser(): Promise<AuthUser | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user as AuthUser | null;
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(
    callback: (event: string, session: Session | null) => void
  ) {
    return supabase.auth.onAuthStateChange(callback);
  },

  /**
   * Check Discord guild membership via Edge Function
   */
  async checkDiscordMembership(userId: string): Promise<boolean> {
    const { data, error } = await supabase.functions.invoke('check-discord-membership', {
      body: { userId },
    });

    if (error) {
      console.error('Membership check failed:', error);
      return false;
    }

    return data?.isMember || false;
  },

  /**
   * Implement periodic membership re-check (every 10 logins)
   * Logs out user if membership is revoked
   */
  async performPeriodicMembershipCheck(userId: string): Promise<void> {
    // Get login count from localStorage
    const loginCountStr = localStorage.getItem('discord_login_count') || '0';
    const loginCount = parseInt(loginCountStr, 10);
    const newLoginCount = loginCount + 1;

    // Store updated count
    localStorage.setItem('discord_login_count', newLoginCount.toString());

    // Check membership every 10 logins
    if (newLoginCount % 10 === 0) {
      const isMember = await this.checkDiscordMembership(userId);

      if (!isMember) {
        // Membership revoked - log out user
        console.warn('Discord guild membership revoked. Logging out user.');
        await this.signOut();
        localStorage.removeItem('discord_login_count');
        throw new Error('Discord guild membership required');
      }

      // Reset counter after successful re-check
      localStorage.setItem('discord_login_count', '0');
    }
  },

  /**
   * Sign in with Discord OAuth and verify guild membership
   */
  async signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'identify guilds',
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },
};
