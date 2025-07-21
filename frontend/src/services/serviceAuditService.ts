import { apiService } from './api';

export interface SecurityEvent {
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: any;
  timestamp: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
}

class SecurityAuditService {
  private readonly SEVERITY_LEVELS = {
    AUTH_FAILURE: 'high',
    MFA_FAILURE: 'high',
    PERMISSION_DENIED: 'medium',
    PASSWORD_CHANGE: 'medium',
    SESSION_EXPIRED: 'low',
    SETTINGS_CHANGE: 'medium',
    ADMIN_ACTION: 'high',
  };

  public async logEvent(
    eventType: string,
    details: any,
    severity?: string
  ): Promise<void> {
    const event: SecurityEvent = {
      eventType,
      severity: (severity || this.SEVERITY_LEVELS[eventType] || 'low') as SecurityEvent['severity'],
      details,
      timestamp: new Date().toISOString(),
      userId: 'riyadsiddique', // Current user from your context
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
    };

    try {
      await apiService.post('/security/audit-log', event);
      
      // If it's a critical event, trigger immediate notification
      if (event.severity === 'critical') {
        this.notifySecurityTeam(event);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Store failed logs locally for retry
      this.storeFailedLog(event);
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  private async notifySecurityTeam(event: SecurityEvent): Promise<void> {
    try {
      await apiService.post('/security/notifications', {
        type: 'SECURITY_ALERT',
        event,
      });
    } catch (error) {
      console.error('Failed to notify security team:', error);
    }
  }

  private storeFailedLog(event: SecurityEvent): void {
    const failedLogs = JSON.parse(
      localStorage.getItem('failedSecurityLogs') || '[]'
    );
    failedLogs.push(event);
    localStorage.setItem('failedSecurityLogs', JSON.stringify(failedLogs));

    // Schedule retry
    this.retryFailedLogs();
  }

  private async retryFailedLogs(): Promise<void> {
    const failedLogs = JSON.parse(
      localStorage.getItem('failedSecurityLogs') || '[]'
    );
    
    if (failedLogs.length === 0) return;

    const successfulRetries: number[] = [];

    for (let i = 0; i < failedLogs.length; i++) {
      try {
        await apiService.post('/security/audit-log', failedLogs[i]);
        successfulRetries.push(i);
      } catch (error) {
        console.error('Retry failed for log:', failedLogs[i]);
      }
    }

    // Remove successful retries
    const remainingLogs = failedLogs.filter(
      (_, index) => !successfulRetries.includes(index)
    );
    localStorage.setItem('failedSecurityLogs', JSON.stringify(remainingLogs));
  }
}

export const securityAuditService = new SecurityAuditService();
