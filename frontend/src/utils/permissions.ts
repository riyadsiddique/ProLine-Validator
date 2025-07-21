import { Admin } from '../types/admin';

interface PermissionConfig {
  [key: string]: {
    route: string;
    permissions: string[];
    title: string;
    description?: string;
  };
}

export const ROUTES_PERMISSIONS: PermissionConfig = {
  dashboard: {
    route: '/',
    permissions: ['dashboard.view'],
    title: 'Dashboard',
    description: 'View system dashboard and analytics',
  },
  deviceList: {
    route: '/devices',
    permissions: ['device.view'],
    title: 'Device Management',
    description: 'View and manage devices',
  },
  deviceValidation: {
    route: '/validate',
    permissions: ['validation.run', 'validation.view'],
    title: 'Device Validation',
    description: 'Run and view device validations',
  },
  adminManagement: {
    route: '/admin',
    permissions: ['user.view', 'user.create', 'user.edit'],
    title: 'Admin Management',
    description: 'Manage admin users',
  },
  activityLogs: {
    route: '/admin/logs',
    permissions: ['logs.view'],
    title: 'Activity Logs',
    description: 'View system activity logs',
  },
  settings: {
    route: '/settings',
    permissions: ['settings.view'],
    title: 'System Settings',
    description: 'Configure system settings',
  },
};

export const hasPermission = (
  userPermissions: string[],
  requiredPermissions: string[]
): boolean => {
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
};

export const getAllowedRoutes = (userPermissions: string[]): string[] => {
  return Object.values(ROUTES_PERMISSIONS)
    .filter((config) => hasPermission(userPermissions, config.permissions))
    .map((config) => config.route);
};

export const checkRoutePermission = (
  route: string,
  userPermissions: string[]
): boolean => {
  const routeConfig = Object.values(ROUTES_PERMISSIONS).find(
    (config) => config.route === route
  );
  return routeConfig
    ? hasPermission(userPermissions, routeConfig.permissions)
    : false;
};
