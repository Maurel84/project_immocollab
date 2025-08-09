import React, { useState, useEffect } from 'react';
import { Home, Building2, Users, UserCheck, FileText, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { StatsCard } from './StatsCard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BibleVerse } from './BibleVerse';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { dbService } from '../../lib/supabase';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Load data with hooks
  const { data: owners, refetch: refetchOwners } = useSupabaseData(dbService.getOwners);
  const { data: properties, refetch: refetchProperties } = useSupabaseData(dbService.getProperties);
  const { data: tenants, refetch: refetchTenants } = useSupabaseData(dbService.getTenants);
  const { data: contracts, refetch: refetchContracts } = useSupabaseData(dbService.getContracts);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenue, {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>

      {/* Bible Verse */}
      <BibleVerse />

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
          </div>
        </Card>
      </div>

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
    </div>
  );
};