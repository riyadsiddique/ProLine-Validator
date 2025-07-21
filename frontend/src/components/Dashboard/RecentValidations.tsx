
import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';

interface ValidationItem {
  id: number;
  deviceName: string;
  status: 'success' | 'failed';
  timestamp: string;
  message: string;
}

const mockData: ValidationItem[] = [
  {
    id: 1,
    deviceName: 'Device A',
    status: 'success',
    timestamp: '2024-01-21 10:30:00',
    message: 'All checks passed',
  },
  {
    id: 2,
    deviceName: 'Device B',
    status: 'failed',
    timestamp: '2024-01-21 10:28:00',
    message: 'Configuration mismatch',
  },
  {
    id: 3,
    deviceName: 'Device C',
    status: 'success',
    timestamp: '2024-01-21 10:25:00',
    message: 'All checks passed',
  },
];

const RecentValidations: React.FC = () => {
  return (
    <List>
      {mockData.map((item) => (
        <ListItem
          key={item.id}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            '&:last-child': {
              borderBottom: 'none',
            },
          }}
        >
          <ListItemIcon>
            {item.status === 'success' ? (
              <CheckCircle color="success" />
            ) : (
              <Error color="error" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="subtitle2">
                {item.deviceName}
                <Chip
                  label={item.status}
                  size="small"
                  color={item.status === 'success' ? 'success' : 'error'}
                  sx={{ ml: 1 }}
                />
              </Typography>
            }
            secondary={
              <>
                <Typography variant="caption" display="block" color="text.secondary">
                  {item.timestamp}
                </Typography>
                <Typography variant="body2">{item.message}</Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default RecentValidations;
