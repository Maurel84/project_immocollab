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