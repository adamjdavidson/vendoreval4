/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authService } from '../services/auth';

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
    // In development mode OR test mode, create a test user automatically
    // Test mode allows anonymous evaluations without authentication
    const isTestMode = import.meta.env.DEV || import.meta.env.VITE_TEST_MODE === 'true';

    if (isTestMode) {
      const anonymousUser = {
        id: '00000000-0000-0000-0000-000000000001', // Valid UUID for anonymous user
        email: 'anonymous@vendoreval.app',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User;

      setUser(anonymousUser);
      setLoading(false);
      return;
    }

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
