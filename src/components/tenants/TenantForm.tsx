import React, { useState } from 'react';
<<<<<<< HEAD
import { Save, User, Heart, Upload } from 'lucide-react';
=======
import { Save, User, MapPin, Phone, FileText, Heart, Camera, Upload } from 'lucide-react';
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { TenantFormData } from '../../types/tenant';
<<<<<<< HEAD
=======
import { ContractGenerator } from '../contracts/ContractGenerator';
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766

interface TenantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tenant: TenantFormData) => void;
  initialData?: Partial<TenantFormData>;
<<<<<<< HEAD
=======
  onContractGenerated?: (contract: any) => void;
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
}

export const TenantForm: React.FC<TenantFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
<<<<<<< HEAD
}) => {
  const [currentStep, setCurrentStep] = useState(1);
=======
  onContractGenerated,
}) => {
  const [showContractGenerator, setShowContractGenerator] = useState(false);
  const [createdTenant, setCreatedTenant] = useState<TenantFormData | null>(null);
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
  const [formData, setFormData] = useState<TenantFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    maritalStatus: 'celibataire',
    spouseName: '',
    spousePhone: '',
    childrenCount: 0,
    profession: '',
    nationality: 'Ivoirienne',
    photoUrl: '',
    idCardUrl: '',
    paymentStatus: 'bon',
<<<<<<< HEAD
    agencyId: '1',
    ...initialData,
  });

=======
    agencyId: '',
    ...initialData,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);

  const maritalStatusOptions = [
    { value: 'celibataire', label: 'Célibataire' },
    { value: 'marie', label: 'Marié(e)' },
    { value: 'divorce', label: 'Divorcé(e)' },
    { value: 'veuf', label: 'Veuf/Veuve' },
  ];

  const nationalityOptions = [
    'Ivoirienne', 'Française', 'Malienne', 'Burkinabé', 'Ghanéenne', 
    'Nigériane', 'Sénégalaise', 'Guinéenne', 'Libérienne', 'Autre'
  ];

  const paymentStatusOptions = [
    { value: 'bon', label: 'Bon payeur', color: 'text-green-600' },
    { value: 'irregulier', label: 'Payeur irrégulier', color: 'text-yellow-600' },
    { value: 'mauvais', label: 'Mauvais payeur', color: 'text-red-600' },
  ];

>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
  const updateFormData = (updates: Partial<TenantFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

<<<<<<< HEAD
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName.trim() && formData.lastName.trim() && 
                 formData.phone.trim() && formData.address.trim() && 
                 formData.city.trim() && formData.profession.trim() && 
                 formData.nationality.trim());
      case 2:
        return !!(formData.maritalStatus && 
                 (formData.maritalStatus !== 'marie' || 
                  (formData.spouseName?.trim() && formData.spousePhone?.trim())));
      case 3:
        return true; // Documents are optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Veuillez remplir tous les champs obligatoires avant de continuer.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ne soumettre que si on est à la dernière étape ET que toutes les validations passent
    if (currentStep === 3 && validateStep(1) && validateStep(2) && validateStep(3)) {
      onSubmit(formData);
      onClose();
      setCurrentStep(1);
    } else {
      alert('Veuillez compléter toutes les étapes avant d\'enregistrer.');
    }
  };

  const handleFileUpload = (type: 'photo' | 'idCard', file: File) => {
    const url = URL.createObjectURL(file);
    if (type === 'photo') {
      updateFormData({ photoUrl: url });
    } else {
=======
  const handleFileUpload = (file: File, type: 'photo' | 'idCard') => {
    const url = URL.createObjectURL(file);
    if (type === 'photo') {
      setPhotoFile(file);
      updateFormData({ photoUrl: url });
    } else {
      setIdCardFile(file);
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
      updateFormData({ idCardUrl: url });
    }
  };

<<<<<<< HEAD
  const steps = [
    { id: 1, title: 'Informations personnelles', icon: User },
    { id: 2, title: 'Situation familiale', icon: Heart },
    { id: 3, title: 'Documents d\'identité', icon: Upload },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Ajouter un locataire">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Card>
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Prénom *"
                  value={formData.firstName}
                  onChange={(e) => updateFormData({ firstName: e.target.value })}
                  required
                  placeholder="Prénom du locataire"
                />
                <Input
                  label="Nom *"
                  value={formData.lastName}
                  onChange={(e) => updateFormData({ lastName: e.target.value })}
                  required
                  placeholder="Nom du locataire"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Téléphone *"
                  value={formData.phone}
                  onChange={(e) => updateFormData({ phone: e.target.value })}
                  required
                  placeholder="+225 XX XX XX XX XX"
                />
                <Input
                  label="Email (optionnel)"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="email@exemple.com"
                />
              </div>

              <Input
                label="Adresse *"
                value={formData.address}
                onChange={(e) => updateFormData({ address: e.target.value })}
                required
                placeholder="Adresse complète"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ville *"
                  value={formData.city}
                  onChange={(e) => updateFormData({ city: e.target.value })}
                  required
                  placeholder="Ville"
                />
                <Input
                  label="Profession *"
                  value={formData.profession}
                  onChange={(e) => updateFormData({ profession: e.target.value })}
                  required
                  placeholder="Profession du locataire"
                />
              </div>

              <Input
                label="Nationalité *"
                value={formData.nationality}
                onChange={(e) => updateFormData({ nationality: e.target.value })}
                required
                placeholder="Nationalité"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut de paiement
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => updateFormData({ paymentStatus: e.target.value as TenantFormData['paymentStatus'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="bon">Bon payeur</option>
                  <option value="irregulier">Payeur irrégulier</option>
                  <option value="mauvais">Mauvais payeur</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Family Situation */}
        {currentStep === 2 && (
          <Card>
            <div className="flex items-center mb-4">
              <Heart className="h-5 w-5 text-pink-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Situation familiale</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Situation matrimoniale *
                </label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => updateFormData({ maritalStatus: e.target.value as TenantFormData['maritalStatus'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="celibataire">Célibataire</option>
                  <option value="marie">Marié(e)</option>
                  <option value="divorce">Divorcé(e)</option>
                  <option value="veuf">Veuf/Veuve</option>
                </select>
              </div>

              {formData.maritalStatus === 'marie' && (
                <div className="space-y-4 p-4 bg-pink-50 rounded-lg">
                  <h4 className="font-medium text-pink-900">Informations du conjoint</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nom du conjoint *"
                      value={formData.spouseName}
                      onChange={(e) => updateFormData({ spouseName: e.target.value })}
                      required
                      placeholder="Nom complet du conjoint"
                    />
                    <Input
                      label="Téléphone du conjoint *"
                      value={formData.spousePhone}
                      onChange={(e) => updateFormData({ spousePhone: e.target.value })}
                      required
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>
                </div>
              )}

              <Input
                label="Nombre d'enfants"
                type="number"
                value={formData.childrenCount}
                onChange={(e) => updateFormData({ childrenCount: parseInt(e.target.value) || 0 })}
                min="0"
                placeholder="0"
              />
            </div>
          </Card>
        )}

        {/* Step 3: Identity Documents */}
        {currentStep === 3 && (
          <Card>
            <div className="flex items-center mb-4">
              <Upload className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Documents d'identité</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo du locataire (optionnel)
                </label>
                <div className="flex items-center space-x-4">
                  {formData.photoUrl && (
                    <img
                      src={formData.photoUrl}
                      alt="Photo du locataire"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('photo', file);
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG ou GIF. Max 2MB.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pièce d'identité (optionnel)
                </label>
                <div className="flex items-center space-x-4">
                  {formData.idCardUrl && (
                    <img
                      src={formData.idCardUrl}
                      alt="Pièce d'identité"
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('idCard', file);
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">CNI, Passeport ou autre document officiel</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Documents recommandés</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Photo récente du locataire</li>
                  <li>• Copie de la pièce d'identité (CNI, Passeport)</li>
                  <li>• Ces documents facilitent l'identification et la gestion</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Précédent
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Annuler
            </Button>
            
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
              >
                Suivant
              </Button>
            ) : (
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer le locataire
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
=======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que nous sommes à la dernière étape
    if (currentStep < 3) {
      alert('Veuillez compléter toutes les étapes avant de soumettre');
      return;
    }
    
    // Validation des données requises
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim() || !formData.profession.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Validation du téléphone
    const phoneRegex = /^(\+225)?[0-9\s-]{8,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('Format de téléphone invalide');
      return;
    }
    
    // Validation email si fourni
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Format d\'email invalide');
      return;
    }
    
    // Validation des données du conjoint si marié
    if (formData.maritalStatus === 'marie') {
      if (!formData.spouseName?.trim() || !formData.spousePhone?.trim()) {
        alert('Veuillez remplir les informations du conjoint');
        return;
      }
    }
    
    try {
      setCreatedTenant(formData);
      await onSubmit(formData);
      
      // Proposer la génération d'un contrat de bail
      if (confirm('Locataire créé avec succès ! Voulez-vous générer un contrat de bail ?')) {
        setShowContractGenerator(true);
      } else {
        onClose();
      }
    } catch (error) {
      alert('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    }
  };

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: User },
    { id: 2, title: 'Situation familiale', icon: Heart },
    { id: 3, title: 'Documents d\'identité', icon: FileText },
  ];

  const isMarried = formData.maritalStatus === 'marie';

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Ajouter un locataire">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Prénom"
                    value={formData.firstName}
                    onChange={(e) => updateFormData({ firstName: e.target.value })}
                    required
                    placeholder="Prénom du locataire"
                  />
                  <Input
                    label="Nom de famille"
                    value={formData.lastName}
                    onChange={(e) => updateFormData({ lastName: e.target.value })}
                    required
                    placeholder="Nom de famille"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Téléphone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData({ phone: e.target.value })}
                    required
                    placeholder="+225 XX XX XX XX XX"
                  />
                  <Input
                    label="Email (optionnel)"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                    placeholder="email@exemple.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Profession"
                    value={formData.profession}
                    onChange={(e) => updateFormData({ profession: e.target.value })}
                    required
                    placeholder="Profession du locataire"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationalité
                    </label>
                    <select
                      value={formData.nationality}
                      onChange={(e) => updateFormData({ nationality: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {nationalityOptions.map(nationality => (
                        <option key={nationality} value={nationality}>
                          {nationality}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Localisation</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Adresse"
                    value={formData.address}
                    onChange={(e) => updateFormData({ address: e.target.value })}
                    required
                    placeholder="Adresse complète"
                  />
                  <Input
                    label="Ville"
                    value={formData.city}
                    onChange={(e) => updateFormData({ city: e.target.value })}
                    required
                    placeholder="Ville de résidence"
                  />
                </div>
              </Card>

              <Card>
                <div className="flex items-center mb-4">
                  <Phone className="h-5 w-5 text-orange-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Statut de paiement</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Historique de paiement
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => updateFormData({ paymentStatus: e.target.value as TenantFormData['paymentStatus'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {paymentStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-gray-500">
                    <p><strong>Bon payeur :</strong> Paiements réguliers et à temps</p>
                    <p><strong>Payeur irrégulier :</strong> Retards occasionnels mais à jour</p>
                    <p><strong>Mauvais payeur :</strong> Plus de 2 mois d'impayés</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Step 2: Family Situation */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center mb-4">
                  <Heart className="h-5 w-5 text-pink-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Situation familiale</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Situation matrimoniale
                    </label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => updateFormData({ maritalStatus: e.target.value as TenantFormData['maritalStatus'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {maritalStatusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isMarried && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-pink-50 rounded-lg">
                      <Input
                        label="Nom du conjoint"
                        value={formData.spouseName || ''}
                        onChange={(e) => updateFormData({ spouseName: e.target.value })}
                        required={isMarried}
                        placeholder="Nom complet du conjoint"
                      />
                      <Input
                        label="Téléphone du conjoint"
                        type="tel"
                        value={formData.spousePhone || ''}
                        onChange={(e) => updateFormData({ spousePhone: e.target.value })}
                        required={isMarried}
                        placeholder="+225 XX XX XX XX XX"
                      />
                    </div>
                  )}

                  <Input
                    label="Nombre d'enfants"
                    type="number"
                    value={formData.childrenCount}
                    onChange={(e) => updateFormData({ childrenCount: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="20"
                    placeholder="0"
                  />
                </div>
              </Card>
            </div>
          )}

          {/* Step 3: Identity Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center mb-4">
                  <FileText className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Documents d'identité</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo du locataire
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      {formData.photoUrl ? (
                        <div className="space-y-2">
                          <img
                            src={formData.photoUrl}
                            alt="Photo du locataire"
                            className="w-32 h-32 object-cover rounded-full mx-auto"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('photo-upload')?.click()}
                          >
                            Changer la photo
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Camera className="h-12 w-12 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500">Cliquez pour ajouter une photo</p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('photo-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      )}
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'photo');
                        }}
                      />
                    </div>
                  </div>

                  {/* ID Card Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pièce d'identité
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      {formData.idCardUrl ? (
                        <div className="space-y-2">
                          <img
                            src={formData.idCardUrl}
                            alt="Pièce d'identité"
                            className="w-full h-32 object-cover rounded mx-auto"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('id-upload')?.click()}
                          >
                            Changer le document
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <FileText className="h-12 w-12 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500">CNI, Passeport, Permis de conduire</p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('id-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      )}
                      <input
                        id="id-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'idCard');
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Summary */}
              <Card className="bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3">Récapitulatif</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Nom complet :</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Téléphone :</strong> {formData.phone}</p>
                  <p><strong>Profession :</strong> {formData.profession}</p>
                  <p><strong>Nationalité :</strong> {formData.nationality}</p>
                  <p><strong>Adresse :</strong> {formData.address}, {formData.city}</p>
                  <p><strong>Situation matrimoniale :</strong> {maritalStatusOptions.find(opt => opt.value === formData.maritalStatus)?.label}</p>
                  {isMarried && formData.spouseName && (
                    <p><strong>Conjoint :</strong> {formData.spouseName} ({formData.spousePhone})</p>
                  )}
                  <p><strong>Nombre d'enfants :</strong> {formData.childrenCount}</p>
                  <p><strong>Statut de paiement :</strong> {paymentStatusOptions.find(opt => opt.value === formData.paymentStatus)?.label}</p>
                  <p><strong>Documents :</strong> {formData.photoUrl ? '✓' : '✗'} Photo, {formData.idCardUrl ? '✓' : '✗'} Pièce d'identité</p>
                </div>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Précédent
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                Annuler
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Suivant
                </Button>
              ) : (
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              )}
            </div>
          </div>
        </form>
      </Modal>

      {/* Contract Generator Modal */}
      <ContractGenerator
        isOpen={showContractGenerator}
        onClose={() => {
          setShowContractGenerator(false);
          setCreatedTenant(null);
          onClose();
        }}
        type="bail"
        tenantData={createdTenant}
        onContractGenerated={(contract) => {
          alert('Contrat de bail généré avec succès !');
        }}
      />
    </>
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766
  );
};