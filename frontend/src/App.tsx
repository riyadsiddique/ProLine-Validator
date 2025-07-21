import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import theme from './theme';
import store from './store';

// Layouts
import ProtectedLayout from './layouts/ProtectedLayout';

// Pages
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import DeviceList from './pages/Devices/DeviceList';
import DeviceValidation from './pages/Devices/DeviceValidation';
import UserManagement from './pages/Admin/UserManagement';
import ActivityLogs from './pages/Admin/ActivityLogs';
import SystemSettings from './pages/Settings/SystemSettings';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Guards
import PermissionGuard from './components/Auth/PermissionGuard';

// Constants
import { ROUTES_PERMISSIONS } from './utils/permissions';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            <Route element={<ProtectedLayout />}>
              <Route
                path="/"
                element={
                  <PermissionGuard requiredPermissions={ROUTES_PERMISSIONS.dashboard.permissions}>
                    <Dashboard />
                  </PermissionGuard>
                }
              />
              
              <Route
                path="/devices"
                element={
                  <PermissionGuard requiredPermissions={ROUTES_PERMISSIONS.deviceList.permissions}>
                    <DeviceList />
                  </PermissionGuard>
                }
              />
              
              <Route
                path="/validate"
                element={
                  <PermissionGuard requiredPermissions={ROUTES_PERMISSIONS.deviceValidation.permissions}>
                    <DeviceValidation />
                  </PermissionGuard>
                }
              />
              
              <Route
                path="/admin"
                element={
                  <PermissionGuard requiredPermissions={ROUTES_PERMISSIONS.adminManagement.permissions}>
                    <UserManagement />
                  </PermissionGuard>
                }
              />
              
              <Route
                path="/admin/logs"
                element={
                  <PermissionGuard requiredPermissions={ROUTES_PERMISSIONS.activityLogs.permissions}>
                    <ActivityLogs />
                  </PermissionGuard>
                }
              />
              
              <Route
                path="/settings"
                element={
                  <PermissionGuard requiredPermissions={ROUTES_PERMISSIONS.settings.permissions}>
                    <SystemSettings />
                  </PermissionGuard>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
