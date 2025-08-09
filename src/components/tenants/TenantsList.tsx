import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, User, Phone, MapPin, Briefcase, Flag, FileText, DollarSign, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { TenantForm } from './TenantForm';
import { Tenant, TenantFormData } from '../../types/tenant';
import { useSupabaseData, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from '../../hooks/useSupabaseData';
import { dbService } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ReceiptGenerator } from '../receipts/ReceiptGenerator';
import { FinancialStatements } from '../financial/FinancialStatements';
import { Modal } from '../ui/Modal';
import { ContractGenerator } from '../contracts/ContractGenerator';
import { ActivityLogger } from '../../utils/activityLogger';

export const TenantsList: React.FC = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showTenantDetails, setShowTenantDetails] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [showReceiptGenerator, setShowReceiptGenerator] = useState(false);
  const [showFinancialStatements, setShowFinancialStatements] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showContractGenerator, setShowContractGenerator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMaritalStatus, setFilterMaritalStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');

  // Supabase data hooks
  const { data: tenants, loading, error, refetch, setData } = useSupabaseData<Tenant>(
    dbService.getTenants
  );
  
  // Charger les propriétés disponibles pour les contrats
  const { data: properties } = useSupabaseData(dbService.getProperties);

  const { create: createTenant, loading: creating } = useSupabaseCreate(
    dbService.createTenant,
    (newTenant) => {
      setData(prev => [newTenant, ...prev]);
      setShowForm(false);
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('storage'));
      
      // Log the creation
      if (user) {
        ActivityLogger.log(
          user.id,
          `${user.firstName} ${user.lastName}`,
          user.agencyId,
          'create',
          'tenant',
          newTenant.id,
          `${newTenant.first_name} ${newTenant.last_name}`,
          `Nouveau locataire créé - Profession: ${newTenant.profession}, Statut: ${newTenant.payment_status}`
        );
      }
      
      // Proposer la génération d'un contrat de bail avec sélection de propriété
      if (confirm('Locataire créé avec succès ! Voulez-vous générer un contrat de bail ?')) {
        setSelectedTenant(newTenant);
        setShowContractGenerator(true);
      }
    }
  );

  const { update: updateTenant, loading: updating } = useSupabaseUpdate(
    dbService.updateTenant,
    (updatedTenant) => {
      setData(prev => prev.map(tenant => 
        tenant.id === updatedTenant.id ? updatedTenant : tenant
      ));
      setShowForm(false);
      setEditingTenant(null);
      
      // Log the update
      if (user) {
        ActivityLogger.log(
          user.id,
          `${user.firstName} ${user.lastName}`,
          user.agencyId,
          'update',
          'tenant',
          updatedTenant.id,
          `${updatedTenant.first_name} ${updatedTenant.last_name}`,
          'Informations du locataire mises à jour'
        );
      }
    }
  );

  const { deleteItem: deleteTenant, loading: deleting } = useSupabaseDelete(
    dbService.deleteTenant,
    () => {
      refetch();
      // Log will be added in handleDeleteTenant
    }
  );

  const handleAddTenant = async (tenantData: TenantFormData) => {
    if (!user?.agencyId) return;
    
    try {
      // Validation des données avant envoi
      if (!tenantData.firstName || !tenantData.lastName || !tenantData.phone || !tenantData.profession) {
        throw new Error('Données obligatoires manquantes');
      }
      
      if (editingTenant) {
        // Mode modification
        await updateTenant(editingTenant.id, {
          first_name: tenantData.firstName,
          last_name: tenantData.lastName,
          phone: tenantData.phone,
          email: tenantData.email || null,
          address: tenantData.address,
          city: tenantData.city,
          marital_status: tenantData.maritalStatus,
          spouse_name: tenantData.spouseName || null,
          spouse_phone: tenantData.spousePhone || null,
          children_count: tenantData.childrenCount,
          profession: tenantData.profession,
          nationality: tenantData.nationality,
          photo_url: tenantData.photoUrl || null,
          id_card_url: tenantData.idCardUrl || null,
          payment_status: tenantData.paymentStatus,
        });
        alert('Locataire modifié avec succès !');
      } else {
        // Mode création
        await createTenant({
          agency_id: user.agencyId,
          first_name: tenantData.firstName,
          last_name: tenantData.lastName,
          phone: tenantData.phone,
          email: tenantData.email || null,
          address: tenantData.address,
          city: tenantData.city,
          marital_status: tenantData.maritalStatus,
          spouse_name: tenantData.spouseName || null,
          spouse_phone: tenantData.spousePhone || null,
          children_count: tenantData.childrenCount,
          profession: tenantData.profession,
          nationality: tenantData.nationality,
          photo_url: tenantData.photoUrl || null,
          id_card_url: tenantData.idCardUrl || null,
          payment_status: tenantData.paymentStatus,
        });
        alert('Locataire créé avec succès !');
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
      alert('Erreur lors de la création du locataire. Veuillez réessayer.');
    }
  };

  const handleDeleteTenant = async (tenantId: string) => {
    const tenantToDelete = tenants.find(t => t.id === tenantId);
    if (confirm('Êtes-vous sûr de vouloir supprimer ce locataire ?')) {
      try {
        // Log the deletion before actual deletion
        if (user && tenantToDelete) {
          ActivityLogger.log(
            user.id,
            `${user.firstName} ${user.lastName}`,
            user.agencyId,
            'delete',
            'tenant',
            tenantId,
            `${tenantToDelete.first_name} ${tenantToDelete.last_name}`,
            'Locataire supprimé définitivement'
          );
        }
        await deleteTenant(tenantId);
      } catch (error) {
        console.error('Error deleting tenant:', error);
      }
    }
  };

  const handleViewTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowTenantDetails(true);
    
    // Log the view action
    if (user) {
      ActivityLogger.log(
        user.id,
        `${user.firstName} ${user.lastName}`,
        user.agencyId,
        'view',
        'tenant',
        tenant.id,
        `${tenant.first_name} ${tenant.last_name}`,
        'Consultation de la fiche locataire'
      );
    }
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setShowForm(true);
    
    // Log the edit action
    if (user) {
      ActivityLogger.log(
        user.id,
        `${user.firstName} ${user.lastName}`,
        user.agencyId,
        'view',
        'tenant',
        tenant.id,
        `${tenant.first_name} ${tenant.last_name}`,
        'Ouverture du formulaire de modification'
      );
    }
  };

  const handleGenerateReceipt = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowReceiptGenerator(true);
    
    // Log receipt generation
    if (user) {
      ActivityLogger.log(
        user.id,
        `${user.firstName} ${user.lastName}`,
        user.agencyId,
        'print_receipt',
        'tenant',
        tenant.id,
        `${tenant.first_name} ${tenant.last_name}`,
        'Génération d\'une quittance de loyer'
      );
    }
  };

  const handleGenerateContract = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowContractGenerator(true);
    
    // Log contract generation
    if (user) {
      ActivityLogger.log(
        user.id,
        `${user.firstName} ${user.lastName}`,
        user.agencyId,
        'generate_contract',
        'tenant',
        tenant.id,
        `${tenant.first_name} ${tenant.last_name}`,
        'Génération d\'un contrat de bail'
      );
    }
  };

  const getMaritalStatusLabel = (status: string) => {
    const labels = {
      celibataire: 'Célibataire',
      marie: 'Marié(e)',
      divorce: 'Divorcé(e)',
      veuf: 'Veuf/Veuve'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels = {
      bon: 'Bon payeur',
      irregulier: 'Payeur irrégulier',
      mauvais: 'Mauvais payeur'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getMaritalStatusColor = (status: string) => {
    switch (status) {
      case 'marie': return 'success';
      case 'celibataire': return 'info';
      case 'divorce': return 'warning';
      case 'veuf': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'bon': return 'success';
      case 'irregulier': return 'warning';
      case 'mauvais': return 'danger';
      default: return 'secondary';
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = 
      tenant.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.includes(searchTerm) ||
      tenant.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMaritalStatus = filterMaritalStatus === 'all' || tenant.marital_status === filterMaritalStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || tenant.payment_status === filterPaymentStatus;
    
    return matchesSearch && matchesMaritalStatus && matchesPaymentStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Erreur: {error}</p>
        <Button onClick={refetch}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locataires</h1>
          <p className="text-gray-600 mt-1">
            Gestion des locataires et historique des paiements
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter un locataire</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone, profession ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterMaritalStatus}
              onChange={(e) => setFilterMaritalStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes situations</option>
              <option value="celibataire">Célibataire</option>
              <option value="marie">Marié(e)</option>
              <option value="divorce">Divorcé(e)</option>
              <option value="veuf">Veuf/Veuve</option>
            </select>
            
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="bon">Bon payeur</option>
              <option value="irregulier">Payeur irrégulier</option>
              <option value="mauvais">Mauvais payeur</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {tenant.photo_url ? (
                    <img
                      src={tenant.photo_url}
                      alt={`${tenant.first_name} ${tenant.last_name}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {tenant.first_name} {tenant.last_name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-3 w-3 mr-1" />
                      <span>{tenant.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewTenant(tenant)}
                    title="Voir la fiche complète"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {/* Actions réservées aux Directeurs et Managers */}
                  {(user?.role === 'director' || user?.role === 'manager') && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditTenant(tenant)}
                        title="Modifier les informations"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleGenerateReceipt(tenant)}
                        title="Générer quittance"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleGenerateContract(tenant)}
                        title="Générer contrat de bail"
                      >
                        <DollarSign className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteTenant(tenant.id)}
                        disabled={deleting}
                        title="Supprimer le locataire"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-green-600" />
                  <span>{tenant.address}, {tenant.city}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2 text-orange-600" />
                  <span>{tenant.profession}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Flag className="h-4 w-4 mr-2 text-purple-600" />
                  <span>{tenant.nationality}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Situation:</span>
                  <Badge variant={getMaritalStatusColor(tenant.marital_status)} size="sm">
                    {getMaritalStatusLabel(tenant.marital_status)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Paiement:</span>
                  <Badge variant={getPaymentStatusColor(tenant.payment_status)} size="sm">
                    {getPaymentStatusLabel(tenant.payment_status)}
                  </Badge>
                </div>

                {tenant.marital_status === 'marie' && tenant.spouse_name && (
                  <div className="text-sm text-gray-600 bg-pink-50 p-2 rounded">
                    <p><strong>Conjoint:</strong> {tenant.spouse_name}</p>
                    <p><strong>Tél:</strong> {tenant.spouse_phone}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Enfants:</span>
                  <span className="font-medium text-gray-900">{tenant.children_count}</span>
                </div>

                {tenant.email && (
                  <div className="text-sm text-gray-600">
                    <strong>Email:</strong> {tenant.email}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Ajouté le {new Date(tenant.created_at).toLocaleDateString('fr-FR')}</span>
                  <div className="flex items-center space-x-2">
                    {tenant.photo_url && (
                      <span className="text-green-600">📷</span>
                    )}
                    {tenant.id_card_url && (
                      <span className="text-blue-600">🆔</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <User className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun locataire trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterMaritalStatus !== 'all' || filterPaymentStatus !== 'all'
              ? 'Aucun locataire ne correspond à vos critères de recherche.'
              : 'Commencez par ajouter votre premier locataire.'}
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un locataire
          </Button>
        </div>
      )}

      <TenantForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTenant(null);
        }}
        onSubmit={handleAddTenant}
        initialData={editingTenant ? {
          firstName: editingTenant.first_name,
          lastName: editingTenant.last_name,
          phone: editingTenant.phone,
          email: editingTenant.email || '',
          address: editingTenant.address,
          city: editingTenant.city,
          maritalStatus: editingTenant.marital_status,
          spouseName: editingTenant.spouse_name || '',
          spousePhone: editingTenant.spouse_phone || '',
          childrenCount: editingTenant.children_count,
          profession: editingTenant.profession,
          nationality: editingTenant.nationality,
          photoUrl: editingTenant.photo_url || '',
          idCardUrl: editingTenant.id_card_url || '',
          paymentStatus: editingTenant.payment_status,
          agencyId: editingTenant.agency_id,
        } : undefined}
      />

      {/* Tenant Details Modal */}
      <Modal
        isOpen={showTenantDetails}
        onClose={() => {
          setShowTenantDetails(false);
          setSelectedTenant(null);
        }}
        title="Détails du locataire"
        size="lg"
      >
        {selectedTenant && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {selectedTenant.photo_url ? (
                <img
                  src={selectedTenant.photo_url}
                  alt={`${selectedTenant.first_name} ${selectedTenant.last_name}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedTenant.first_name} {selectedTenant.last_name}
                </h3>
                <p className="text-gray-600">{selectedTenant.profession}</p>
                <Badge variant={getPaymentStatusColor(selectedTenant.payment_status)} size="sm" className="mt-1">
                  {getPaymentStatusLabel(selectedTenant.payment_status)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informations personnelles</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Téléphone:</strong> {selectedTenant.phone}</p>
                  {selectedTenant.email && <p><strong>Email:</strong> {selectedTenant.email}</p>}
                  <p><strong>Adresse:</strong> {selectedTenant.address}, {selectedTenant.city}</p>
                  <p><strong>Profession:</strong> {selectedTenant.profession}</p>
                  <p><strong>Nationalité:</strong> {selectedTenant.nationality}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Situation familiale</h4>
                <div className="space-y-2">
                  <Badge variant={getMaritalStatusColor(selectedTenant.marital_status)} size="sm">
                    {getMaritalStatusLabel(selectedTenant.marital_status)}
                  </Badge>
                  {selectedTenant.marital_status === 'marie' && selectedTenant.spouse_name && (
                    <div className="mt-2 p-3 bg-pink-50 rounded-lg text-sm">
                      <p><strong>Conjoint:</strong> {selectedTenant.spouse_name}</p>
                      <p><strong>Téléphone:</strong> {selectedTenant.spouse_phone}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Nombre d'enfants:</strong> {selectedTenant.children_count}
                  </p>
                </div>
              </div>
            </div>

            {selectedTenant.id_card_url && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                <img
                  src={selectedTenant.id_card_url}
                  alt="Pièce d'identité"
                  className="w-full max-w-md h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      <ReceiptGenerator
        isOpen={showReceiptGenerator}
        onClose={() => {
          setShowReceiptGenerator(false);
          setSelectedTenant(null);
        }}
        tenantId={selectedTenant?.id}
      />

      <Modal
        isOpen={showFinancialStatements}
        onClose={() => {
          setShowFinancialStatements(false);
          setSelectedTenant(null);
        }}
        title="État financier du locataire"
        size="xl"
      >
        {selectedTenant && (
          <FinancialStatements
            entityId={selectedTenant.id}
            entityType="tenant"
            entityName={`${selectedTenant.first_name} ${selectedTenant.last_name}`}
          />
        )}
      </Modal>

      <ContractGenerator
        isOpen={showContractGenerator}
        onClose={() => {
          setShowContractGenerator(false);
          setSelectedTenant(null);
        }}
        type="bail"
        tenantData={selectedTenant}
        onContractGenerated={(contract) => {
          console.log('Contrat de bail généré:', contract);
          alert('Contrat de bail généré avec succès !');
        }}
      />
    </div>
  );
};