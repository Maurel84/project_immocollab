import { ActivityLog } from '../types/logs';

export class ActivityLogger {
  private static logs: ActivityLog[] = [];

  static log(
    userId: string,
    userName: string,
    agencyId: string,
    action: ActivityLog['action'],
    entityType: ActivityLog['entityType'],
    entityId: string,
    entityName: string,
    details: string
  ) {
    const log: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      agencyId,
      action,
      entityType,
      entityId,
      entityName,
      details,
      timestamp: new Date(),
      ipAddress: 'N/A', // Could be implemented with a service
      userAgent: navigator.userAgent,
    };

    // Store in localStorage for persistence
    const existingLogs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    existingLogs.unshift(log); // Add to beginning
    
    // Keep only last 1000 logs
    if (existingLogs.length > 1000) {
      existingLogs.splice(1000);
    }
    
    localStorage.setItem('activity_logs', JSON.stringify(existingLogs));
    
    console.log('Activity logged:', log);
  }

  static getLogs(agencyId: string, filter?: {
    userId?: string;
    action?: string;
    entityType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): ActivityLog[] {
    const allLogs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    
    return allLogs
      .filter((log: ActivityLog) => {
        if (log.agencyId !== agencyId) return false;
        if (filter?.userId && log.userId !== filter.userId) return false;
        if (filter?.action && log.action !== filter.action) return false;
        if (filter?.entityType && log.entityType !== filter.entityType) return false;
        if (filter?.dateFrom && new Date(log.timestamp) < filter.dateFrom) return false;
        if (filter?.dateTo && new Date(log.timestamp) > filter.dateTo) return false;
        return true;
      })
      .map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }))
      .sort((a: ActivityLog, b: ActivityLog) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  static clearLogs(agencyId: string) {
    const allLogs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    const filteredLogs = allLogs.filter((log: ActivityLog) => log.agencyId !== agencyId);
    localStorage.setItem('activity_logs', JSON.stringify(filteredLogs));
  }

  static exportLogs(agencyId: string): string {
    const logs = this.getLogs(agencyId);
    return JSON.stringify(logs, null, 2);
  }
}