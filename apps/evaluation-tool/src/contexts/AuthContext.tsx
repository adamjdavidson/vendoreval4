/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authService } from '../services/auth';
import { APP_CONFIG } from '../config/app.config';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithDiscord: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if test mode is enabled
    if (APP_CONFIG.ENABLE_TEST_MODE) {
      // Test mode: Set anonymous user for alpha testing
      const anonymousUser = {
        id: APP_CONFIG.ANONYMOUS_USER.id,
        email: APP_CONFIG.ANONYMOUS_USER.email,
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User;

      setUser(anonymousUser);
      setLoading(false);
      return;
    }

    // Production mode: Use real Supabase authentication
    // Get initial session
    authService.getSession().then((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: authListener } = authService.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithDiscord = async () => {
    await authService.signInWithDiscord();
  };

  const signInWithEmail = async (email: string) => {
    await authService.signInWithEmail(email);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    signInWithDiscord,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
