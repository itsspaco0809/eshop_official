import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Clear the local Supabase session.
   *
   * This is important when the browser has an old refresh token
   * that no longer exists on the Supabase side.
   *
   * scope: 'local' prevents us from depending on the server-side
   * sign-out request when the refresh token itself is already invalid.
   */
  const clearLocalSession = useCallback(async () => {
    try {
      await supabase.auth.signOut({
        scope: 'local',
      });
    } catch (error) {
      console.warn('[Auth] Failed to clear local session:', error);
    }

    setSession(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let mounted = true;

    /**
     * Initial session restore
     */
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.warn('[Auth] getSession error:', error);

          /**
           * If Supabase reports an invalid refresh token,
           * remove the broken local session.
           */
          const message = error.message?.toLowerCase() ?? '';

          if (
            message.includes('invalid refresh token') ||
            message.includes('refresh token not found') ||
            message.includes('refresh_token_not_found')
          ) {
            await clearLocalSession();
            return;
          }

          setSession(null);
          setUser(null);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        if (!mounted) return;

        console.warn('[Auth] Failed to initialize session:', error);

        setSession(null);
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    /**
     * Auth state listener
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (!mounted) return;

      /**
       * Normal events:
       *
       * SIGNED_IN
       * SIGNED_OUT
       * TOKEN_REFRESHED
       * INITIAL_SESSION
       * USER_UPDATED
       */
      if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED' ||
        event === 'INITIAL_SESSION'
      ) {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        setLoading(false);
        return;
      }

      /**
       * Explicit sign out
       */
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      /**
       * Fallback for any other auth state.
       */
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [clearLocalSession]);

  /**
   * Sign in
   */
  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return {
          error: error.message,
        };
      }

      /**
       * onAuthStateChange normally handles this,
       * but explicitly syncing here makes the context more reliable.
       */
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }

      return {
        error: null,
      };
    },
    []
  );

  /**
   * Sign up
   */
  const signUp = useCallback(
    async (email: string, password: string) => {
      const { error, data } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        return {
          error: error.message,
        };
      }

      /**
       * Depending on Supabase email-confirmation settings,
       * session may be null after registration.
       */
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }

      return {
        error: null,
      };
    },
    []
  );

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    try {
      /**
       * Local scope is more robust for the frontend because
       * we don't need a valid refresh token to clear the browser session.
       */
      await supabase.auth.signOut({
        scope: 'local',
      });
    } catch (error) {
      console.warn('[Auth] Sign out error:', error);
    }

    /**
     * Always clear React state as well.
     */
    setSession(null);
    setUser(null);
  }, []);

  /**
   * Admin is determined ONLY from Supabase app_metadata.
   *
   * No frontend email whitelist.
   */
  const isAdmin = Boolean(
    user?.app_metadata?.role === 'admin'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return ctx;
}