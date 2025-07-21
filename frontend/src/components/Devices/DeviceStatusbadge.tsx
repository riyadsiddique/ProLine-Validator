import React from 'react';
import { Chip } from '@mui/material';
import {
  CheckCircle,
  Error,
  Lock,
  Warning,
  HourglassEmpty,
} from '@mui/icons-material';

interface DeviceStatusBadgeProps {
  status: string;
}

const DeviceStatusBadge: React.FC<DeviceStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          color: 'success',
          icon: <CheckCircle />,
          label: 'Active',
        };
      case 'locked':
        return {
          color: 'error',
          icon: <Lock />,
          label: 'Locked',
        };
      case 'pending':
        return {
          color: 'warning',
          icon: <HourglassEmpty />,
          label: 'Pending',
        };
      case 'warning':
        return {
          color: 'warning',
          icon: <Warning />,
          label: 'Warning',
        };
      default:
        return {
          color: 'error',
          icon: <Error />,
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color as 'success' | 'error' | 'warning'}
      size="small"
    />
  );
};

export default DeviceStatusBadge;
