import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, LOCAL_STORAGE_KEYS } from '../config/constants';
import { encryptionService } from './encryptionService';
import { rateLimitService } from './rateLimitService';
import { securityAuditService } from './securityAuditService';

class SecureApiService {
  private api: AxiosInstance;
  private readonly SENSITIVE_PATHS = ['/auth', '/admin', '/validate'];
  private readonly ENCRYPTION_PATHS = ['/auth/login', '/auth/mfa', '/admin/create'];
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: this.REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        try {
          const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          // Add security headers
          config.headers['X-Request-Time'] = new Date().toISOString();
          config.headers['X-Request-ID'] = this.generateRequestId();
          config.headers['X-Client-Version'] = process.env.REACT_APP_VERSION || '1.0.0';

          // Check rate limits
          const path = config.url?.split('?')[0] || '';
          const operation = this.getOperationType(path);
          await rateLimitService.checkRateLimit(
            operation,
            'riyadsiddique'
          );

          // Encrypt sensitive data
          if (this.shouldEncrypt(path) && config.data) {
            const encryptedData = await encryptionService.encryptData(
              config.data,
              process.env.REACT_APP_ENCRYPTION_KEY || 'default-key'
            );
            config.data = { encrypted: encryptedData };
          }

          // Log security relevant requests
          if (this.SENSITIVE_PATHS.some(p => path.includes(p))) {
            await securityAuditService.logEvent('API_REQUEST', {
              path,
              method: config.method,
              timestamp: new Date().toISOString(),
            });
          }

          return config;
        } catch (error) {
          securityAuditService.logEvent('REQUEST_ERROR', {
            error: error.message,
            timestamp: new Date().toISOString(),
          });
          return Promise.reject(error);
        }
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      async (response: AxiosResponse) => {
        try {
          const path = response.config.url || '';

          // Decrypt sensitive data
          if (this.shouldEncrypt(path) && response.data?.encrypted) {
            response.data = await encryptionService.decryptData(
              response.data.encrypted,
              process.env.REACT_APP_ENCRYPTION_KEY || 'default-key'
            );
          }

          // Validate response integrity
          this.validateResponseIntegrity(response);

          return response;
        } catch (error) {
          securityAuditService.logEvent('RESPONSE_ERROR', {
            error: error.message,
            timestamp: new Date().toISOString(),
          });
          return Promise.reject(error);
        }
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
          window.location.href = '/login';
        } else if (error.response?.status === 429) {
          // Rate limit exceeded
          securityAuditService.logEvent('RATE_LIMIT_EXCEEDED', {
            path: error.config?.url,
            timestamp: new Date().toISOString(),
          });
        }
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
    return this.ENCRYPTION_PATHS.some(sensitivePath => path.includes(sensitivePath));
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private validateResponseIntegrity(response: AxiosResponse): void {
    const responseTime = new Date(response.headers['x-response-time']).getTime();
    const currentTime = Date.now();

    // Check response time validity
    if (currentTime - responseTime > this.REQUEST_TIMEOUT) {
      throw new Error('Response timeout exceeded');
    }

    // Verify response headers
    if (!response.headers['x-response-id']) {
      throw new Error('Missing response identification');
    }
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get<T>(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }
}

export const secureApiService = new SecureApiService();
