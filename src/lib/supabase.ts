import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          'x-application-name': 'immobilier-platform',
        },
      },
    })
  : null;

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
};

// Helper function to check if Supabase is configured
const checkSupabaseConfig = () => {
  if (!supabase) {
    return null;
  }
  return supabase;
};

// Safe database operation wrapper with comprehensive error handling
const safeDbOperation = async (operation: () => Promise<any>, fallbackData: any = null) => {
  try {

    // FORCE DEMO MODE - Never attempt any Supabase operations
    console.log('Demo mode: Using fallback data');
    return fallbackData;
  } catch (error: any) {
    console.warn('Operation failed, using fallback:', error.message || error);

    const client = checkSupabaseConfig();
    if (!client) {
      return fallbackData;
    }
    return await operation();
  } catch (error: any) {
    // Gestion silencieuse des erreurs de réseau

    return fallbackData;
  }
};

// Mock data generators for demo mode
const generateMockOwners = (agencyId: string) => [
  {
    id: 'demo_owner_1',
    agency_id: agencyId,
    first_name: 'Jean',
    last_name: 'Kouassi',
    phone: '+225 01 02 03 04 05',
    email: 'jean.kouassi@email.com',
    address: 'Cocody Riviera',
    city: 'Abidjan',
    property_title: 'tf',
    marital_status: 'marie',
    spouse_name: 'Marie Kouassi',
    spouse_phone: '+225 01 02 03 04 06',
    children_count: 2,
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString()
  },
  {
    id: 'demo_owner_2',
    agency_id: agencyId,
    first_name: 'Aminata',
    last_name: 'Traore',
    phone: '+225 07 08 09 10 11',
    email: null,
    address: 'Yopougon Selmer',
    city: 'Abidjan',
    property_title: 'acd',
    marital_status: 'celibataire',
    spouse_name: null,
    spouse_phone: null,
    children_count: 0,
    created_at: new Date('2024-02-10').toISOString(),
    updated_at: new Date('2024-02-10').toISOString()
  }
];

const generateMockProperties = (agencyId: string) => [
  {
    id: 'demo_property_1',
    agency_id: agencyId,
    owner_id: 'demo_owner_1',
    title: 'Villa moderne 4 chambres',
    description: 'Belle villa avec jardin et piscine',
    location: {
      commune: 'Cocody',
      quartier: 'Riviera',
      numeroLot: '123',
      facilites: ['École primaire', 'Marché', 'Transport public']
    },
    details: { type: 'villa' },
    standing: 'haut',
    rooms: [],
    images: [],
    is_available: true,
    for_sale: false,
    for_rent: true,
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-01-20').toISOString(),
    owners: { first_name: 'Jean', last_name: 'Kouassi' }
  },
  {
    id: 'demo_property_2',
    agency_id: agencyId,
    owner_id: 'demo_owner_2',
    title: 'Appartement 3 pièces',
    description: 'Appartement bien situé avec balcon',
    location: {
      commune: 'Yopougon',
      quartier: 'Selmer',
      numeroLot: '456',
      facilites: ['École secondaire', 'Pharmacie']
    },
    details: { type: 'appartement' },
    standing: 'moyen',
    rooms: [],
    images: [],
    is_available: false,
    for_sale: true,
    for_rent: false,
    created_at: new Date('2024-02-15').toISOString(),
    updated_at: new Date('2024-02-15').toISOString(),
    owners: { first_name: 'Aminata', last_name: 'Traore' }
  }
];

const generateMockTenants = (agencyId: string) => [
  {
    id: 'demo_tenant_1',
    agency_id: agencyId,
    first_name: 'Koffi',
    last_name: 'Assouan',
    phone: '+225 05 06 07 08 09',
    email: 'koffi.assouan@email.com',
    address: 'Adjamé',
    city: 'Abidjan',
    marital_status: 'marie',
    spouse_name: 'Akissi Assouan',
    spouse_phone: '+225 05 06 07 08 10',
    children_count: 1,
    profession: 'Ingénieur',
    nationality: 'Ivoirienne',
    photo_url: null,
    id_card_url: null,
    payment_status: 'bon',
    created_at: new Date('2024-01-25').toISOString(),
    updated_at: new Date('2024-01-25').toISOString()
  }
];

const generateMockContracts = (agencyId: string) => [
  {
    id: 'demo_contract_1',
    agency_id: agencyId,
    property_id: 'demo_property_1',
    owner_id: 'demo_owner_1',
    tenant_id: 'demo_tenant_1',
    type: 'location',
    start_date: new Date('2024-02-01').toISOString(),
    end_date: new Date('2025-02-01').toISOString(),
    monthly_rent: 450000,
    sale_price: null,
    deposit: 900000,
    charges: 25000,
    commission_rate: 10,
    commission_amount: 45000,
    status: 'active',
    terms: 'Contrat de location standard',
    documents: [],
    created_at: new Date('2024-01-30').toISOString(),
    updated_at: new Date('2024-01-30').toISOString(),
    properties: { title: 'Villa moderne 4 chambres' },
    owners: { first_name: 'Jean', last_name: 'Kouassi' },
    tenants: { first_name: 'Koffi', last_name: 'Assouan' }
  }
];

// Database service functions
export const dbService = {
  // Agencies
  async createAgency(agency: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        // Mode démonstration
        return {
          id: `demo_agency_${Date.now()}`,
          ...agency,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      const { data, error } = await client
        .from('agencies')
        .insert(agency)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async getAgency(id: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        return {
          id,
          name: 'Agence Démonstration',
          commercial_register: 'DEMO-2024-001',
          city: 'Abidjan'
        };
      }
      
      const { data, error } = await client
        .from('agencies')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    });
  },

  // Users
  async createUser(user: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        return {
          id: `demo_user_${Date.now()}`,
          ...user,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      const { data, error } = await client
        .from('users')
        .insert(user)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async getUsers(agencyId: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) return [];
      
      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('agency_id', agencyId);
      if (error) throw error;
      return data || [];
    }, []);
  },

  async updateUser(id: string, updates: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        return { id, ...updates, updated_at: new Date().toISOString() };
      }
      
      const { data, error } = await client
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  // Owners
  async createOwner(owner: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        // Mode démonstration - simuler la création
        return {
          id: `demo_owner_${Date.now()}`,
          ...owner,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      const { data, error } = await client
        .from('owners')
        .insert(owner)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async getOwners(agencyId: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        // Mode démonstration - retourner des données d'exemple
        return generateMockOwners(agencyId);
      }
      
      const { data, error } = await client
        .from('owners')
        .select('*')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }, []);
  },

  async updateOwner(id: string, updates: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        return { id, ...updates, updated_at: new Date().toISOString() };
      }
      
      const { data, error } = await client
        .from('owners')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async deleteOwner(id: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) return;
      
      const { error } = await client
        .from('owners')
        .delete()
        .eq('id', id);
      if (error) throw error;
    });
  },

  async searchOwnersHistory(searchTerm: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) return [];
      
      const { data, error } = await client
        .from('owners')
        .select(`
          *,
          agencies(name)
        `)
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .limit(50);
      if (error) throw error;
      return data;
    }, []);
  },

  // Properties
  async createProperty(property: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        // Mode démonstration - simuler la création
        return {
          id: `demo_property_${Date.now()}`,
          ...property,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      const { data, error } = await client
        .from('properties')
        .insert(property)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async getProperties(agencyId: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        // Mode démonstration - retourner des données d'exemple
        return generateMockProperties(agencyId);
      }
      
      const { data, error } = await client
        .from('properties')
        .select(`
          *,
          owners(first_name, last_name)
        `)
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }, []);
  },

  async updateProperty(id: string, updates: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        return { id, ...updates, updated_at: new Date().toISOString() };
      }
      
      const { data, error } = await client
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async deleteProperty(id: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) return;
      
      const { error } = await client
        .from('properties')
        .delete()
        .eq('id', id);
      if (error) throw error;
    });
  },

  // Tenants
  async createTenant(tenant: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        // Mode démonstration - simuler la création
        return {
          id: `demo_tenant_${Date.now()}`,
          ...tenant,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      const { data, error } = await client
        .from('tenants')
        .insert(tenant)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async getTenants(agencyId: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        // Mode démonstration - retourner des données d'exemple
        return generateMockTenants(agencyId);
      }
      
      const { data, error } = await client
        .from('tenants')
        .select('*')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }, []);
  },

  async updateTenant(id: string, updates: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        return { id, ...updates, updated_at: new Date().toISOString() };
      }
      
      const { data, error } = await client
        .from('tenants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async deleteTenant(id: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) return;
      
      const { error } = await client
        .from('tenants')
        .delete()
        .eq('id', id);
      if (error) throw error;
    });
  },

  async searchTenantsHistory(searchTerm: string, paymentStatus?: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) return [];
      
      let query = client
        .from('tenants')
        .select(`
          *,
          agencies(name)
        `)
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);

      if (paymentStatus && paymentStatus !== 'all') {
        query = query.eq('payment_status', paymentStatus);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    }, []);
  },

  // Contracts
  async createContract(contract: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        // Mode démonstration - simuler la création

        const newContract = {

        return {

          id: `demo_contract_${Date.now()}`,
          ...contract,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        
        // Stocker en localStorage pour persistance
        const existingContracts = JSON.parse(localStorage.getItem('demo_contracts') || '[]');
        existingContracts.push(newContract);
        localStorage.setItem('demo_contracts', JSON.stringify(existingContracts));
        
        return newContract;


      }
      
      const { data, error } = await client
        .from('contracts')
        .insert(contract)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async getContracts(agencyId: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {

        // Mode démonstration - retourner les contrats stockés + contrats générés
        const storedContracts = JSON.parse(localStorage.getItem('demo_contracts') || '[]');
        const generatedContracts = JSON.parse(localStorage.getItem('generated_contracts') || '[]');
        const allContracts = [...storedContracts, ...generatedContracts];
        return allContracts.filter((contract: any) => contract.agency_id === agencyId);

        // Mode démonstration - retourner des données d'exemple
        return generateMockContracts(agencyId);

      }
      
      const { data, error } = await client
        .from('contracts')
        .select(`
          *,
          properties(title),
          owners(first_name, last_name),
          tenants(first_name, last_name)
        `)
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }, []);
  },

  async updateContract(id: string, updates: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        return { id, ...updates, updated_at: new Date().toISOString() };
      }
      
      const { data, error } = await client
        .from('contracts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async deleteContract(id: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) return;
      
      const { error } = await client
        .from('contracts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    });
  },

  // Announcements
  async createAnnouncement(announcement: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        return {
          id: `demo_announcement_${Date.now()}`,
          ...announcement,
          created_at: new Date().toISOString()
        };
      }
      
      const { data, error } = await client
        .from('announcements')
        .insert(announcement)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async getAnnouncements() {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) return [];
      
      const { data, error } = await client
        .from('announcements')
        .select(`
          *,
          agencies(name),
          properties(title, location)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }, []);
  },

  // Messages
  async createMessage(message: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        return {
          id: `demo_message_${Date.now()}`,
          ...message,
          created_at: new Date().toISOString()
        };
      }
      
      const { data, error } = await client
        .from('messages')
        .insert(message)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async getMessages(userId: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) return [];
      
      const { data, error } = await client
        .from('messages')
        .select(`
          *,
          sender:users!sender_id(first_name, last_name),
          receiver:users!receiver_id(first_name, last_name)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }, []);
  },

  // Notifications
  async createNotification(notification: any) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        return {
          id: `demo_notification_${Date.now()}`,
          ...notification,
          created_at: new Date().toISOString()
        };
      }
      
      const { data, error } = await client
        .from('notifications')
        .insert(notification)
        .select()
        .single();
      if (error) throw error;
      return data;
    });
  },

  async getNotifications(userId: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) return [];
      
      const { data, error } = await client
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }, []);
  },

  async markNotificationAsRead(id: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        return { id, is_read: true, updated_at: new Date().toISOString() };
      }
      
      const { data, error } = await client
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    });

  },

  // Receipts
  async getReceipts(agencyId: string) {
    return safeDbOperation(async () => {
      const client = checkSupabaseConfig();
      if (!client) {
        // Mode démonstration - retourner des données d'exemple
        return [];
      }
      
      const { data, error } = await client
        .from('rent_receipts')
        .select(`
          *,
          properties(title),
          owners(first_name, last_name),
          tenants(first_name, last_name)
        `)
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }, []);


  }
};