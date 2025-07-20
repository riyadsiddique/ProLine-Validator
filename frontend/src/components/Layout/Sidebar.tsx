import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  QrCode,
  PhoneAndroid,
  Payment,
  People,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { APP_ROUTES } from '../../config/constants';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  width?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, width = 240 }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: APP_ROUTES.DASHBOARD },
    { text: 'Device Codes', icon: <QrCode />, path: APP_ROUTES.DEVICE_CODES },
    { text: 'Devices', icon: <PhoneAndroid />, path: APP_ROUTES.DEVICES },
    { text: 'Payments', icon: <Payment />, path: APP_ROUTES.PAYMENTS },
    ...(user?.role === 'super_admin' ? [{ text: 'Admins', icon: <People />, path: APP_ROUTES.ADMINS }] : []),
    { text: 'Settings', icon: <Settings />, path: APP_ROUTES.SETTINGS },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          mt: 8,
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
