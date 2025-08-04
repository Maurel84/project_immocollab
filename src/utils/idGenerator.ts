export class AgencyIdGenerator {
  private static getAgencyCode(agencyName: string): string {
    // Générer un code à partir du nom de l'agence
    const words = agencyName.toUpperCase().split(' ');
    if (words.length >= 2) {
      return words[0].substring(0, 2) + words[1].substring(0, 2);
    }
    return agencyName.toUpperCase().substring(0, 4).padEnd(4, 'X');
  }

  static generateOwnerId(agencyId: string, agencyName: string): string {
    const agencyCode = this.getAgencyCode(agencyName);
    const timestamp = Date.now().toString().slice(-6);
    return `${agencyCode}-PROP-${timestamp}`;
  }

  static generateTenantId(agencyId: string, agencyName: string): string {
    const agencyCode = this.getAgencyCode(agencyName);
    const timestamp = Date.now().toString().slice(-6);
    return `${agencyCode}-LOC-${timestamp}`;
  }

  static generatePropertyId(agencyId: string, agencyName: string): string {
    const agencyCode = this.getAgencyCode(agencyName);
    const timestamp = Date.now().toString().slice(-6);
    return `${agencyCode}-BIEN-${timestamp}`;
  }

  static generateReceiptNumber(agencyId: string, agencyName: string, month: string, year: number): string {
    const agencyCode = this.getAgencyCode(agencyName);
    const monthNum = String(new Date(`${month} 1, ${year}`).getMonth() + 1).padStart(2, '0');
    const sequence = Math.floor(Math.random() * 999) + 1;
    return `${agencyCode}-${year}${monthNum}-${String(sequence).padStart(3, '0')}`;
  }
}

export class RankingCalculator {
  static calculateAgencyScore(metrics: {
    totalProperties: number;
    totalContracts: number;
    totalRevenue: number;
    rentCollectionRate: number;
    tenantSatisfaction: number;
    ownerSatisfaction: number;
  }): number {
    // Pondération des critères annuels
    const weights = {
      properties: 0.25,           // 25% - Volume de propriétés
      contracts: 0.20,            // 20% - Nombre de contrats
      rentCollection: 0.30,       // 30% - Taux de recouvrement
      tenantSatisfaction: 0.15,   // 15% - Satisfaction locataires
      ownerSatisfaction: 0.10,    // 10% - Satisfaction propriétaires
    };

    // Normalisation des scores (0-100)
    const normalizedScores = {
      properties: Math.min(metrics.totalProperties / 100 * 100, 100),
      contracts: Math.min(metrics.totalContracts / 50 * 100, 100),
      rentCollection: metrics.rentCollectionRate,
      tenantSatisfaction: metrics.tenantSatisfaction,
      ownerSatisfaction: metrics.ownerSatisfaction,
    };

    // Calcul du score final
    const finalScore = 
      normalizedScores.properties * weights.properties +
      normalizedScores.contracts * weights.contracts +
      normalizedScores.rentCollection * weights.rentCollection +
      normalizedScores.tenantSatisfaction * weights.tenantSatisfaction +
      normalizedScores.ownerSatisfaction * weights.ownerSatisfaction;

    return Math.round(finalScore * 100) / 100;
  }

  // Calcul de la satisfaction des locataires
  static calculateTenantSatisfaction(tenantData: {
    totalTenants: number;
    renewalRate: number;        // Taux de renouvellement
    complaintRate: number;      // Taux de plaintes
    averageStayDuration: number; // Durée moyenne en mois
  }): number {
    // Formule de satisfaction locataires
    const renewalScore = tenantData.renewalRate; // 0-100%
    const complaintScore = Math.max(0, 100 - tenantData.complaintRate * 10); // Moins de plaintes = mieux
    const stabilityScore = Math.min(100, tenantData.averageStayDuration * 5); // Plus longtemps = mieux
    
    return Math.round((renewalScore * 0.4 + complaintScore * 0.3 + stabilityScore * 0.3));
  }

  // Calcul de la satisfaction des propriétaires
  static calculateOwnerSatisfaction(ownerData: {
    totalOwners: number;
    paymentPunctuality: number;  // Ponctualité des reversements
    communicationScore: number;  // Score de communication
    retentionRate: number;       // Taux de rétention
  }): number {
    // Formule de satisfaction propriétaires
    const punctualityScore = ownerData.paymentPunctuality; // 0-100%
    const communicationScore = ownerData.communicationScore; // 0-100%
    const retentionScore = ownerData.retentionRate; // 0-100%
    
    return Math.round((punctualityScore * 0.4 + communicationScore * 0.3 + retentionScore * 0.3));
  }

  static generateRewards(rank: number, score: number): AgencyReward[] {
    const rewards: AgencyReward[] = [];
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 6);

    if (rank === 1) {
      rewards.push({
        id: `reward_${Date.now()}_1`,
        type: 'cash_bonus',
        title: 'Trophée d\'Excellence Annuel',
        description: 'Prime de 1,000,000 FCFA pour la 1ère place',
        value: 1000000,
        validUntil
      });
      rewards.push({
        id: `reward_${Date.now()}_2`,
        type: 'discount',
        title: 'Abonnement Gratuit',
        description: '100% de réduction sur l\'abonnement pendant 6 mois',
        value: 100,
        validUntil
      });
    } else if (rank === 2) {
      rewards.push({
        id: `reward_${Date.now()}_3`,
        type: 'cash_bonus',
        title: 'Prix de Performance',
        description: 'Prime de 600,000 FCFA pour la 2ème place',
        value: 600000,
        validUntil
      });
      rewards.push({
        id: `reward_${Date.now()}_4`,
        type: 'discount',
        title: 'Réduction Premium',
        description: '75% de réduction sur l\'abonnement pendant 4 mois',
        value: 75,
        validUntil
      });
    } else if (rank === 3) {
      rewards.push({
        id: `reward_${Date.now()}_5`,
        type: 'cash_bonus',
        title: 'Reconnaissance Qualité',
        description: 'Prime de 300,000 FCFA pour la 3ème place',
        value: 300000,
        validUntil
      });
      rewards.push({
        id: `reward_${Date.now()}_6`,
        type: 'discount',
        title: 'Réduction Avantage',
        description: '50% de réduction sur l\'abonnement pendant 3 mois',
        value: 50,
        validUntil
      });
    }

    if (score >= 85) {
      rewards.push({
        id: `reward_${Date.now()}_7`,
        type: 'badge',
        title: 'Certification Excellence',
        description: 'Certification de qualité pour score supérieur à 85',
        value: 0,
        validUntil
      });
    }

    return rewards;
  }
}