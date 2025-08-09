export interface ContractTemplate {
  id: string;
  type: 'gestion' | 'bail';
  title: string;
  content: string;
  variables: string[];
}

export class ContractTemplates {
  static generateManagementContract(data: {
    agencyName: string;
    agencyAddress: string;
    agencyPhone: string;
    agencyEmail: string;
    ownerName: string;
    ownerAddress: string;
    ownerPhone: string;
    propertyAddress: string;
    propertyDescription: string;
    commissionRate: number;
    startDate: Date;
    endDate?: Date;
  }): string {
    return `
CONTRAT DE GESTION IMMOBILIÈRE
(Conforme au Code civil ivoirien)

Entre les soussignés :

D'UNE PART :
Monsieur/Madame ${data.ownerName}
Demeurant à : ${data.ownerAddress}
Téléphone : ${data.ownerPhone}
Ci-après dénommé(e) "LE PROPRIÉTAIRE"

D'AUTRE PART :
${data.agencyName}
Agence immobilière agréée
Adresse : ${data.agencyAddress}
Téléphone : ${data.agencyPhone}
Email : ${data.agencyEmail}
Ci-après dénommée "L'AGENCE"

ARTICLE 1 - OBJET DU CONTRAT
Le propriétaire confie à l'agence la gestion complète du bien immobilier suivant :
- Adresse : ${data.propertyAddress}
- Description : ${data.propertyDescription}

ARTICLE 2 - OBLIGATIONS DE L'AGENCE
L'agence s'engage à :
- Rechercher et sélectionner les locataires solvables
- Établir les contrats de bail conformes à la loi
- Percevoir les loyers et charges mensuellement
- Effectuer les reversements au propriétaire dans les 10 jours
- Assurer le suivi rigoureux des paiements
- Gérer les relations avec les locataires
- Effectuer les états des lieux d'entrée et de sortie
- Tenir une comptabilité détaillée des opérations
- Informer le propriétaire de tout incident

ARTICLE 3 - OBLIGATIONS DU PROPRIÉTAIRE
Le propriétaire s'engage à :
- Mettre le bien en parfait état de location
- Fournir tous les documents nécessaires (titre de propriété, etc.)
- Prendre en charge les gros travaux d'entretien et de réparation
- Respecter la réglementation en vigueur
- Souscrire une assurance propriétaire non occupant

ARTICLE 4 - RÉMUNÉRATION
La commission de gestion est fixée à ${data.commissionRate}% (${data.commissionRate} pour cent) du montant des loyers effectivement perçus.
Cette commission couvre tous les services de gestion courante.
Aucune commission n'est due sur les loyers impayés.

ARTICLE 5 - REVERSEMENTS
Les reversements au propriétaire s'effectuent mensuellement, au plus tard le 15 de chaque mois,
déduction faite de la commission et des charges éventuelles avancées par l'agence.
Un état détaillé accompagne chaque reversement.

ARTICLE 6 - DURÉE
Le présent contrat prend effet le ${data.startDate.toLocaleDateString('fr-FR')}${data.endDate ? ` et se termine le ${data.endDate.toLocaleDateString('fr-FR')}` : ' pour une durée indéterminée'}.
Il se renouvelle par tacite reconduction sauf dénonciation.

ARTICLE 7 - RÉSILIATION
Chaque partie peut résilier le contrat moyennant un préavis de trois (3) mois 
par lettre recommandée avec accusé de réception.
En cas de résiliation, l'agence remet au propriétaire tous les documents et fonds détenus.

ARTICLE 8 - TRAVAUX
Les travaux d'entretien courant (inférieurs à 50.000 FCFA) peuvent être engagés par l'agence
après accord du propriétaire. Les travaux supérieurs nécessitent l'autorisation écrite préalable.

ARTICLE 9 - ASSURANCES
Le propriétaire s'engage à maintenir une assurance couvrant le bien contre les risques locatifs.
L'agence vérifie que les locataires souscrivent une assurance habitation.

ARTICLE 10 - LITIGES
Tout litige relatif au présent contrat sera soumis aux tribunaux compétents d'Abidjan,
Côte d'Ivoire, après tentative de conciliation amiable.

ARTICLE 11 - DISPOSITIONS DIVERSES
Le présent contrat est régi par le droit ivoirien.
Toute modification doit faire l'objet d'un avenant écrit et signé des deux parties.

Fait à Abidjan, le ${new Date().toLocaleDateString('fr-FR')}
En deux exemplaires originaux

LE PROPRIÉTAIRE                    L'AGENCE
${data.ownerName}                  ${data.agencyName}

Signature :                        Signature et cachet :


_____________________             _____________________

ANNEXES :
- Copie du titre de propriété
- État des lieux du bien
- Barème des honoraires
`;
  }

  static generateRentalContract(data: {
    agencyName: string;
    agencyAddress: string;
    agencyPhone: string;

    agencyEmail: string;
    agencyCommercialRegister: string;
    tenantName: string;
    tenantAddress: string;
    tenantPhone: string;
    tenantProfession: string;

    tenantNationality: string;
    tenantIdNumber: string;
    ownerName: string;
    ownerAddress: string;
    ownerPhone: string;
    propertyAddress: string;
    propertyDescription: string;
    monthlyRent: number;
    deposit: number;
    charges?: number;
    startDate: Date;
    endDate?: Date;
    duration: number; // en mois
  }): string {
    return `

CONTRAT DE BAIL À USAGE PROFESSIONNEL
(Conforme aux articles 101 à 134 du Traité OHADA relatif au Droit Commercial Général)
(Ratifié par la République de Côte d'Ivoire le 29 septembre 1995)

Entre les soussignés :

LE BAILLEUR (Article 101 OHADA) :
Monsieur/Madame ${data.ownerName}
Demeurant à : ${data.ownerAddress}
Téléphone : ${data.ownerPhone}

Représenté par :
${data.agencyName}
Agence immobilière agréée et mandatée
Registre de Commerce : ${data.agencyCommercialRegister}
Agissant pour le compte du propriétaire
Adresse : ${data.agencyAddress}
Téléphone : ${data.agencyPhone}
Email : ${data.agencyEmail}
Ci-après dénommé "LE BAILLEUR"

LE PRENEUR (Article 102 OHADA) :
Monsieur/Madame ${data.tenantName}
Profession : ${data.tenantProfession}
Nationalité : ${data.tenantNationality}
Pièce d'identité N° : ${data.tenantIdNumber}
Demeurant à : ${data.tenantAddress}
Téléphone : ${data.tenantPhone}
Ci-après dénommé(e) "LE PRENEUR"

ARTICLE 1 - OBJET DU BAIL (Article 103 OHADA)
Le bailleur donne à bail au preneur les locaux suivants :
- Adresse : ${data.propertyAddress}
- Description : ${data.propertyDescription}
- Destination : Usage d'habitation exclusivement

ARTICLE 2 - DESTINATION ET USAGE (Article 104 OHADA)
Les locaux sont destinés exclusivement à l'habitation du preneur et de sa famille.
Toute sous-location, cession ou changement d'affectation est interdite sans l'accord écrit préalable du bailleur.
Le preneur ne pourra exercer aucune activité commerciale dans les lieux loués.

ARTICLE 3 - DURÉE DU BAIL (Article 105 OHADA)
Le présent bail est consenti et accepté pour une durée ferme et définitive de ${data.duration} mois,
soit du ${data.startDate.toLocaleDateString('fr-FR')}${data.endDate ? ` au ${data.endDate.toLocaleDateString('fr-FR')}` : ''}.

Conformément à l'article 106 OHADA, le bail se renouvelle par tacite reconduction pour des périodes 
successives d'une année, sauf dénonciation par l'une des parties dans les conditions prévues par la loi.

ARTICLE 4 - LOYER ET MODALITÉS DE PAIEMENT (Article 107 OHADA)
Le loyer mensuel est fixé à ${data.monthlyRent.toLocaleString()} FCFA 
(${this.numberToWords(data.monthlyRent)} francs CFA).
${data.charges ? `Les charges mensuelles s'élèvent à ${data.charges.toLocaleString()} FCFA.` : ''}

Conformément à l'article 108 OHADA, le loyer est payable d'avance, au plus tard le 5 de chaque mois,
au domicile du bailleur ou de son représentant, sans qu'il soit besoin de demande ou de mise en demeure.

Tout retard de paiement donnera lieu à l'application d'intérêts de retard au taux légal en vigueur.

ARTICLE 5 - DÉPÔT DE GARANTIE (Article 109 OHADA)
Le preneur verse à la signature des présentes une garantie de ${data.deposit.toLocaleString()} FCFA,
représentant ${Math.round(data.deposit / data.monthlyRent)} mois de loyer.

Cette garantie, qui ne porte pas intérêt, sera restituée dans un délai de deux mois après la remise des clés,
déduction faite des sommes restant dues au bailleur et du coût des réparations locatives.

ARTICLE 6 - OBLIGATIONS DU PRENEUR (Article 110 OHADA)
Le preneur s'engage à :
- Payer le loyer aux échéances convenues
- Occuper paisiblement les lieux et les maintenir en bon état d'entretien
- Effectuer les menues réparations et l'entretien courant à sa charge
- Ne pas sous-louer, céder ou échanger sans autorisation écrite du bailleur
- Souscrire une assurance multirisque habitation et en justifier annuellement
- Respecter le règlement de copropriété et les usages de l'immeuble
- Permettre les visites pour travaux urgents, vente éventuelle ou vérifications
- Restituer les lieux en bon état de réparations locatives en fin de bail

ARTICLE 7 - OBLIGATIONS DU BAILLEUR (Article 111 OHADA)
Le bailleur s'engage à :
- Délivrer le logement en bon état d'habitabilité
- Garantir la jouissance paisible des lieux loués
- Effectuer les grosses réparations et l'entretien de la structure
- Respecter le droit au maintien dans les lieux du preneur
- Assurer le bon fonctionnement des équipements mis à disposition

ARTICLE 8 - ÉTAT DES LIEUX (Article 112 OHADA)
Un état des lieux contradictoire et détaillé sera établi à l'entrée et à la sortie du preneur.
En cas de désaccord, il sera fait appel à un huissier de justice.
Cet état des lieux fait partie intégrante du présent contrat.

ARTICLE 9 - TRAVAUX ET RÉPARATIONS (Article 113 OHADA)
Les réparations locatives (robinetterie, peinture, entretien courant) sont à la charge du preneur.
Les grosses réparations (toiture, structure, etc.) restent à la charge du bailleur.
Les améliorations apportées par le preneur lui appartiennent, sauf convention contraire.

ARTICLE 10 - RÉSILIATION PAR LE PRENEUR (Article 114 OHADA)
Le preneur peut résilier le bail à tout moment moyennant un préavis de trois (3) mois
donné par lettre recommandée avec accusé de réception.
La résiliation prend effet à l'expiration du préavis, le dernier jour du mois.

ARTICLE 11 - RÉSILIATION PAR LE BAILLEUR (Article 115 OHADA)
Le bailleur ne peut résilier le bail qu'aux conditions strictement prévues par l'OHADA :
- Pour reprise personnelle ou familiale (préavis de 6 mois)
- Pour vente (préavis de 6 mois avec droit de préemption du locataire)
- Pour motif légitime et sérieux dûment justifié
- Pour défaut de paiement après mise en demeure restée infructueuse

ARTICLE 12 - RÉVISION DU LOYER (Article 116 OHADA)
Le loyer pourra être révisé annuellement selon l'indice harmonisé des prix à la consommation
publié par l'Institut National de la Statistique (INS) de Côte d'Ivoire, dans la limite de 10% par an.
Toute révision doit être notifiée par écrit avec un préavis de trois mois.

ARTICLE 13 - CLAUSE RÉSOLUTOIRE (Article 117 OHADA)
À défaut de paiement du loyer aux échéances convenues, et après mise en demeure par exploit d'huissier
demeurée infructueuse pendant un délai de quinze (15) jours, le présent bail sera résilié de plein droit.

Cette résiliation s'opérera sans préjudice des dommages-intérêts qui pourraient être réclamés au preneur.

ARTICLE 14 - CESSION ET SOUS-LOCATION (Article 118 OHADA)
Conformément à l'article 118 OHADA, la cession du bail et la sous-location, même partielle,
sont formellement interdites sans l'accord écrit et préalable du bailleur.
Toute violation de cette clause entraînera la résiliation immédiate du bail.

ARTICLE 15 - ASSURANCE (Article 119 OHADA)
Le preneur s'oblige à souscrire une police d'assurance multirisque habitation couvrant notamment
les risques d'incendie, dégât des eaux, vol et responsabilité civile.
Il devra justifier annuellement du paiement des primes d'assurance.

ARTICLE 16 - ÉLECTION DE DOMICILE (Article 120 OHADA)
Les parties élisent domicile en leurs adresses respectives ci-dessus indiquées
pour l'exécution du présent contrat et toutes significations qui pourraient être nécessaires.

ARTICLE 17 - DROIT APPLICABLE ET JURIDICTION (Article 121 OHADA)
Le présent contrat est régi par les dispositions du Traité OHADA relatif au Droit Commercial Général,
notamment les articles 101 à 134, et subsidiairement par le droit civil ivoirien.

Tout litige relatif à l'interprétation ou à l'exécution du présent contrat sera soumis
aux tribunaux compétents d'Abidjan, République de Côte d'Ivoire, après tentative de conciliation amiable.

ARTICLE 18 - ENREGISTREMENT ET PUBLICITÉ (Article 122 OHADA)
Le présent contrat sera enregistré dans les formes et délais prévus par la législation fiscale ivoirienne.
Les frais d'enregistrement sont à la charge du preneur.

ARTICLE 19 - DISPOSITIONS DIVERSES (Article 123 OHADA)
Toute modification du présent contrat devra faire l'objet d'un avenant écrit et signé des deux parties.
Si une clause du présent contrat venait à être déclarée nulle, les autres clauses conserveraient leur validité.

ARTICLE 20 - ENTRÉE EN VIGUEUR
Le présent contrat prend effet le ${data.startDate.toLocaleDateString('fr-FR')} pour la durée convenue.
Il a été lu et approuvé par les parties avant signature.

Fait à Abidjan, le ${new Date().toLocaleDateString('fr-FR')}
En deux exemplaires originaux, dont un pour chaque partie

RÉFÉRENCES LÉGALES :
- Traité OHADA relatif au Droit Commercial Général (articles 101-134)
- Loi ivoirienne n° 64-290 du 1er août 1964 sur les baux d'habitation
- Code civil ivoirien (dispositions supplétives)

LE BAILLEUR                        LE PRENEUR
${data.ownerName}                  ${data.tenantName}
Représenté par ${data.agencyName}
=======
CONTRAT DE BAIL D'HABITATION
(Conforme à la loi ivoirienne sur les baux d'habitation)

Entre les soussignés :

LE BAILLEUR :
${data.agencyName}
Agence immobilière agréée
Agissant pour le compte du propriétaire
Adresse : ${data.agencyAddress}
Téléphone : ${data.agencyPhone}
Ci-après dénommé "LE BAILLEUR"

LE LOCATAIRE :
Monsieur/Madame ${data.tenantName}
Profession : ${data.tenantProfession}
Demeurant à : ${data.tenantAddress}
Téléphone : ${data.tenantPhone}
Ci-après dénommé(e) "LE LOCATAIRE"

ARTICLE 1 - OBJET DE LA LOCATION
Le bailleur loue au locataire le logement suivant :
- Adresse : ${data.propertyAddress}
- Description : ${data.propertyDescription}

ARTICLE 2 - DESTINATION DES LIEUX
Les lieux loués sont destinés exclusivement à l'habitation du locataire et de sa famille.
Toute autre utilisation est formellement interdite sans accord écrit du bailleur.

ARTICLE 3 - DURÉE DU BAIL
Le présent bail est consenti pour une durée de ${data.duration} mois, 
soit du ${data.startDate.toLocaleDateString('fr-FR')}${data.endDate ? ` au ${data.endDate.toLocaleDateString('fr-FR')}` : ''}.
Il se renouvelle par tacite reconduction sauf dénonciation dans les formes légales.

ARTICLE 4 - LOYER ET CHARGES
Le loyer mensuel est fixé à ${data.monthlyRent.toLocaleString()} FCFA (${this.numberToWords(data.monthlyRent)} francs CFA).
${data.charges ? `Les charges mensuelles s'élèvent à ${data.charges.toLocaleString()} FCFA.` : ''}
Le loyer est payable d'avance, au plus tard le 5 de chaque mois, sans qu'il soit besoin de demande.

ARTICLE 5 - DÉPÔT DE GARANTIE
Le locataire verse une caution de ${data.deposit.toLocaleString()} FCFA, 
soit ${Math.round(data.deposit / data.monthlyRent)} mois de loyer.
Cette caution sera restituée en fin de bail, déduction faite des éventuelles réparations locatives.

ARTICLE 6 - OBLIGATIONS DU LOCATAIRE
Le locataire s'engage à :
- Payer le loyer aux échéances convenues
- Occuper paisiblement les lieux et les maintenir en bon état
- Effectuer les réparations locatives à sa charge
- Ne pas sous-louer sans autorisation écrite du bailleur
- Souscrire une assurance habitation et en justifier annuellement
- Respecter le règlement de copropriété s'il existe
- Permettre les visites pour travaux urgents ou vente éventuelle

ARTICLE 7 - OBLIGATIONS DU BAILLEUR
Le bailleur s'engage à :
- Délivrer le logement en bon état d'habitabilité
- Assurer la jouissance paisible des lieux
- Effectuer les grosses réparations nécessaires
- Respecter le droit au maintien dans les lieux du locataire

ARTICLE 8 - ÉTAT DES LIEUX
Un état des lieux contradictoire sera établi à l'entrée et à la sortie du locataire.
En cas de désaccord, il sera fait appel à un huissier de justice.

ARTICLE 9 - TRAVAUX ET RÉPARATIONS
Les réparations locatives (robinetterie, peinture, etc.) sont à la charge du locataire.
Les grosses réparations (toiture, structure, etc.) restent à la charge du bailleur.

ARTICLE 10 - RÉSILIATION PAR LE LOCATAIRE
Le locataire peut résilier le bail à tout moment moyennant un préavis de trois (3) mois
donné par lettre recommandée avec accusé de réception.

ARTICLE 11 - RÉSILIATION PAR LE BAILLEUR
Le bailleur ne peut résilier qu'aux conditions prévues par la loi :
- Pour reprise personnelle ou familiale (préavis de 6 mois)
- Pour vente (préavis de 6 mois avec droit de préemption du locataire)
- Pour motif légitime et sérieux

ARTICLE 12 - RÉVISION DU LOYER
Le loyer pourra être révisé annuellement selon l'indice des prix à la consommation
publié par l'Institut National de la Statistique (INS) de Côte d'Ivoire.

ARTICLE 13 - CLAUSE RÉSOLUTOIRE
À défaut de paiement du loyer aux échéances convenues, et un mois après commandement
demeuré infructueux, le présent bail sera résilié de plein droit.

ARTICLE 14 - CESSION ET SOUS-LOCATION
La cession du bail et la sous-location sont interdites sans l'accord écrit du bailleur.

ARTICLE 15 - ÉLECTION DE DOMICILE
Les parties élisent domicile en leurs adresses respectives ci-dessus indiquées
pour l'exécution du présent contrat.

ARTICLE 16 - LITIGES
Tout litige sera soumis aux tribunaux compétents d'Abidjan, Côte d'Ivoire,
après tentative de conciliation amiable.

Fait à Abidjan, le ${new Date().toLocaleDateString('fr-FR')}
En deux exemplaires originaux

LE BAILLEUR                        LE LOCATAIRE
${data.agencyName}                 ${data.tenantName}
>>>>>>> ab8e70ae88ac9b3ae8508fb999ffe72333408766

Signature et cachet :              Signature :


_____________________             _____________________


ANNEXES OBLIGATOIRES (Article 124 OHADA) :
- État des lieux d'entrée détaillé
- Copie certifiée conforme des pièces d'identité du preneur
- Justificatifs de revenus (3 derniers bulletins de salaire ou attestation employeur)
- Attestation d'assurance habitation
- Copie du titre de propriété ou mandat de gestion
- Règlement de copropriété (le cas échéant)
- Quittance de loyer du précédent logement (si applicable)
- Caution solidaire ou garantie bancaire (si exigée)

MENTIONS LÉGALES OBLIGATOIRES :
- Enregistrement fiscal obligatoire dans les 30 jours
- Droit de préemption du locataire en cas de vente (Article 116 OHADA)
- Procédure de révision des loyers selon l'indice INS
- Recours possible devant la Commission de Conciliation des Baux

ANNEXES OBLIGATOIRES :
- État des lieux d'entrée détaillé
- Copie des pièces d'identité du locataire
- Justificatifs de revenus (3 derniers bulletins de salaire)
- Attestation d'assurance habitation
- Règlement de copropriété (le cas échéant)
- Diagnostic de performance énergétique (si applicable)
`;
  }

  static numberToWords(num: number): string {
    // Fonction simplifiée pour convertir les nombres en lettres
    if (num === 450000) return "quatre cent cinquante mille";
    if (num === 900000) return "neuf cent mille";
    if (num === 25000) return "vingt-cinq mille";
    return num.toLocaleString();
  }

  static generateContractVariables(type: 'gestion' | 'bail'): string[] {
    if (type === 'gestion') {
      return [
        'AGENCY_NAME',
        'AGENCY_ADDRESS', 
        'AGENCY_PHONE',
        'AGENCY_EMAIL',
        'OWNER_NAME',
        'OWNER_ADDRESS',
        'OWNER_PHONE',
        'PROPERTY_ADDRESS',
        'PROPERTY_DESCRIPTION',
        'COMMISSION_RATE',
        'START_DATE',
        'END_DATE'
      ];
    } else {
      return [
        'AGENCY_NAME',
        'AGENCY_ADDRESS',
        'AGENCY_PHONE', 
        'TENANT_NAME',
        'TENANT_ADDRESS',
        'TENANT_PHONE',
        'TENANT_PROFESSION',
        'PROPERTY_ADDRESS',
        'PROPERTY_DESCRIPTION',
        'MONTHLY_RENT',
        'DEPOSIT',
        'CHARGES',
        'START_DATE',
        'END_DATE',
        'DURATION'
      ];
    }
  }
}