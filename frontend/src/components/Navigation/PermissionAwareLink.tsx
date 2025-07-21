import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { hasPermission } from '../../utils/permissions';

interface PermissionAwareLinkProps {
  to: string;
  requiredPermissions: string[];
  children: React.ReactNode;
  [key: string]: any;
}

const PermissionAwareLink: React.FC<PermissionAwareLinkProps> = ({
  to,
  requiredPermissions,
  children,
  ...props
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!hasPermission(user?.permissions || [], requiredPermissions)) {
    return null;
  }

  return (
    <RouterLink to={to} {...props}>
      {children}
    </RouterLink>
  );
};

export default PermissionAwareLink;
