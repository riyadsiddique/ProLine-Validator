import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { hasPermission } from '../../utils/permissions';
import UnauthorizedPage from '../../pages/UnauthorizedPage';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermissions: string[];
  redirectTo?: string;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermissions,
  redirectTo = '/unauthorized',
}) => {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission(user?.permissions || [], requiredPermissions)) {
    return redirectTo === '/unauthorized' ? (
      <UnauthorizedPage requiredPermissions={requiredPermissions} />
    ) : (
      <Navigate to={redirectTo} replace />
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
