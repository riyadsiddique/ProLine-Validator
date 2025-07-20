import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { productionConfig } from '../../config/production';
import { store } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { showNotification } from '../../store/slices/uiSlice';

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: productionConfig.API_URL,
    timeout: productionConfig.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(productionConfig.AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        store.dispatch(logout());
        store.dispatch(showNotification({
          type: 'error',
          message: 'Session expired. Please login again.',
        }));
      } else if (error.response?.status === 403) {
        store.dispatch(showNotification({
          type: 'error',
          message: 'You do not have permission to perform this action.',
        }));
      } else {
        store.dispatch(showNotification({
          type: 'error',
          message: error.response?.data?.message || 'An error occurred.',
        }));
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = createAxiosInstance();
