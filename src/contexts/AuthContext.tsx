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

        // FORCE DEMO MODE - No database operations
        console.log('Application en mode démonstration complet');
        
        // Check for existing session in localStorage
        const savedUser = localStorage.getItem('user');
        const savedAdmin = localStorage.getItem('admin');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else if (savedAdmin) {
          setAdmin(JSON.parse(savedAdmin));
        }
      } catch (error) {
        console.warn('Session check failed:', error);

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

  }, []);

  // Comptes de démonstration pour les agences
  const demoAccounts = [
    {
      email: 'marie.kouassi@agence.com',
      password: 'demo123',
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      firstName: 'Marie',
      lastName: 'Kouassi',
      role: 'director',
      agencyId: 'demo_agency_1'
    },
    {
      email: 'manager1@agence.com',
      password: 'demo123',
      id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
      firstName: 'Kouadio',
      lastName: 'Yao',
      role: 'manager',
      agencyId: 'demo_agency_1'
    },
    {
      email: 'agent1@agence.com',
      password: 'demo123',
      id: 'd4e5f6a7-b8c9-0123-def4-56789012345',
      firstName: 'Fatou',
      lastName: 'Diallo',
      role: 'agent',
      agencyId: 'demo_agency_1'
    },
    // Votre compte personnel
    {
      email: 'gagohi06@gmail.com',
      password: 'Jesus2025',
      id: 'personal-account-001',
      firstName: 'Maurel',
      lastName: 'Agohi',
      role: 'director',
      agencyId: 'personal_agency_001'
    }
  ];

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Vérifier les comptes de démonstration d'abord
      const demoAccount = demoAccounts.find(
        account => account.email === email && account.password === password
      );

      if (demoAccount) {
        // Utiliser le compte de démonstration
        const userProfile: User = {
          id: demoAccount.id,
          email: demoAccount.email,
          firstName: demoAccount.firstName,
          lastName: demoAccount.lastName,
          role: demoAccount.role as User['role'],
          agencyId: demoAccount.agencyId,
          createdAt: new Date(),
        };
        
        setUser(userProfile);
        localStorage.setItem('user', JSON.stringify(userProfile));
        return;
      }

      // Si aucun compte démo trouvé, essayer Supabase (si configuré)
      if (supabase) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          throw new Error('Email ou mot de passe incorrect');
        }

        if (!authData.user) {
          throw new Error('Erreur de connexion');
        }

        // Récupérer le profil utilisateur
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          throw new Error('Profil utilisateur non trouvé');
        }

        const user: User = {
          id: userProfile.id,
          email: userProfile.email,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          role: userProfile.role,
          agencyId: userProfile.agency_id,
          createdAt: new Date(userProfile.created_at),
        };

        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        throw new Error('Email ou mot de passe incorrect');
      }


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

    // Comptes admin de démonstration - fonctionnement sans Supabase
    const demoAdminAccounts = [
      {
        email: 'admin@immoplatform.ci',
        password: 'admin123',
        id: 'admin-demo-1',
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'super_admin' as const,
        permissions: { all: true }
      },
      {
        email: 'support@immoplatform.ci',
        password: 'admin123',
        id: 'admin-demo-2',
        firstName: 'Support',
        lastName: 'Admin',
        role: 'admin' as const,
        permissions: { agencies: true, support: true }
      }
    ];

    setIsLoading(true);
    try {
      // Vérifier les comptes de démonstration
      const demoAccount = demoAdminAccounts.find(
        account => account.email === email && account.password === password
      );

      if (!demoAccount) {
        throw new Error('Email ou mot de passe administrateur incorrect');
      }

      // Utiliser le compte de démonstration
      const adminUser: PlatformAdmin = {
        id: demoAccount.id,
        email: demoAccount.email,
        firstName: demoAccount.firstName,
        lastName: demoAccount.lastName,
        role: demoAccount.role,
        permissions: demoAccount.permissions,
        createdAt: new Date(),
      };
      
      setAdmin(adminUser);
      localStorage.setItem('admin', JSON.stringify(adminUser));

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

    setUser(null);
    setAdmin(null);
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    
    // Déconnexion Supabase si configuré
    if (supabase) {
      supabase.auth.signOut().catch(console.warn);
    }

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