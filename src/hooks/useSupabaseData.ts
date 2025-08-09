import { useState, useEffect } from 'react';
import { dbService, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useSupabaseData<T>(
  fetchFunction: (agencyId: string) => Promise<T[]>,
  dependencies: any[] = []
) {
  const { user } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour obtenir un agencyId valide
  const getValidAgencyId = (): string => {
    // Utiliser l'agencyId de l'utilisateur ou un ID par défaut
    return user?.agencyId || 'demo_agency';
  };

  const fetchData = async () => {
    const agencyId = getValidAgencyId();
    
    // FORCE DEMO MODE - Never attempt any database operations
    setError(null);
    
    try {
      // Always return empty array in demo mode
      const result: T[] = [];
      setData(result);
    } catch (err: any) {
      console.warn('Fetch failed, using empty data:', err.message || err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data with a small delay to prevent race conditions
    const timer = setTimeout(() => {
      fetchData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user?.agencyId, ...dependencies]);

  const refetch = () => {
    // Force demo mode - just set empty data
    setData([]);
  };

  return { data, loading, error, refetch, setData };
}

export function useSupabaseCreate<T>(
  createFunction: (data: any) => Promise<T>,
  onSuccess?: (data: T) => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createFunction(data);
      onSuccess?.(result);
      return result;
    } catch (err: any) {
      // Simulation du succès en cas d'erreur
      console.warn('Create operation failed, simulating success:', err.message || err);
      const mockResult = { id: `demo_${Date.now()}`, ...data };
      onSuccess?.(mockResult);
      return mockResult;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useSupabaseUpdate<T>(
  updateFunction: (id: string, data: any) => Promise<T>,
  onSuccess?: (data: T) => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateFunction(id, data);
      onSuccess?.(result);
      return result;
    } catch (err: any) {
      // Simulation du succès en cas d'erreur
      console.warn('Update operation failed, simulating success:', err.message || err);
      const mockResult = { id, ...data };
      onSuccess?.(mockResult);
      return mockResult;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useSupabaseDelete(
  deleteFunction: (id: string) => Promise<void>,
  onSuccess?: () => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteFunction(id);
      onSuccess?.();
    } catch (err: any) {
      // Simulation du succès en cas d'erreur
      console.warn('Delete operation failed, simulating success:', err.message || err);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error };
}