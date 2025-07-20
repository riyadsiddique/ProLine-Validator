import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from '@mui/material';
import {
  PhoneAndroid,
  Payment,
  Lock,
  LockOpen,
} from '@mui/icons-material';
import { format } from 'date-fns';

const RecentActivities: React.FC = () => {
  const activities = [
    {
      type: 'device_registered',
      deviceId: 'DEV001',
      time: new Date(),
      icon: <PhoneAndroid />,
    },
    {
      type: 'payment_received',
      amount: 500,
      time: new Date(Date.now() - 3600000),
      icon: <Payment />,
    },
    {
      type: 'device_locked',
      deviceId: 'DEV002',
      time: new Date(Date.now() - 7200000),
      icon: <Lock />,
    },
    {
      type: 'device_unlocked',
      deviceId: 'DEV003',
      time: new Date(Date.now() - 10800000),
      icon: <LockOpen />,
    },
  ];

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'device_registered':
        return `New device registered (${activity.deviceId})`;
      case 'payment_received':
        return `Payment received ($${activity.amount})`;
      case 'device_locked':
        return `Device locked (${activity.deviceId})`;
      case 'device_unlocked':
        return `Device unlocked (${activity.deviceId})`;
      default:
        return 'Unknown activity';
    }
  };

  return (
    <List sx={{ width: '100%', maxHeight: 400, overflow: 'auto' }}>
      {activities.map((activity, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar>
              {activity.icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={getActivityText(activity)}
            secondary={
              <Typography variant="caption" color="textSecondary">
                {format(activity.time, 'yyyy-MM-dd HH:mm:ss')}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default RecentActivities;
