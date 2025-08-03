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
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction(agencyId);
      setData(result || []);
      setError(null);
    } catch (err) {
      // Mode dégradé - pas d'erreur affichée
      setData([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.agencyId, ...dependencies]);

  const refetch = () => {
    fetchData();
    // Trigger storage event to notify other components
    window.dispatchEvent(new Event('storage'));
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(errorMessage);
      throw new Error(errorMessage);
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      throw err;
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
    // Si Supabase n'est pas configuré, simuler la suppression
    if (!isSupabaseConfigured()) {
      onSuccess?.();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await deleteFunction(id);
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error };
}