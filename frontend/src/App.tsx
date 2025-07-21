import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import MainLayout from './layouts/MainLayout';
import theme from './theme';
import store from './store';

// Pages
import Dashboard from './pages/Dashboard';
import DeviceValidation from './pages/Devices/DeviceValidation';
import DeviceList from './pages/Devices/DeviceList';
import SystemSettings from './pages/Settings/SystemSettings';
import UserManagement from './pages/Admin/UserManagement';
import Login from './pages/Auth/Login';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/devices" element={<DeviceList />} />
                <Route path="/validate" element={<DeviceValidation />} />
                <Route path="/settings" element={<SystemSettings />} />
                <Route path="/users" element={<UserManagement />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
