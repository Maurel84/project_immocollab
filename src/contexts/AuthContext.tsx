import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, dbService } from '../lib/supabase';
import { User } from '../types';
import { PlatformAdmin } from '../types/admin';

interface AuthContextType {
  user: User | null;
  admin: PlatformAdmin | null;
  login: (email: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<PlatformAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!supabase) {
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if it's an admin first
          const { data: adminData } = await supabase
            .from('platform_admins')
            .select('*')
            .eq('id', session.user.id);

          if (adminData && adminData.length > 0) {
            const adminRecord = adminData[0];
            const adminUser: PlatformAdmin = {
              id: adminRecord.id,
              email: adminRecord.email,
              firstName: adminRecord.first_name,
              lastName: adminRecord.last_name,
              role: adminRecord.role,
              permissions: adminRecord.permissions,
              createdAt: new Date(adminRecord.created_at),
            };
            setAdmin(adminUser);
          } else {
            // Check for regular user
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id);

            if (userData && userData.length > 0) {
              const userRecord = userData[0];
              const userProfile: User = {
                id: userRecord.id,
                email: userRecord.email,
                firstName: userRecord.first_name,
                lastName: userRecord.last_name,
                role: userRecord.role,
                agencyId: userRecord.agency_id,
                avatar: userRecord.avatar,
                createdAt: new Date(userRecord.created_at),
              };
              setUser(userProfile);
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // If it's a network error, don't throw - just continue with demo mode
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.warn('Supabase connection failed, continuing in demo mode');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    if (supabase) {
      try {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT' || !session) {
            setUser(null);
            setAdmin(null);
          }
        });

        return () => {
          data?.subscription?.unsubscribe();
        };
      } catch (error) {
        console.warn('Auth state change listener failed:', error);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase non configuré. Veuillez configurer les variables d\'environnement.');
    }

    setIsLoading(true);
    try {
      // Demo accounts for testing

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id);

      if (userError || !userData || userData.length === 0) {
        throw new Error('Utilisateur non trouvé dans la base de données');
      }

      const userRecord = userData[0];
      const userProfile: User = {
        id: userRecord.id,
        email: userRecord.email,
        firstName: userRecord.first_name,
        lastName: userRecord.last_name,
        role: userRecord.role,
        agencyId: userRecord.agency_id,
        avatar: userRecord.avatar,
        createdAt: new Date(userRecord.created_at),
      };
      
      setUser(userProfile);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase non configuré. Veuillez configurer les variables d\'environnement.');
    }

    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error('Email ou mot de passe administrateur incorrect');
      }

      const { data: adminData, error: adminError } = await supabase
        .from('platform_admins')
        .select('*')
        .eq('id', authData.user.id);

      if (adminError || !adminData || adminData.length === 0) {
        throw new Error('Compte administrateur non trouvé');
      }

      const adminRecord = adminData[0];
      const adminUser: PlatformAdmin = {
        id: adminRecord.id,
        email: adminRecord.email,
        firstName: adminRecord.first_name,
        lastName: adminRecord.last_name,
        role: adminRecord.role,
        permissions: adminRecord.permissions,
        createdAt: new Date(adminRecord.created_at),
      };
      
      setAdmin(adminUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (supabase) {
      supabase.auth.signOut();
    }
    setUser(null);
    setAdmin(null);
  };

  const value = {
    user,
    admin,
    login,
    loginAdmin,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};