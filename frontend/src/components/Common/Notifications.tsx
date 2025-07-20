import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearNotification } from '../../store/slices/uiSlice';

const Notifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notification } = useAppSelector((state) => state.ui);

  const handleClose = () => {
    dispatch(clearNotification());
  };

  if (!notification) return null;

  return (
    <Snackbar
      open={true}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={notification.type}
        sx={{ width: '100%' }}
        elevation={6}
        variant="filled"
      >
        {notification.title && (
          <AlertTitle>{notification.title}</AlertTitle>
        )}
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notifications;
