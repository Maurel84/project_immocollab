import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatsCard } from './StatsCard';
import { BibleVerse } from './BibleVerse';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { dbService, isSupabaseConfigured } from '../../lib/supabase';
import { 
  Users, 
  Home, 
  FileText, 
  DollarSign,
  TrendingUp,
  Calendar,
  Bell,
  Plus
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Load real data from Supabase
  const { data: owners, refetch: refetchOwners } = useSupabaseData(dbService.getOwners);
  const { data: properties, refetch: refetchProperties } = useSupabaseData(dbService.getProperties);
  const { data: tenants, refetch: refetchTenants } = useSupabaseData(dbService.getTenants);
  const { data: contracts, refetch: refetchContracts } = useSupabaseData(dbService.getContracts);

  // Calculate stats
  const totalRevenue = contracts.reduce((sum, contract) => sum + (contract.commission_amount || 0), 0);
  const activeContracts = contracts.filter(contract => contract.status === 'active').length;
  const availableProperties = properties.filter(property => property.is_available).length;

  // Refresh data when component mounts or when navigating back to dashboard
  React.useEffect(() => {
    const refreshData = () => {
      refetchOwners();
      refetchProperties();
      refetchTenants();
      refetchContracts();
    };

    // Refresh immediately
    refreshData();

    // Listen for storage events (when data is updated in other components)
    const handleStorageChange = () => {
      refreshData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', refreshData);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', refreshData);
    };
  }, [refetchOwners, refetchProperties, refetchTenants, refetchContracts]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Afficher un message d'accueil pour les nouvelles agences
  const isNewAgency = owners.length === 0 && properties.length === 0 && tenants.length === 0 && contracts.length === 0;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Bienvenue, {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>

      {/* Bible Verse */}
      <BibleVerse />

      {/* Message d'erreur de connexion */}
      {!isSupabaseConfigured() && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mode démonstration activé
            </h3>
            <p className="text-gray-600 mb-4">
              Supabase n'est pas configuré. L'application fonctionne en mode démonstration.
              Pour activer toutes les fonctionnalités, configurez les variables d'environnement Supabase.
            </p>
            <div className="text-sm text-yellow-600">
              <p>📝 Toutes les fonctionnalités sont disponibles</p>
              <p>💾 Les données ne sont pas persistées</p>
            </div>
          </div>
        </Card>
      )}

      {/* Message d'accueil pour nouvelles agences */}
      {isNewAgency && isSupabaseConfigured() && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bienvenue dans votre espace de gestion immobilière !
            </h3>
            <p className="text-gray-600 mb-4">
              Votre agence est maintenant créée. Commencez par ajouter vos premiers propriétaires et propriétés 
              en utilisant les boutons d'actions rapides ci-dessous.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
              <span>✨ 30 jours d'essai gratuit</span>
              <span>•</span>
              <span>🚀 Toutes les fonctionnalités incluses</span>
            </div>
          </div>
        </Card>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Propriétaires"
          value={owners.length.toString()}
          icon={Users}
          trend={{ value: 0, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Locataires"
          value={tenants.length.toString()}
          icon={Users}
          trend={{ value: 0, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Propriétés"
          value={`${properties.length} (${availableProperties} dispo.)`}
          icon={Home}
          trend={{ value: 0, isPositive: true }}
          color="yellow"
        />
        <StatsCard
          title="Revenus"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend={{ value: 0, isPositive: true }}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Activités récentes
          </h3>
          <div className="space-y-3">
            {isNewAgency ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-3">Commencez votre gestion immobilière</p>
                <p className="text-sm text-gray-400">Les activités apparaîtront ici une fois que vous aurez ajouté des données</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucune activité récente
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Notifications
          </h3>
          <div className="space-y-3">
            {isNewAgency ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-3">Espace de notifications</p>
                <p className="text-sm text-gray-400">Vous recevrez ici les alertes importantes</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucune notification
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Calendar and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Contrats actifs
          </h3>
          <div className="space-y-3">
            {isNewAgency ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-3">Vos contrats apparaîtront ici</p>
                <p className="text-sm text-gray-400">Créez des propriétaires et locataires pour générer vos premiers contrats</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucun contrat actif
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Actions rapides
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/owners'}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau propriétaire
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/properties'}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle propriété
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/tenants'}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau locataire
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/contracts'}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau contrat
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/receipts'}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle quittance
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/furnished'}>
              <Plus className="w-4 h-4 mr-2" />
              Résidence meublée
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};