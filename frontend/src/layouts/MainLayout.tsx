import React, { useState } from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Notifications from '../components/Common/Notifications';
import { useAppSelector } from '../store/hooks';
import PreciseTimeDisplay from '../components/Common/PreciseTimeDisplay';

const DRAWER_WIDTH = 280;

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      <Navbar 
        drawerWidth={DRAWER_WIDTH}
        onDrawerToggle={handleDrawerToggle}
      />
      
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant={isMobile ? 'temporary' : 'permanent'}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <PreciseTimeDisplay username={user?.name || 'riyadsiddique'} />
        </Box>
        
        <Outlet />
        <Notifications />
      </Box>
    </Box>
  );
};

export default MainLayout;
