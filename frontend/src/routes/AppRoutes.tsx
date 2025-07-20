import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/Auth/LoginPage';
import Dashboard from '../pages/Dashboard';
import DeviceList from '../pages/Devices/DeviceList';
import DeviceDetails from '../pages/Devices/DeviceDetails';
import CodeGenerator from '../pages/DeviceCodes/CodeGenerator';
import PaymentHistory from '../pages/Payments/PaymentHistory';
import PaymentSchedule from '../pages/Payments/PaymentSchedule';
import AdminList from '../pages/Admin/AdminList';
import UnauthorizedPage from '../pages/Auth/UnauthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="devices">
          <Route index element={<DeviceList />} />
          <Route path=":id" element={<DeviceDetails />} />
        </Route>
        
        <Route path="device-codes" element={<CodeGenerator />} />
        
        <Route path="payments">
          <Route index element={<PaymentHistory />} />
          <Route path="schedule" element={<PaymentSchedule />} />
        </Route>
        
        <Route path="admin" element={
          <ProtectedRoute requiredRole="super_admin">
            <AdminList />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
