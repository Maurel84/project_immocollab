<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Home, Building2, Users, UserCheck, FileText, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { StatsCard } from './StatsCard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BibleVerse } from './BibleVerse';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { dbService } from '../../lib/supabase';
=======
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
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

<<<<<<< HEAD
  // Load data with hooks
=======
  // Load real data from Supabase
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
  const { data: owners, refetch: refetchOwners } = useSupabaseData(dbService.getOwners);
  const { data: properties, refetch: refetchProperties } = useSupabaseData(dbService.getProperties);
  const { data: tenants, refetch: refetchTenants } = useSupabaseData(dbService.getTenants);
  const { data: contracts, refetch: refetchContracts } = useSupabaseData(dbService.getContracts);

<<<<<<< HEAD
  // Calculate stats from real data
  const stats = {
    totalProperties: properties.length,
    availableProperties: properties.filter(p => p.is_available).length,
    totalOwners: owners.length,
    totalTenants: tenants.length,
    activeContracts: contracts.filter(c => c.status === 'active').length,
    totalRevenue: contracts
      .filter(c => c.status === 'active' && c.monthly_rent)
      .reduce((sum, c) => sum + (c.monthly_rent || 0), 0),
    totalCommissions: contracts
      .filter(c => c.status === 'active')
      .reduce((sum, c) => sum + (c.commission_amount || 0), 0),
  };

=======
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
  
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

<<<<<<< HEAD
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
=======
  // Afficher un message d'accueil pour les nouvelles agences
  const isNewAgency = owners.length === 0 && properties.length === 0 && tenants.length === 0 && contracts.length === 0;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
<<<<<<< HEAD
          <p className="text-gray-600 mt-1">
=======
          <p className="text-gray-600">
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
            Bienvenue, {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>

      {/* Bible Verse */}
      <BibleVerse />

<<<<<<< HEAD
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Propriétés"
          value={stats.totalProperties}
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Propriétaires"
          value={stats.totalOwners}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Locataires"
          value={stats.totalTenants}
          icon={UserCheck}
          trend={{ value: 15, isPositive: true }}
          color="yellow"
        />
        <StatsCard
          title="Contrats actifs"
          value={stats.activeContracts}
          icon={FileText}
          trend={{ value: 5, isPositive: true }}
          color="red"
        />
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-green-500">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Revenus mensuels
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="flex items-center text-green-600">
                  ↗ 12%
                </span>
                <span className="ml-2 text-gray-500">vs mois précédent</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-blue-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Commissions
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(stats.totalCommissions)}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="flex items-center text-green-600">
                  ↗ 8%
                </span>
                <span className="ml-2 text-gray-500">vs mois précédent</span>
              </div>
            </div>
=======
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
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
          </div>
        </Card>
      </div>

<<<<<<< HEAD
      {/* Quick Actions */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => window.location.href = '/owners'}
            >
              <Users className="h-6 w-6 mb-2" />
              <span>Ajouter propriétaire</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => window.location.href = '/properties'}
            >
              <Building2 className="h-6 w-6 mb-2" />
              <span>Ajouter propriété</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => window.location.href = '/tenants'}
            >
              <UserCheck className="h-6 w-6 mb-2" />
              <span>Ajouter locataire</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => window.location.href = '/contracts'}
            >
              <FileText className="h-6 w-6 mb-2" />
              <span>Nouveau contrat</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
          <div className="space-y-3">
            {properties.slice(0, 3).map((property) => (
              <div key={property.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{property.title}</p>
                  <p className="text-sm text-gray-500">
                    Propriété ajoutée le {new Date(property.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
            
            {owners.slice(0, 2).map((owner) => (
              <div key={owner.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {owner.first_name} {owner.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Propriétaire ajouté le {new Date(owner.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}

            {(properties.length === 0 && owners.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune activité récente</p>
                <p className="text-sm">Commencez par ajouter des propriétaires et des propriétés</p>
              </div>
            )}
          </div>
        </div>
      </Card>
=======
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
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
    </div>
  );
};