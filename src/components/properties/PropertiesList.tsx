import React, { useState } from 'react';
import { Plus, Search, Filter, MapPin, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
<<<<<<< HEAD
import { Modal } from '../ui/Modal';
=======
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
import { PropertyForm } from './PropertyForm';
import { Property, PropertyFormData } from '../../types/property';
import { useSupabaseData, useSupabaseCreate, useSupabaseDelete } from '../../hooks/useSupabaseData';
import { dbService } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const PropertiesList: React.FC = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
<<<<<<< HEAD
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
=======
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStanding, setFilterStanding] = useState('all');

  // Supabase data hooks
  const { data: properties, loading, error, refetch, setData } = useSupabaseData<Property>(
    dbService.getProperties
  );

  const { create: createProperty, loading: creating } = useSupabaseCreate(
    dbService.createProperty,
    (newProperty) => {
      setData(prev => [newProperty, ...prev]);
      setShowForm(false);
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('storage'));
    }
  );

  const { deleteItem: deleteProperty, loading: deleting } = useSupabaseDelete(
    dbService.deleteProperty,
    () => refetch()
  );

  const handleAddProperty = async (propertyData: PropertyFormData) => {
    if (!user?.agencyId) return;
    
    try {
      // Validation des données avant envoi
      if (!propertyData.title || !propertyData.ownerId || !propertyData.location.commune) {
        throw new Error('Données obligatoires manquantes');
      }
      
      await createProperty({
        agency_id: user.agencyId,
        owner_id: propertyData.ownerId,
        title: propertyData.title,
        description: propertyData.description || '',
        location: propertyData.location,
        details: propertyData.details,
        standing: propertyData.standing,
        rooms: propertyData.rooms || [],
        images: propertyData.images || [],
        is_available: propertyData.isAvailable,
        for_sale: propertyData.forSale,
        for_rent: propertyData.forRent,
      });
      
      // Fermer le formulaire après succès
      setShowForm(false);
      
      alert('Propriété créée avec succès !');
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Erreur lors de la création de la propriété. Veuillez réessayer.');
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      try {
        await deleteProperty(propertyId);
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const getStandingColor = (standing: string) => {
    switch (standing) {
      case 'economique': return 'warning';
      case 'moyen': return 'info';
      case 'haut': return 'success';
      default: return 'secondary';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      villa: 'Villa',
      appartement: 'Appartement',
      terrain_nu: 'Terrain nu',
      immeuble: 'Immeuble',
      autres: 'Autres'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.commune?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.quartier?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || property.details?.type === filterType;
    const matchesStanding = filterStanding === 'all' || property.standing === filterStanding;
    
    return matchesSearch && matchesType && matchesStanding;
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
          <h1 className="text-2xl font-bold text-gray-900">Propriétés</h1>
          <p className="text-gray-600 mt-1">
            Gestion de votre portefeuille immobilier
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter une propriété</span>
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
                placeholder="Rechercher par titre, commune ou quartier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="villa">Villa</option>
              <option value="appartement">Appartement</option>
              <option value="terrain_nu">Terrain nu</option>
              <option value="immeuble">Immeuble</option>
              <option value="autres">Autres</option>
            </select>
            
            <select
              value={filterStanding}
              onChange={(e) => setFilterStanding(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les standings</option>
              <option value="economique">Économique</option>
              <option value="moyen">Moyen</option>
              <option value="haut">Haut</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-16 aspect-h-12 bg-gray-200 relative">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images.find(img => img.isPrimary)?.url || property.images[0].url}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Aucune image</span>
                </div>
              )}
              
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant={getStandingColor(property.standing)} size="sm">
                  {property.standing.charAt(0).toUpperCase() + property.standing.slice(1)}
                </Badge>
                {property.details?.type && (
                  <Badge variant="secondary" size="sm">
                    {getTypeLabel(property.details.type)}
                  </Badge>
                )}
              </div>
              
              <div className="absolute top-2 right-2 flex gap-1">
                {property.for_rent && (
                  <Badge variant="info" size="sm">Location</Badge>
                )}
                {property.for_sale && (
                  <Badge variant="success" size="sm">Vente</Badge>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {property.location?.commune || 'Non spécifié'}, {property.location?.quartier || 'Non spécifié'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {property.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${
                    property.is_available ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm text-gray-600">
                    {property.is_available ? 'Disponible' : 'Occupé'}
                  </span>
                </div>
                
                <div className="flex space-x-1">
<<<<<<< HEAD
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedProperty(property);
                      setShowPropertyDetails(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setEditingProperty(property);
                      setShowForm(true);
                    }}
                  >
=======
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteProperty(property.id)}
                    disabled={deleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune propriété trouvée
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterType !== 'all' || filterStanding !== 'all'
              ? 'Aucune propriété ne correspond à vos critères de recherche.'
              : 'Commencez par ajouter votre première propriété.'}
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une propriété
          </Button>
        </div>
      )}

      <PropertyForm
        isOpen={showForm}
<<<<<<< HEAD
        onClose={() => {
          setShowForm(false);
          setEditingProperty(null);
        }}
        onSubmit={handleAddProperty}
        initialData={editingProperty ? {
          ownerId: editingProperty.owner_id,
          agencyId: editingProperty.agency_id,
          title: editingProperty.title,
          description: editingProperty.description || '',
          location: editingProperty.location,
          details: editingProperty.details,
          standing: editingProperty.standing,
          rooms: editingProperty.rooms || [],
          images: editingProperty.images || [],
          isAvailable: editingProperty.is_available,
          forSale: editingProperty.for_sale,
          forRent: editingProperty.for_rent,
        } : undefined}
      />

      {/* Property Details Modal */}
      <Modal
        isOpen={showPropertyDetails}
        onClose={() => {
          setShowPropertyDetails(false);
          setSelectedProperty(null);
        }}
        title="Détails de la propriété"
        size="xl"
      >
        {selectedProperty && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedProperty.title}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Localisation</p>
                    <p className="font-medium">{selectedProperty.location?.commune}, {selectedProperty.location?.quartier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <Badge variant="info" size="sm">{getTypeLabel(selectedProperty.details?.type || '')}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Standing</p>
                    <Badge variant={getStandingColor(selectedProperty.standing)} size="sm">
                      {selectedProperty.standing.charAt(0).toUpperCase() + selectedProperty.standing.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Propriétaire</p>
                    <p className="font-medium">{selectedProperty.owners?.first_name} {selectedProperty.owners?.last_name}</p>
                  </div>
                </div>
              </div>
              
              <div>
                {selectedProperty.images && selectedProperty.images.length > 0 ? (
                  <img
                    src={selectedProperty.images[0].url}
                    alt={selectedProperty.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Aucune image</span>
                  </div>
                )}
              </div>
            </div>

            {selectedProperty.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedProperty.description}</p>
              </div>
            )}

            {selectedProperty.rooms && selectedProperty.rooms.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Pièces ({selectedProperty.rooms.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProperty.rooms.map((room, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{room.nom || room.type.replace('_', ' ')}</p>
                      {room.superficie && <p className="text-sm text-gray-600">{room.superficie} m²</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
=======
        onClose={() => setShowForm(false)}
        onSubmit={handleAddProperty}
      />
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
    </div>
  );
};