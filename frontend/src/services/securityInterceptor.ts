import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { encryptionService } from './encryptionService';
import { rateLimitService } from './rateLimitService';
import { securityAuditService } from './securityAuditService';

class SecurityInterceptor {
  private axiosInstance: AxiosInstance;
  private readonly SENSITIVE_PATHS = ['/auth', '/admin', '/validate'];
  private readonly ENCRYPTION_PATHS = ['/auth/login', '/auth/mfa'];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        try {
          // Check rate limits
          const path = config.url?.split('?')[0] || '';
          const operation = this.getOperationType(path);
          await rateLimitService.checkRateLimit(
            operation,
            'riyadsiddique' // Current user's identifier
          );

          // Encrypt sensitive data
          if (this.shouldEncrypt(path) && config.data) {
            config.data = await encryptionService.encryptData(
              config.data,
              process.env.REACT_APP_ENCRYPTION_KEY!
            );
          }

          // Add security headers
          config.headers = {
            ...config.headers,
            'X-Request-ID': this.generateRequestId(),
            'X-Timestamp': new Date().toISOString(),
          };

          return config;
        } catch (error) {
          securityAuditService.logEvent('REQUEST_BLOCKED', {
            path: config.url,
            reason: error.message,
          });
          throw error;
        }
      },
      (error) => {
        securityAuditService.logEvent('REQUEST_ERROR', {
          error: error.message,
        });
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      async (response: AxiosResponse) => {
        try {
          // Decrypt sensitive data
          if (this.shouldEncrypt(response.config.url || '') && response.data) {
            response.data = await encryptionService.decryptData(
              response.data,
              process.env.REACT_APP_ENCRYPTION_KEY!
            );
          }

          // Validate response integrity
          this.validateResponseIntegrity(response);

          return response;
        } catch (error) {
          securityAuditService.logEvent('RESPONSE_VALIDATION_FAILED', {
            path: response.config.url,
            error: error.message,
          });
          throw error;
        }
      },
      (error) => {
        securityAuditService.logEvent('RESPONSE_ERROR', {
          error: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  private getOperationType(path: string): string {
    if (path.startsWith('/auth')) return 'auth';
    if (path.startsWith('/validate')) return 'validation';
    return 'api';
  }

  private shouldEncrypt(path: string): boolean {
    return this.ENCRYPTION_PATHS.some((sensitivePath) =>
      path.includes(sensitivePath)
    );
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private validateResponseIntegrity(response: AxiosResponse): void {
    // Verify response headers
    if (!response.headers['x-response-id']) {
      throw new Error('Invalid response: Missing response ID');
    }

    // Verify response timestamp
    const responseTime = new Date(response.headers['x-response-timestamp']).getTime();
    const currentTime = Date.now();
    if (currentTime - responseTime > 30000) { // 30 seconds threshold
      throw new Error('Invalid response: Response timeout');
    }

    // Additional integrity checks can be added here
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const securityInterceptor = new SecurityInterceptor();
export const secureApi = securityInterceptor.getAxiosInstance();
