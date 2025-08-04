import React, { useState } from 'react';
import { FileText, Download, Edit, Save, Calendar, DollarSign, User, Building2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { ContractTemplates } from './ContractTemplates';

interface ContractGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'gestion' | 'bail';
  ownerData?: any;
  tenantData?: any;
  propertyData?: any;
  onContractGenerated?: (contract: string) => void;
}

export const ContractGenerator: React.FC<ContractGeneratorProps> = ({
  isOpen,
  onClose,
  type,
  ownerData,
  tenantData,
  propertyData,
  onContractGenerated
}) => {
  const [contractData, setContractData] = useState({
    // Données agence
    agencyName: 'IMMOBILIER EXCELLENCE',
    agencyAddress: 'Abidjan, Cocody Riviera',
    agencyPhone: '+225 01 02 03 04 05',
    agencyEmail: 'contact@immobilier-excellence.ci',
    
    // Données propriétaire
    ownerName: ownerData ? `${ownerData.firstName} ${ownerData.lastName}` : '',
    ownerAddress: ownerData ? `${ownerData.address}, ${ownerData.city}` : '',
    ownerPhone: ownerData?.phone || '',
    
    // Données locataire
    tenantName: tenantData ? `${tenantData.firstName} ${tenantData.lastName}` : '',
    tenantAddress: tenantData ? `${tenantData.address}, ${tenantData.city}` : '',
    tenantPhone: tenantData?.phone || '',
    tenantProfession: tenantData?.profession || '',
    
    // Données propriété
    propertyAddress: propertyData?.location ? `${propertyData.location.quartier}, ${propertyData.location.commune}` : 'Adresse de la propriété',
    propertyDescription: propertyData?.title || 'Description de la propriété',
    
    // Données financières
    monthlyRent: 450000,
    deposit: 900000,
    charges: 25000,
    commissionRate: 10,
    
    // Dates
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
    duration: 12
  });

  const [generatedContract, setGeneratedContract] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  const generateContract = () => {
    let contract = '';
    
    if (type === 'gestion') {
      contract = ContractTemplates.generateManagementContract({
        agencyName: contractData.agencyName,
        agencyAddress: contractData.agencyAddress,
        agencyPhone: contractData.agencyPhone,
        agencyEmail: contractData.agencyEmail,
        ownerName: contractData.ownerName,
        ownerAddress: contractData.ownerAddress,
        ownerPhone: contractData.ownerPhone,
        propertyAddress: contractData.propertyAddress,
        propertyDescription: contractData.propertyDescription,
        commissionRate: contractData.commissionRate,
        startDate: contractData.startDate,
        endDate: contractData.endDate
      });
    } else {
      contract = ContractTemplates.generateRentalContract({
        agencyName: contractData.agencyName,
        agencyAddress: contractData.agencyAddress,
        agencyPhone: contractData.agencyPhone,
        tenantName: contractData.tenantName,
        tenantAddress: contractData.tenantAddress,
        tenantPhone: contractData.tenantPhone,
        tenantProfession: contractData.tenantProfession,
        propertyAddress: contractData.propertyAddress,
        propertyDescription: contractData.propertyDescription,
        monthlyRent: contractData.monthlyRent,
        deposit: contractData.deposit,
        charges: contractData.charges,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        duration: contractData.duration
      });
    }
    
    setGeneratedContract(contract);
    setShowPreview(true);
  };

  const downloadContract = () => {
    const blob = new Blob([generatedContract], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contrat-${type}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const saveContract = () => {
    if (onContractGenerated) {
      onContractGenerated(generatedContract);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={`Générer un contrat de ${type === 'gestion' ? 'gestion' : 'bail'}`}>
      <div className="space-y-6">
        {!showPreview ? (
          <div className="space-y-6">
            {/* Informations Agence */}
            <Card>
              <div className="flex items-center mb-4">
                <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Informations de l'agence</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom de l'agence"
                  value={contractData.agencyName}
                  onChange={(e) => setContractData(prev => ({ ...prev, agencyName: e.target.value }))}
                  required
                />
                <Input
                  label="Adresse"
                  value={contractData.agencyAddress}
                  onChange={(e) => setContractData(prev => ({ ...prev, agencyAddress: e.target.value }))}
                  required
                />
                <Input
                  label="Téléphone"
                  value={contractData.agencyPhone}
                  onChange={(e) => setContractData(prev => ({ ...prev, agencyPhone: e.target.value }))}
                  required
                />
                <Input
                  label="Email"
                  value={contractData.agencyEmail}
                  onChange={(e) => setContractData(prev => ({ ...prev, agencyEmail: e.target.value }))}
                  required
                />
              </div>
            </Card>

            {/* Informations Propriétaire */}
            {type === 'gestion' && (
              <Card>
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Informations du propriétaire</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nom complet"
                    value={contractData.ownerName}
                    onChange={(e) => setContractData(prev => ({ ...prev, ownerName: e.target.value }))}
                    required
                  />
                  <Input
                    label="Adresse"
                    value={contractData.ownerAddress}
                    onChange={(e) => setContractData(prev => ({ ...prev, ownerAddress: e.target.value }))}
                    required
                  />
                  <Input
                    label="Téléphone"
                    value={contractData.ownerPhone}
                    onChange={(e) => setContractData(prev => ({ ...prev, ownerPhone: e.target.value }))}
                    required
                  />
                  <Input
                    label="Taux de commission (%)"
                    type="number"
                    value={contractData.commissionRate}
                    onChange={(e) => setContractData(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </Card>
            )}

            {/* Informations Locataire */}
            {type === 'bail' && (
              <Card>
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Informations du locataire</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nom complet"
                    value={contractData.tenantName}
                    onChange={(e) => setContractData(prev => ({ ...prev, tenantName: e.target.value }))}
                    required
                  />
                  <Input
                    label="Profession"
                    value={contractData.tenantProfession}
                    onChange={(e) => setContractData(prev => ({ ...prev, tenantProfession: e.target.value }))}
                    required
                  />
                  <Input
                    label="Adresse"
                    value={contractData.tenantAddress}
                    onChange={(e) => setContractData(prev => ({ ...prev, tenantAddress: e.target.value }))}
                    required
                  />
                  <Input
                    label="Téléphone"
                    value={contractData.tenantPhone}
                    onChange={(e) => setContractData(prev => ({ ...prev, tenantPhone: e.target.value }))}
                    required
                  />
                </div>
              </Card>
            )}

            {/* Informations Propriété */}
            <Card>
              <div className="flex items-center mb-4">
                <Building2 className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Informations de la propriété</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Adresse de la propriété"
                  value={contractData.propertyAddress}
                  onChange={(e) => setContractData(prev => ({ ...prev, propertyAddress: e.target.value }))}
                  required
                />
                <Input
                  label="Description"
                  value={contractData.propertyDescription}
                  onChange={(e) => setContractData(prev => ({ ...prev, propertyDescription: e.target.value }))}
                  required
                />
              </div>
            </Card>

            {/* Informations Financières */}
            {type === 'bail' && (
              <Card>
                <div className="flex items-center mb-4">
                  <DollarSign className="h-5 w-5 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Informations financières</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Loyer mensuel (FCFA)"
                    type="number"
                    value={contractData.monthlyRent}
                    onChange={(e) => setContractData(prev => ({ ...prev, monthlyRent: parseInt(e.target.value) || 0 }))}
                    required
                  />
                  <Input
                    label="Caution (FCFA)"
                    type="number"
                    value={contractData.deposit}
                    onChange={(e) => setContractData(prev => ({ ...prev, deposit: parseInt(e.target.value) || 0 }))}
                    required
                  />
                  <Input
                    label="Charges (FCFA)"
                    type="number"
                    value={contractData.charges}
                    onChange={(e) => setContractData(prev => ({ ...prev, charges: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </Card>
            )}

            {/* Dates */}
            <Card>
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Durée du contrat</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Date de début"
                  type="date"
                  value={contractData.startDate.toISOString().split('T')[0]}
                  onChange={(e) => setContractData(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  required
                />
                {type === 'bail' && (
                  <>
                    <Input
                      label="Durée (mois)"
                      type="number"
                      value={contractData.duration}
                      onChange={(e) => {
                        const duration = parseInt(e.target.value) || 12;
                        const endDate = new Date(contractData.startDate);
                        endDate.setMonth(endDate.getMonth() + duration);
                        setContractData(prev => ({ 
                          ...prev, 
                          duration,
                          endDate 
                        }));
                      }}
                      min="1"
                      required
                    />
                    <Input
                      label="Date de fin"
                      type="date"
                      value={contractData.endDate.toISOString().split('T')[0]}
                      onChange={(e) => setContractData(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                      required
                    />
                  </>
                )}
              </div>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                Contrat conforme à la législation ivoirienne
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Respect du Code civil ivoirien</li>
                <li>• Clauses de protection du locataire</li>
                <li>• Procédures de résiliation conformes</li>
                <li>• Révision de loyer selon l'INS</li>
                <li>• Juridiction compétente : Abidjan</li>
              </ul>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={generateContract}>
                <FileText className="h-4 w-4 mr-2" />
                Générer le contrat
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Aperçu du contrat
              </h3>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="outline" onClick={downloadContract}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                {generatedContract}
              </pre>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <Button variant="ghost" onClick={onClose}>
                Fermer
              </Button>
              <Button onClick={saveContract}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer le contrat
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};