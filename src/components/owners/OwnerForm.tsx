import React, { useState } from 'react';
import { Save, User, FileText, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { OwnerFormData } from '../../types/owner';

interface OwnerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (owner: OwnerFormData) => void;
  initialData?: Partial<OwnerFormData>;
}

export const OwnerForm: React.FC<OwnerFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OwnerFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    propertyTitle: 'attestation_villageoise',
    propertyTitleDetails: '',
    maritalStatus: 'celibataire',
    spouseName: '',
    spousePhone: '',
    childrenCount: 0,
    agencyId: '1',
    ...initialData,
  });

  const updateFormData = (updates: Partial<OwnerFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName.trim() && formData.lastName.trim() && 
                 formData.phone.trim() && formData.address.trim() && formData.city.trim());
      case 2:
        return !!(formData.propertyTitle && 
                 (formData.propertyTitle !== 'autres' || formData.propertyTitleDetails?.trim()));
      case 3:
        return !!(formData.maritalStatus && 
                 (formData.maritalStatus !== 'marie' || 
                  (formData.spouseName?.trim() && formData.spousePhone?.trim())));
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

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: User },
    { id: 2, title: 'Titre de propriété', icon: FileText },
    { id: 3, title: 'Situation familiale', icon: Heart },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Ajouter un propriétaire">
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
                  placeholder="Prénom du propriétaire"
                />
                <Input
                  label="Nom *"
                  value={formData.lastName}
                  onChange={(e) => updateFormData({ lastName: e.target.value })}
                  required
                  placeholder="Nom du propriétaire"
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

              <Input
                label="Ville *"
                value={formData.city}
                onChange={(e) => updateFormData({ city: e.target.value })}
                required
                placeholder="Ville"
              />
            </div>
          </Card>
        )}

        {/* Step 2: Property Title */}
        {currentStep === 2 && (
          <Card>
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Titre de propriété</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de titre de propriété *
                </label>
                <select
                  value={formData.propertyTitle}
                  onChange={(e) => updateFormData({ propertyTitle: e.target.value as OwnerFormData['propertyTitle'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="attestation_villageoise">Attestation villageoise</option>
                  <option value="lettre_attribution">Lettre d'attribution</option>
                  <option value="permis_habiter">Permis d'habiter</option>
                  <option value="acd">ACD (Arrêté de Concession Définitive)</option>
                  <option value="tf">TF (Titre Foncier)</option>
                  <option value="cpf">CPF (Certificat de Propriété Foncière)</option>
                  <option value="autres">Autres</option>
                </select>
              </div>

              {formData.propertyTitle === 'autres' && (
                <Input
                  label="Précisez le type de titre *"
                  value={formData.propertyTitleDetails}
                  onChange={(e) => updateFormData({ propertyTitleDetails: e.target.value })}
                  required
                  placeholder="Décrivez le type de titre de propriété"
                />
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Information sur les titres</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>TF/CPF :</strong> Titres les plus sécurisés</li>
                  <li>• <strong>ACD :</strong> Titre officiel de l'État</li>
                  <li>• <strong>Lettre d'attribution :</strong> Document administratif</li>
                  <li>• <strong>Attestation villageoise :</strong> Reconnaissance coutumière</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Family Situation */}
        {currentStep === 3 && (
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
                  onChange={(e) => updateFormData({ maritalStatus: e.target.value as OwnerFormData['maritalStatus'] })}
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
                Enregistrer le propriétaire
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};