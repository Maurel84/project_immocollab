import React, { useState, useEffect } from 'react';
import { Activity, Search, Download, Trash2, Eye, Filter, Calendar, User, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { ActivityLogger } from '../../utils/activityLogger';
import { ActivityLog } from '../../types/logs';
import { useAuth } from '../../contexts/AuthContext';

export const ActivityLogs: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterEntityType, setFilterEntityType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (user?.agencyId) {
      const agencyLogs = ActivityLogger.getLogs(user.agencyId);
      setLogs(agencyLogs);
      setFilteredLogs(agencyLogs);
    }
  }, [user?.agencyId]);

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    if (filterEntityType !== 'all') {
      filtered = filtered.filter(log => log.entityType === filterEntityType);
    }

    if (filterUser !== 'all') {
      filtered = filtered.filter(log => log.userId === filterUser);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, filterAction, filterEntityType, filterUser]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'view': return '👁️';
      case 'generate_contract': return '📄';
      case 'print_receipt': return '🖨️';
      default: return '📝';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create': return 'Création';
      case 'update': return 'Modification';
      case 'delete': return 'Suppression';
      case 'view': return 'Consultation';
      case 'generate_contract': return 'Génération contrat';
      case 'print_receipt': return 'Impression quittance';
      default: return action;
    }
  };

  const getEntityTypeLabel = (entityType: string) => {
    switch (entityType) {
      case 'owner': return 'Propriétaire';
      case 'tenant': return 'Locataire';
      case 'property': return 'Propriété';
      case 'contract': return 'Contrat';
      case 'receipt': return 'Quittance';
      default: return entityType;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'success';
      case 'update': return 'warning';
      case 'delete': return 'danger';
      case 'view': return 'info';
      case 'generate_contract': return 'info';
      case 'print_receipt': return 'secondary';
      default: return 'secondary';
    }
  };

  const exportLogs = () => {
    if (!user?.agencyId) return;
    
    const logsData = ActivityLogger.exportLogs(user.agencyId);
    const blob = new Blob([logsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    if (!user?.agencyId) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les logs d\'activité ?')) {
      ActivityLogger.clearLogs(user.agencyId);
      setLogs([]);
      setFilteredLogs([]);
    }
  };

  const uniqueUsers = Array.from(new Set(logs.map(log => log.userId)))
    .map(userId => {
      const log = logs.find(l => l.userId === userId);
      return { id: userId, name: log?.userName || 'Utilisateur inconnu' };
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Journal d'Activité</h1>
          <p className="text-gray-600 mt-1">
            Historique de toutes les actions effectuées dans l'agence
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          {user?.role === 'director' && (
            <Button variant="danger" onClick={clearLogs}>
              <Trash2 className="h-4 w-4 mr-2" />
              Vider les logs
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {logs.length}
            </div>
            <p className="text-sm text-gray-600">Total actions</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {logs.filter(log => log.action === 'create').length}
            </div>
            <p className="text-sm text-gray-600">Créations</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {logs.filter(log => log.action === 'update').length}
            </div>
            <p className="text-sm text-gray-600">Modifications</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {uniqueUsers.length}
            </div>
            <p className="text-sm text-gray-600">Utilisateurs actifs</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans les logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les actions</option>
              <option value="create">Créations</option>
              <option value="update">Modifications</option>
              <option value="delete">Suppressions</option>
              <option value="view">Consultations</option>
              <option value="generate_contract">Contrats générés</option>
              <option value="print_receipt">Quittances imprimées</option>
            </select>
            
            <select
              value={filterEntityType}
              onChange={(e) => setFilterEntityType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="owner">Propriétaires</option>
              <option value="tenant">Locataires</option>
              <option value="property">Propriétés</option>
              <option value="contract">Contrats</option>
              <option value="receipt">Quittances</option>
            </select>

            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les utilisateurs</option>
              {uniqueUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={getActionColor(log.action)} size="sm">
                        {getActionLabel(log.action)}
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        {getEntityTypeLabel(log.entityType)}
                      </Badge>
                    </div>
                    <p className="font-medium text-gray-900">
                      {log.entityName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {log.details}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {log.userName}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {log.timestamp.toLocaleDateString('fr-FR')} à {log.timestamp.toLocaleTimeString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedLog(log);
                    setShowDetails(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <Card className="p-8 text-center">
          <Activity className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune activité trouvée
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterAction !== 'all' || filterEntityType !== 'all' || filterUser !== 'all'
              ? 'Aucune activité ne correspond à vos critères de recherche.'
              : 'Les activités de l\'agence apparaîtront ici.'}
          </p>
        </Card>
      )}

      {/* Log Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedLog(null);
        }}
        title="Détails de l'activité"
        size="md"
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Action</p>
                <Badge variant={getActionColor(selectedLog.action)} size="sm">
                  {getActionLabel(selectedLog.action)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type d'entité</p>
                <Badge variant="secondary" size="sm">
                  {getEntityTypeLabel(selectedLog.entityType)}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Entité concernée</p>
              <p className="font-medium text-gray-900">{selectedLog.entityName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Détails</p>
              <p className="text-gray-700">{selectedLog.details}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Utilisateur</p>
                <p className="font-medium text-gray-900">{selectedLog.userName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date et heure</p>
                <p className="font-medium text-gray-900">
                  {selectedLog.timestamp.toLocaleDateString('fr-FR')} à{' '}
                  {selectedLog.timestamp.toLocaleTimeString('fr-FR')}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">ID de l'entité</p>
              <p className="font-mono text-xs text-gray-600">{selectedLog.entityId}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Navigateur</p>
              <p className="text-xs text-gray-600 break-all">{selectedLog.userAgent}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};