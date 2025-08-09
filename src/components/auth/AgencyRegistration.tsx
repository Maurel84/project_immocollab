import React, { useState } from 'react';
import { Building2, Upload, Shield, Users, Save, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';

interface AgencyRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agency: any, director: any) => void;
}

export const AgencyRegistration: React.FC<AgencyRegistrationProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [agencyData, setAgencyData] = useState({
    name: '',
    commercialRegister: '',
    logo: '',
    isAccredited: false,
    accreditationNumber: '',
    address: '',
    city: '',
    phone: '',
    email: '',
  });

  const [directorData, setDirectorData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  const updateAgencyData = (updates: any) => {
    setAgencyData(prev => ({ ...prev, ...updates }));
  };

  const updateDirectorData = (updates: any) => {
    setDirectorData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!agencyData.name || !agencyData.commercialRegister || !agencyData.phone || !agencyData.email) {
      alert('Veuillez remplir tous les champs obligatoires de l\'agence');
      return;
    }
    
    if (!directorData.firstName || !directorData.lastName || !directorData.email || !directorData.password) {
      alert('Veuillez remplir tous les champs obligatoires du directeur');
      return;
    }
    
    if (directorData.password.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (!supabase) {
        throw new Error('Supabase non configuré');
      }

      // Create auth user for director
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: directorData.email,
        password: directorData.password,
        options: {
          data: {
            first_name: directorData.firstName,
            last_name: directorData.lastName,
            role: 'director'
          }
        }
      });

      if (authError) {
        if (authError.message === 'User already registered') {
          throw new Error('Cet email est déjà enregistré. Veuillez vous connecter ou utiliser un autre email.');
        }
        throw new Error(`Erreur lors de la création du compte: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Erreur lors de la création du compte utilisateur');
      }

      // Create agency
      const { data: agencyResult, error: agencyError } = await supabase
        .from('agencies')
        .insert({
          name: agencyData.name,
          commercial_register: agencyData.commercialRegister,
          logo: agencyData.logo || null,
          is_accredited: agencyData.isAccredited,
          accreditation_number: agencyData.accreditationNumber || null,
          address: agencyData.address,
          city: agencyData.city,
          phone: agencyData.phone,
          email: agencyData.email,
          director_id: authData.user.id,
        })
        .select()
        .single();

      if (agencyError) {
        throw new Error(`Erreur lors de la création de l'agence: ${agencyError.message}`);
      }

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: directorData.email,
          first_name: directorData.firstName,
          last_name: directorData.lastName,
          role: 'director',
          agency_id: agencyResult.id,
          permissions: {
            dashboard: true,
            properties: true,
            owners: true,
            tenants: true,
            contracts: true,
            collaboration: true,
            reports: true,
            notifications: true,
            settings: true,
            userManagement: true,
          },
          is_active: true,
        });

      if (userError) {
        throw new Error(`Erreur lors de la création du profil utilisateur: ${userError.message}`);
      }

      // Create subscription
      const { error: subscriptionError } = await supabase
        .from('agency_subscriptions')
        .insert({
          agency_id: agencyResult.id,
          plan_type: 'trial',
          status: 'trial',
          monthly_fee: 50000,
          start_date: new Date().toISOString().split('T')[0],
          next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          trial_days_remaining: 30,
        });

      if (subscriptionError) {
        console.warn('Erreur lors de la création de l\'abonnement:', subscriptionError);
      }

      alert('Agence créée avec succès ! Vous pouvez maintenant vous connecter avec vos identifiants.');
      
      // Connexion automatique après création
      try {
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: directorData.email,
          password: directorData.password,
        });

        if (loginError) {
          console.warn('Connexion automatique échouée:', loginError);
          alert('Agence créée avec succès ! Veuillez vous connecter avec vos identifiants.');
          onClose();
          return;
        }

        // Rediriger vers le dashboard
        window.location.href = '/dashboard';
      } catch (loginError) {
        console.error('Erreur connexion automatique:', loginError);
        alert('Agence créée avec succès ! Veuillez vous connecter avec vos identifiants.');
        onClose();
      }
      
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      alert(error.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Informations de l\'agence', icon: Building2 },
    { id: 2, title: 'Compte directeur', icon: Users },
    { id: 3, title: 'Vérification', icon: Shield },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Créer votre agence">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step.id ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Agency Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Création d'agence</h3>
              <p className="text-sm text-green-800">
                Créez votre agence immobilière sur la plateforme ImmoPlatform. 
                Votre compte sera activé immédiatement avec 30 jours d'essai gratuit.
              </p>
            </div>

            <Card>
              <div className="flex items-center mb-4">
                <Building2 className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Informations de l'agence</h3>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Nom de l'agence *"
                  value={agencyData.name}
                  onChange={(e) => updateAgencyData({ name: e.target.value })}
                  required
                  placeholder="Ex: Immobilier Excellence"
                />

                <Input
                  label="Registre de commerce *"
                  value={agencyData.commercialRegister}
                  onChange={(e) => updateAgencyData({ commercialRegister: e.target.value })}
                  required
                  placeholder="Ex: CI-ABJ-2024-B-12345"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Phone className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                    <Input
                      label="Téléphone *"
                      type="tel"
                      value={agencyData.phone}
                      onChange={(e) => updateAgencyData({ phone: e.target.value })}
                      required
                      placeholder="+225 XX XX XX XX XX"
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                    <Input
                      label="Email *"
                      type="email"
                      value={agencyData.email}
                      onChange={(e) => updateAgencyData({ email: e.target.value })}
                      required
                      placeholder="contact@agence.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                    <Input
                      label="Adresse *"
                      value={agencyData.address}
                      onChange={(e) => updateAgencyData({ address: e.target.value })}
                      required
                      placeholder="Adresse complète"
                      className="pl-10"
                    />
                  </div>
                  <Input
                    label="Ville *"
                    value={agencyData.city}
                    onChange={(e) => updateAgencyData({ city: e.target.value })}
                    required
                    placeholder="Abidjan"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Agrément (optionnel)</h3>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={agencyData.isAccredited}
                    onChange={(e) => updateAgencyData({ isAccredited: e.target.checked })}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    L'agence possède un agrément officiel
                  </span>
                </label>

                {agencyData.isAccredited && (
                  <Input
                    label="Numéro d'agrément"
                    value={agencyData.accreditationNumber || ''}
                    onChange={(e) => updateAgencyData({ accreditationNumber: e.target.value })}
                    required={agencyData.isAccredited}
                    placeholder="Ex: AGR-2024-001"
                  />
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: Director Account */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Compte du directeur</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Prénom *"
                    value={directorData.firstName}
                    onChange={(e) => updateDirectorData({ firstName: e.target.value })}
                    required
                    placeholder="Prénom du directeur"
                  />
                  <Input
                    label="Nom *"
                    value={directorData.lastName}
                    onChange={(e) => updateDirectorData({ lastName: e.target.value })}
                    required
                    placeholder="Nom du directeur"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input
                    label="Email *"
                    type="email"
                    value={directorData.email}
                    onChange={(e) => updateDirectorData({ email: e.target.value })}
                    required
                    placeholder="directeur@agence.com"
                    className="pl-10"
                  />
                </div>

                <Input
                  label="Mot de passe *"
                  type="password"
                  value={directorData.password}
                  onChange={(e) => updateDirectorData({ password: e.target.value })}
                  required
                  placeholder="••••••••"
                  helperText="Minimum 8 caractères avec majuscules, minuscules et chiffres"
                />
              </div>
            </Card>

            <Card className="bg-green-50">
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Permissions du directeur</h3>
              </div>
              
              <div className="text-sm text-green-800">
                <p className="mb-2">
                  <strong>En tant que directeur, vous aurez accès à :</strong>
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• Tous les modules de la plateforme</li>
                  <li>• Gestion des utilisateurs et permissions</li>
                  <li>• Rapports et statistiques complètes</li>
                  <li>• Configuration de l'agence</li>
                  <li>• Collaboration inter-agences</li>
                  <li>• Génération de contrats automatique</li>
                </ul>
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: Verification */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Récapitulatif</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Agence</p>
                    <p className="text-gray-600">{agencyData.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Registre de commerce</p>
                    <p className="text-gray-600">{agencyData.commercialRegister}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Directeur</p>
                    <p className="text-gray-600">{directorData.firstName} {directorData.lastName}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{directorData.email}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Téléphone</p>
                    <p className="text-gray-600">{agencyData.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Ville</p>
                    <p className="text-gray-600">{agencyData.city}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">
                        Activation immédiate
                      </h4>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>1. Votre agence sera créée immédiatement</li>
                        <li>2. 30 jours d'essai gratuit inclus</li>
                        <li>3. Accès complet à toutes les fonctionnalités</li>
                        <li>4. Support technique inclus</li>
                      </ul>
                    </div>
                  </div>
                </div>
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
                disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                Suivant
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                isLoading={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                Créer l'agence
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};