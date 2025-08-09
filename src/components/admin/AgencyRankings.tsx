import React, { useState } from 'react';
import { Award, Trophy, Medal, Star, TrendingUp, Users, Building2, DollarSign, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AgencyRanking } from '../../types/admin';
import { RankingCalculator } from '../../utils/idGenerator';

export const AgencyRankings: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-S1');

  // Mock ranking data
  const rankings: AgencyRanking[] = [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default: return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const generateNewRanking = () => {
    console.log('Generating new ranking for period:', selectedPeriod);
    // Implementation for generating new ranking
  };

  const periods = [
    { value: '2024-S1', label: '1er Semestre 2024' },
    { value: '2023-S2', label: '2ème Semestre 2023' },
    { value: '2023-S1', label: '1er Semestre 2023' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Classement des Agences</h2>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>
          <Button onClick={generateNewRanking}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Générer Classement
          </Button>
        </div>
      </div>

      {/* Ranking Criteria */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Critères de Classement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium text-green-900">Volume de Biens</h4>
              <p className="text-sm text-green-700">Propriétés + Contrats (45%)</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-medium text-blue-900">Taux de Recouvrement</h4>
              <p className="text-sm text-blue-700">Collecte des loyers (30%)</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium text-purple-900">Satisfaction Clients</h4>
              <p className="text-sm text-purple-700">Locataires + Propriétaires (25%)</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Rankings List */}
      <div className="space-y-4">
        {rankings.map((ranking) => (
          <Card key={ranking.id} className="overflow-hidden">
            <div className={`h-2 ${getRankColor(ranking.rank)}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg">
                    {getRankIcon(ranking.rank)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        #{ranking.rank} {agencyNames[ranking.agencyId as keyof typeof agencyNames]}
                      </h3>
                      {ranking.rank <= 3 && (
                        <Badge variant="warning" size="sm">Podium</Badge>
                      )}
                    </div>
                    <p className="text-lg font-semibold text-gray-600">
                      Score: {ranking.score}/100
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Période</p>
                  <p className="font-medium">{ranking.period}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{ranking.metrics.totalProperties}</div>
                  <div className="text-xs text-gray-500">Propriétés</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{ranking.metrics.totalContracts}</div>
                  <div className="text-xs text-gray-500">Contrats</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{ranking.metrics.rentCollectionRate}%</div>
                  <div className="text-xs text-gray-500">Recouvrement</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{ranking.metrics.tenantSatisfaction}%</div>
                  <div className="text-xs text-gray-500">Satisfaction Locataires</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{ranking.metrics.ownerSatisfaction}%</div>
                  <div className="text-xs text-gray-500">Satisfaction Propriétaires</div>
                </div>
              </div>

              {/* Rewards */}
              {ranking.rewards.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Récompenses obtenues</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ranking.rewards.map((reward) => (
                      <div key={reward.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-yellow-900">{reward.title}</h5>
                          {reward.type === 'cash_bonus' && (
                            <Badge variant="success" size="sm">
                              {formatCurrency(reward.value)}
                            </Badge>
                          )}
                          {reward.type === 'discount' && (
                            <Badge variant="info" size="sm">
                              -{reward.value}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-yellow-800">{reward.description}</p>
                        <p className="text-xs text-yellow-600 mt-1">
                          Valide jusqu'au {reward.validUntil.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Next Ranking Info */}
      <Card>
        <div className="p-6 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Prochain Classement Annuel
          </h3>
          <p className="text-gray-600 mb-4">
            Le classement annuel 2024 sera généré automatiquement le 31 décembre 2024.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900">Période d'évaluation</p>
              <p className="text-blue-700">1er janvier - 31 décembre 2024</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-900">Récompenses totales</p>
              <p className="text-green-700">2,000,000 FCFA + abonnements gratuits</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="font-medium text-purple-900">Agences éligibles</p>
              <p className="text-purple-700">Agences actives depuis 6+ mois</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};