export const productionConfig = {
  API_URL: process.env.REACT_APP_API_URL || 'https://api.prolinevalidator.com',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  ENVIRONMENT: 'production',
  AUTH_TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
  API_TIMEOUT: 30000, // 30 seconds
  MAX_UPLOAD_SIZE: 5242880, // 5MB in bytes
  SUPPORTED_LOCALES: ['en'],
  DEFAULT_LOCALE: 'en',
  DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm:ss',
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  },
  THEME: {
    PRIMARY_COLOR: '#1976d2',
    SECONDARY_COLOR: '#dc004e',
    BACKGROUND_COLOR: '#f5f5f5',
  },
};
