export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const APP_ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  DEVICE_CODES: '/device-codes',
  DEVICES: '/devices',
  PAYMENTS: '/payments',
  ADMINS: '/admins',
  SETTINGS: '/settings',
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
};

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 10,
  PAGE_OPTIONS: [10, 25, 50, 100],
};
