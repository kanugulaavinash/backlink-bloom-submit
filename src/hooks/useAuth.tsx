
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: 'admin' | 'user' | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userRole: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first to catch all events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session ? 'session exists' : 'no session');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Defer role fetching to prevent deadlock
        setTimeout(() => {
          fetchUserRole(session.user.id);
        }, 0);
      } else {
        setUserRole(null);
        setIsLoading(false);
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'session exists' : 'no session');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Set up session refresh monitoring
    const refreshInterval = setInterval(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
          const now = new Date();
          const timeUntilExpiry = expiresAt ? expiresAt.getTime() - now.getTime() : 0;
          
          // Refresh if session expires within 5 minutes
          if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
            console.log('Refreshing session before expiry');
            supabase.auth.refreshSession();
          }
        }
      });
    }, 60000); // Check every minute

    return () => {
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle(); // Changed from .single() to .maybeSingle() for security

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user'); // Default to user role on error
      } else {
        setUserRole(data?.role || 'user'); // Default to user role if no role found
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user'); // Default to user role on error
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    userRole,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
