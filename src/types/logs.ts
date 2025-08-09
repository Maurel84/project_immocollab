export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  agencyId: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'generate_contract' | 'print_receipt';
  entityType: 'owner' | 'tenant' | 'property' | 'contract' | 'receipt';
  entityId: string;
  entityName: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface LogFilter {
  userId?: string;
  action?: string;
  entityType?: string;
  dateFrom?: Date;
  dateTo?: Date;
}