import { AxiosError } from 'axios';
import { store } from '../store';
import { showNotification } from '../store/slices/uiSlice';

export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message;
    store.dispatch(showNotification({
      type: 'error',
      title: 'Error',
      message: message
    }));
    return message;
  }

  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  store.dispatch(showNotification({
    type: 'error',
    title: 'Error',
    message: message
  }));
  return message;
};

export const handleSuccess = (message: string) => {
  store.dispatch(showNotification({
    type: 'success',
    message: message
  }));
};
