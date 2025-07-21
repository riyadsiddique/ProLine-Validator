import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { checkRoutePermission } from '../utils/permissions';
import MainLayout from './MainLayout';

const ProtectedLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      const hasAccess = checkRoutePermission(
        location.pathname,
        user.permissions || []
      );
      if (!hasAccess) {
        navigate('/unauthorized');
      }
    }
  }, [location.pathname, user, isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedLayout;
