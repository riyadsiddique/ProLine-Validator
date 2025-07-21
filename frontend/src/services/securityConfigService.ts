interface SecurityConfig {
  encryption: {
    enabled: boolean;
    paths: string[];
    keyRotationInterval: number;
  };
  rateLimit: {
    enabled: boolean;
    configs: {
      [key: string]: {
        maxRequests: number;
        timeWindow: number;
        blockDuration: number;
      };
    };
  };
  session: {
    timeout: number;
    inactivityTimeout: number;
    maxConcurrentSessions: number;
  };
  audit: {
    enabled: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    retentionDays: number;
  };
}

class SecurityConfigService {
  private config: SecurityConfig = {
    encryption: {
      enabled: true,
      paths: ['/auth/login', '/auth/mfa', '/admin/create'],
      keyRotationInterval: 24 * 60 * 60 * 1000, // 24 hours
    },
    rateLimit: {
      enabled: true,
      configs: {
        auth: {
          maxRequests: 5,
          timeWindow: 60000,
          blockDuration: 300000,
        },
        api: {
          maxRequests: 100,
          timeWindow: 60000,
          blockDuration: 60000,
        },
        validation: {
          maxRequests: 10,
          timeWindow: 60000,
          blockDuration: 120000,
        },
      },
    },
    session: {
      timeout: 12 * 60 * 60 * 1000, // 12 hours
      inactivityTimeout: 30 * 60 * 1000, // 30 minutes
      maxConcurrentSessions: 1,
    },
    audit: {
      enabled: true,
      logLevel: 'info',
      retentionDays: 90,
    },
  };

  constructor() {
    this.loadConfig();
    this.setupKeyRotation();
  }

  private loadConfig(): void {
    try {
      const storedConfig = localStorage.getItem('securityConfig');
      if (storedConfig) {
        this.config = {
          ...this.config,
          ...JSON.parse(storedConfig),
        };
      }
    } catch (error) {
      console.error('Failed to load security config:', error);
    }
  }

  private saveConfig(): void {
    try {
      localStorage.setItem('securityConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save security config:', error);
    }
  }

  private setupKeyRotation(): void {
    setInterval(() => {
      if (this.config.encryption.enabled) {
        this.rotateEncryptionKey();
      }
    }, this.config.encryption.keyRotationInterval);
  }

  private async rotateEncryptionKey(): Promise<void> {
    try {
      const newKey = await encryptionService.generateKey(
        Math.random().toString(36),
        new Uint8Array(16)
      );
      // Store new key and handle key rotation
      localStorage.setItem('currentEncryptionKey', newKey.toString());
      securityAuditService.logEvent('KEY_ROTATION', {
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to rotate encryption key:', error);
    }
  }

  public updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };
    this.saveConfig();
    
    // Update related services
    if (newConfig.rateLimit) {
      Object.entries(newConfig.rateLimit.configs || {}).forEach(([key, config]) => {
        rateLimitService.updateLimits(key, config);
      });
    }
  }

  public getConfig(): SecurityConfig {
    return { ...this.config };
  }
}

export const securityConfigService = new SecurityConfigService();
