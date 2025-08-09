import React, { useState } from 'react';
import { Home, Plus, Search, Wifi, Car, Utensils, Tv, AirVent, Waves, Shield, MapPin, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

interface FurnishedResidence {
  id: string;
  name: string;
  address: string;
  city: string;
  type: 'studio' | 'apartment' | 'villa' | 'duplex';
  rooms: number;
  capacity: number;
  dailyRate: number;
  monthlyRate: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  description: string;
  agencyId: string;
  createdAt: Date;
}

export const FurnishedResidences: React.FC = () => {
  const [residences, setResidences] = useState<FurnishedResidence[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    kitchen: Utensils,
    tv: Tv,
    ac: AirVent,
    pool: Waves,
    security: Shield,
  };

  const amenityLabels = {
    wifi: 'WiFi',
    parking: 'Parking',
    kitchen: 'Cuisine équipée',
    tv: 'Télévision',
    ac: 'Climatisation',
    pool: 'Piscine',
    security: 'Sécurité 24h/24',
  };

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    type: 'apartment' as const,
    rooms: 1,
    capacity: 2,
    dailyRate: 0,
    monthlyRate: 0,
    amenities: [] as string[],
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newResidence: FurnishedResidence = {
      id: `residence_${Date.now()}`,
      ...formData,
      images: [],
      isAvailable: true,
      agencyId: 'agency1',
      createdAt: new Date(),
    };

    setResidences([...residences, newResidence]);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      type: 'apartment',
      rooms: 1,
      capacity: 2,
      dailyRate: 0,
      monthlyRate: 0,
      amenities: [],
      description: '',
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      studio: 'Studio',
      apartment: 'Appartement',
      villa: 'Villa',
      duplex: 'Duplex'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const filteredResidences = residences.filter(residence => {
    const matchesSearch = residence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         residence.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         residence.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || residence.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Résidences Meublées</h1>
          <p className="text-gray-600 mt-1">
            Gestion des locations courte et longue durée
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter une résidence</span>
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
                placeholder="Rechercher par nom, adresse ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="studio">Studio</option>
            <option value="apartment">Appartement</option>
            <option value="villa">Villa</option>
            <option value="duplex">Duplex</option>
          </select>
        </div>
      </Card>

      {/* Residences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResidences.map((residence) => (
          <Card key={residence.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-16 aspect-h-12 bg-gray-200 relative">
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Home className="h-16 w-16 text-blue-400" />
              </div>
              
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant="info" size="sm">
                  {getTypeLabel(residence.type)}
                </Badge>
                <Badge variant={residence.isAvailable ? 'success' : 'secondary'} size="sm">
                  {residence.isAvailable ? 'Disponible' : 'Occupé'}
                </Badge>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{residence.name}</h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{residence.address}, {residence.city}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{residence.rooms} pièce(s)</span>
                <span>Capacité: {residence.capacity} pers.</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">Tarif journalier</p>
                  <p className="font-semibold text-blue-600">{formatCurrency(residence.dailyRate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Tarif mensuel</p>
                  <p className="font-semibold text-green-600">{formatCurrency(residence.monthlyRate)}</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-2">Équipements:</p>
                <div className="flex flex-wrap gap-1">
                  {residence.amenities.slice(0, 4).map((amenity) => {
                    const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                    return (
                      <div key={amenity} className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                        {Icon && <Icon className="h-3 w-3 text-gray-600" />}
                        <span className="text-xs text-gray-600">
                          {amenityLabels[amenity as keyof typeof amenityLabels]}
                        </span>
                      </div>
                    );
                  })}
                  {residence.amenities.length > 4 && (
                    <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                      +{residence.amenities.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {residence.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Ajouté le {residence.createdAt.toLocaleDateString('fr-FR')}
                </span>
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredResidences.length === 0 && (
        <div className="text-center py-12">
          <Home className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune résidence meublée
          </h3>
          <p className="text-gray-600 mb-4">
            Commencez par ajouter votre première résidence meublée.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une résidence
          </Button>
        </div>
      )}

      {/* Add Residence Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} size="lg" title="Nouvelle résidence meublée">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom de la résidence"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Ex: Appartement Cocody Centre"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de bien
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="studio">Studio</option>
                <option value="apartment">Appartement</option>
                <option value="villa">Villa</option>
                <option value="duplex">Duplex</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Adresse"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
              placeholder="Adresse complète"
            />
            <Input
              label="Ville"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              required
              placeholder="Abidjan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Nombre de pièces"
              type="number"
              value={formData.rooms}
              onChange={(e) => setFormData(prev => ({ ...prev, rooms: parseInt(e.target.value) || 1 }))}
              min="1"
              required
            />
            <Input
              label="Capacité (personnes)"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
              min="1"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tarif journalier (FCFA)"
              type="number"
              value={formData.dailyRate}
              onChange={(e) => setFormData(prev => ({ ...prev, dailyRate: parseInt(e.target.value) || 0 }))}
              min="0"
              required
            />
            <Input
              label="Tarif mensuel (FCFA)"
              type="number"
              value={formData.monthlyRate}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyRate: parseInt(e.target.value) || 0 }))}
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Équipements et services
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(amenityLabels).map(([key, label]) => {
                const Icon = amenityIcons[key as keyof typeof amenityIcons];
                return (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(key)}
                      onChange={() => toggleAmenity(key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez la résidence, ses avantages et particularités..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter la résidence
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};