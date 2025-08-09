import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, User, Phone, MapPin, FileText, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { OwnerForm } from './OwnerForm';
import { Owner, OwnerFormData } from '../../types/owner';
<<<<<<< HEAD
import { useSupabaseData, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from '../../hooks/useSupabaseData';
=======
import { useSupabaseData, useSupabaseCreate, useSupabaseDelete } from '../../hooks/useSupabaseData';
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
import { dbService } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ContractGenerator } from '../contracts/ContractGenerator';
import { Modal } from '../ui/Modal';
<<<<<<< HEAD
import { ActivityLogger } from '../../utils/activityLogger';
=======
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766

export const OwnersList: React.FC = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
<<<<<<< HEAD
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
=======
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
  const [showContractGenerator, setShowContractGenerator] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPropertyTitle, setFilterPropertyTitle] = useState('all');
  const [filterMaritalStatus, setFilterMaritalStatus] = useState('all');
<<<<<<< HEAD
  const [showContractDetails, setShowContractDetails] = useState(false);
  const [ownerContract, setOwnerContract] = useState<string>('');
=======
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766

  // Supabase data hooks
  const { data: owners, loading, error, refetch, setData } = useSupabaseData<Owner>(
    dbService.getOwners
  );

  const { create: createOwner, loading: creating } = useSupabaseCreate(
    dbService.createOwner,
    (newOwner) => {
      setData(prev => [newOwner, ...prev]);
      setShowForm(false);
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('storage'));
      
<<<<<<< HEAD
      // Log the creation
      if (user) {
        ActivityLogger.log(
          user.id,
          `${user.firstName} ${user.lastName}`,
          user.agencyId,
          'create',
          'owner',
          newOwner.id,
          `${newOwner.first_name} ${newOwner.last_name}`,
          `Nouveau propriétaire créé avec titre: ${newOwner.property_title}`
        );
      }
      
=======
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
      // Proposer la génération d'un contrat de gestion
      if (confirm('Propriétaire créé avec succès ! Voulez-vous générer un contrat de gestion ?')) {
        setSelectedOwner(newOwner);
        setShowContractGenerator(true);
      }
    }
  );

<<<<<<< HEAD
  const { update: updateOwner, loading: updating } = useSupabaseUpdate(
    dbService.updateOwner,
    (updatedOwner) => {
      setData(prev => prev.map(owner => 
        owner.id === updatedOwner.id ? updatedOwner : owner
      ));
      setShowForm(false);
      setEditingOwner(null);
      
      // Log the update
      if (user) {
        ActivityLogger.log(
          user.id,
          `${user.firstName} ${user.lastName}`,
          user.agencyId,
          'update',
          'owner',
          updatedOwner.id,
          `${updatedOwner.first_name} ${updatedOwner.last_name}`,
          'Informations du propriétaire mises à jour'
        );
      }
    }
  );

  const { deleteItem: deleteOwner, loading: deleting } = useSupabaseDelete(
    dbService.deleteOwner,
    () => {
      refetch();
      // Log will be added in handleDeleteOwner
    }
=======
  const { deleteItem: deleteOwner, loading: deleting } = useSupabaseDelete(
    dbService.deleteOwner,
    () => refetch()
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
  );

  const handleAddOwner = async (ownerData: OwnerFormData) => {
    if (!user?.agencyId) return;
    
    try {
<<<<<<< HEAD
      if (editingOwner) {
        // Mode modification
        await updateOwner(editingOwner.id, {
          first_name: ownerData.firstName,
          last_name: ownerData.lastName,
          phone: ownerData.phone,
          email: ownerData.email || null,
          address: ownerData.address,
          city: ownerData.city,
          property_title: ownerData.propertyTitle,
          property_title_details: ownerData.propertyTitleDetails || null,
          marital_status: ownerData.maritalStatus,
          spouse_name: ownerData.spouseName || null,
          spouse_phone: ownerData.spousePhone || null,
          children_count: ownerData.childrenCount,
        });
        alert('Propriétaire modifié avec succès !');
      } else {
        // Mode création
        await createOwner({
          agency_id: user.agencyId,
          first_name: ownerData.firstName,
          last_name: ownerData.lastName,
          phone: ownerData.phone,
          email: ownerData.email || null,
          address: ownerData.address,
          city: ownerData.city,
          property_title: ownerData.propertyTitle,
          property_title_details: ownerData.propertyTitleDetails || null,
          marital_status: ownerData.maritalStatus,
          spouse_name: ownerData.spouseName || null,
          spouse_phone: ownerData.spousePhone || null,
          children_count: ownerData.childrenCount,
        });
        alert('Propriétaire créé avec succès !');
      }
=======
      await createOwner({
        agency_id: user.agencyId,
        first_name: ownerData.firstName,
        last_name: ownerData.lastName,
        phone: ownerData.phone,
        email: ownerData.email || null,
        address: ownerData.address,
        city: ownerData.city,
        property_title: ownerData.propertyTitle,
        property_title_details: ownerData.propertyTitleDetails || null,
        marital_status: ownerData.maritalStatus,
        spouse_name: ownerData.spouseName || null,
        spouse_phone: ownerData.spousePhone || null,
        children_count: ownerData.childrenCount,
      });
      
      alert('Propriétaire créé avec succès !');
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
    } catch (error) {
      console.error('Error creating owner:', error);
    }
  };

  const handleDeleteOwner = async (ownerId: string) => {
<<<<<<< HEAD
    const ownerToDelete = owners.find(o => o.id === ownerId);
    if (confirm('Êtes-vous sûr de vouloir supprimer ce propriétaire ?')) {
      try {
        // Log the deletion before actual deletion
        if (user && ownerToDelete) {
          ActivityLogger.log(
            user.id,
            `${user.firstName} ${user.lastName}`,
            user.agencyId,
            'delete',
            'owner',
            ownerId,
            `${ownerToDelete.first_name} ${ownerToDelete.last_name}`,
            'Propriétaire supprimé définitivement'
          );
        }
=======
    if (confirm('Êtes-vous sûr de vouloir supprimer ce propriétaire ?')) {
      try {
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
        await deleteOwner(ownerId);
      } catch (error) {
        console.error('Error deleting owner:', error);
      }
    }
  };

<<<<<<< HEAD
  const handleViewOwner = (owner: Owner) => {
    setSelectedOwner(owner);
    setShowOwnerDetails(true);
    
    // Log the view action
    if (user) {
      ActivityLogger.log(
        user.id,
        `${user.firstName} ${user.lastName}`,
        user.agencyId,
        'view',
        'owner',
        owner.id,
        `${owner.first_name} ${owner.last_name}`,
        'Consultation de la fiche propriétaire'
      );
    }
  };

  const handleGenerateContract = (owner: Owner) => {
    setSelectedOwner(owner);
    setShowContractGenerator(true);
    
    // Log contract generation
    if (user) {
      ActivityLogger.log(
        user.id,
        `${user.firstName} ${user.lastName}`,
        user.agencyId,
        'generate_contract',
        'owner',
        owner.id,
        `${owner.first_name} ${owner.last_name}`,
        'Génération d\'un contrat de gestion'
      );
    }
  };

  const handleEditOwner = (owner: Owner) => {
    setEditingOwner(owner);
    setShowForm(true);
    
    // Log the edit action
    if (user) {
      ActivityLogger.log(
        user.id,
        `${user.firstName} ${user.lastName}`,
        user.agencyId,
        'view',
        'owner',
        owner.id,
        `${owner.first_name} ${owner.last_name}`,
        'Ouverture du formulaire de modification'
      );
    }
  };

=======
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
  const getPropertyTitleLabel = (title: string) => {
    const labels = {
      attestation_villageoise: 'Attestation villageoise',
      lettre_attribution: 'Lettre d\'attribution',
      permis_habiter: 'Permis d\'habiter',
      acd: 'ACD',
      tf: 'TF',
      cpf: 'CPF',
      autres: 'Autres'
    };
    return labels[title as keyof typeof labels] || title;
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

  const getPropertyTitleColor = (title: string) => {
    switch (title) {
      case 'tf':
      case 'cpf':
        return 'success';
      case 'acd':
      case 'lettre_attribution':
        return 'info';
      case 'permis_habiter':
        return 'warning';
      case 'attestation_villageoise':
        return 'secondary';
      default:
        return 'secondary';
    }
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

  const filteredOwners = owners.filter(owner => {
    const matchesSearch = 
      owner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.phone.includes(searchTerm) ||
      owner.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPropertyTitle = filterPropertyTitle === 'all' || owner.property_title === filterPropertyTitle;
    const matchesMaritalStatus = filterMaritalStatus === 'all' || owner.marital_status === filterMaritalStatus;
    
    return matchesSearch && matchesPropertyTitle && matchesMaritalStatus;
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
          <h1 className="text-2xl font-bold text-gray-900">Propriétaires</h1>
          <p className="text-gray-600 mt-1">
            Gestion des propriétaires et de leurs biens
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter un propriétaire</span>
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
                placeholder="Rechercher par nom, téléphone ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterPropertyTitle}
              onChange={(e) => setFilterPropertyTitle(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les titres</option>
              <option value="tf">TF</option>
              <option value="cpf">CPF</option>
              <option value="acd">ACD</option>
              <option value="lettre_attribution">Lettre d'attribution</option>
              <option value="permis_habiter">Permis d'habiter</option>
              <option value="attestation_villageoise">Attestation villageoise</option>
              <option value="autres">Autres</option>
            </select>
            
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
          </div>
        </div>
      </Card>

      {/* Owners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOwners.map((owner) => (
          <Card key={owner.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {owner.first_name} {owner.last_name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-3 w-3 mr-1" />
                      <span>{owner.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
<<<<<<< HEAD
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewOwner(owner)}
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
                        onClick={() => handleEditOwner(owner)}
                        title="Modifier les informations"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleGenerateContract(owner)}
                        title="Voir/Générer contrat de gestion"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteOwner(owner.id)}
                        disabled={deleting}
                        title="Supprimer le propriétaire"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
=======
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSelectedOwner(owner);
                      setShowContractGenerator(true);
                    }}
                    title="Générer contrat de gestion"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteOwner(owner.id)}
                    disabled={deleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-green-600" />
                  <span>{owner.address}, {owner.city}</span>
                </div>

                {owner.email && (
                  <div className="text-sm text-gray-600">
                    <strong>Email:</strong> {owner.email}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Titre:</span>
                  <Badge variant={getPropertyTitleColor(owner.property_title)} size="sm">
                    {getPropertyTitleLabel(owner.property_title)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Situation:</span>
                  <Badge variant={getMaritalStatusColor(owner.marital_status)} size="sm">
                    {getMaritalStatusLabel(owner.marital_status)}
                  </Badge>
                </div>

                {owner.marital_status === 'marie' && owner.spouse_name && (
                  <div className="text-sm text-gray-600 bg-pink-50 p-2 rounded">
                    <p><strong>Conjoint:</strong> {owner.spouse_name}</p>
                    <p><strong>Tél:</strong> {owner.spouse_phone}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Enfants:</span>
                  <span className="font-medium text-gray-900">{owner.children_count}</span>
                </div>

                {owner.property_title === 'autres' && owner.property_title_details && (
                  <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                    <p><strong>Détails titre:</strong> {owner.property_title_details}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Ajouté le {new Date(owner.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOwners.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <User className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun propriétaire trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterPropertyTitle !== 'all' || filterMaritalStatus !== 'all'
              ? 'Aucun propriétaire ne correspond à vos critères de recherche.'
              : 'Commencez par ajouter votre premier propriétaire.'}
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un propriétaire
          </Button>
        </div>
      )}

      <OwnerForm
        isOpen={showForm}
<<<<<<< HEAD
        onClose={() => {
          setShowForm(false);
          setEditingOwner(null);
        }}
        onSubmit={handleAddOwner}
        initialData={editingOwner ? {
          firstName: editingOwner.first_name,
          lastName: editingOwner.last_name,
          phone: editingOwner.phone,
          email: editingOwner.email || '',
          address: editingOwner.address,
          city: editingOwner.city,
          propertyTitle: editingOwner.property_title,
          propertyTitleDetails: editingOwner.property_title_details || '',
          maritalStatus: editingOwner.marital_status,
          spouseName: editingOwner.spouse_name || '',
          spousePhone: editingOwner.spouse_phone || '',
          childrenCount: editingOwner.children_count,
          agencyId: editingOwner.agency_id,
        } : undefined}
      />

      {/* Owner Details Modal */}
      <Modal
        isOpen={showOwnerDetails}
        onClose={() => {
          setShowOwnerDetails(false);
          setSelectedOwner(null);
        }}
        title="Détails du propriétaire"
        size="lg"
      >
        {selectedOwner && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedOwner.first_name} {selectedOwner.last_name}
                </h3>
                <p className="text-gray-600">{selectedOwner.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informations personnelles</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Téléphone:</strong> {selectedOwner.phone}</p>
                  {selectedOwner.email && <p><strong>Email:</strong> {selectedOwner.email}</p>}
                  <p><strong>Adresse:</strong> {selectedOwner.address}, {selectedOwner.city}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Titre de propriété</h4>
                <div className="space-y-2">
                  <Badge variant={getPropertyTitleColor(selectedOwner.property_title)} size="md">
                    {getPropertyTitleLabel(selectedOwner.property_title)}
                  </Badge>
                  {selectedOwner.property_title_details && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Détails:</strong> {selectedOwner.property_title_details}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Situation familiale</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Badge variant={getMaritalStatusColor(selectedOwner.marital_status)} size="sm">
                    {getMaritalStatusLabel(selectedOwner.marital_status)}
                  </Badge>
                  {selectedOwner.marital_status === 'marie' && selectedOwner.spouse_name && (
                    <div className="mt-2 p-3 bg-pink-50 rounded-lg text-sm">
                      <p><strong>Conjoint:</strong> {selectedOwner.spouse_name}</p>
                      <p><strong>Téléphone:</strong> {selectedOwner.spouse_phone}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Nombre d'enfants:</strong> {selectedOwner.children_count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

=======
        onClose={() => setShowForm(false)}
        onSubmit={handleAddOwner}
      />

>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
      <ContractGenerator
        isOpen={showContractGenerator}
        onClose={() => {
          setShowContractGenerator(false);
          setSelectedOwner(null);
        }}
        type="gestion"
        ownerData={selectedOwner}
        onContractGenerated={(contract) => {
          console.log('Contrat de gestion généré:', contract);
          alert('Contrat de gestion généré avec succès !');
        }}
      />
    </div>
  );
};