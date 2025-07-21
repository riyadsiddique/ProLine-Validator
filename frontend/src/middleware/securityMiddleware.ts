import { Middleware } from 'redux';
import { securityAuditService } from '../services/securityAuditService';
import { sessionService } from '../services/sessionService';

export const securityMiddleware: Middleware = (store) => (next) => (action) => {
  // Pre-action security checks
  const prevState = store.getState();
  
  // Process the action
  const result = next(action);
  
  // Post-action security auditing
  const newState = store.getState();

  // Audit sensitive actions
  if (action.type.startsWith('auth/') || 
      action.type.startsWith('admin/') || 
      action.type.startsWith('settings/')) {
    securityAuditService.logEvent(action.type, {
      action,
      timestamp: new Date().toISOString(),
    });
  }

  // Check for security-relevant state changes
  if (prevState.auth.user !== newState.auth.user) {
    securityAuditService.logEvent('USER_STATE_CHANGE', {
      previous: prevState.auth.user,
      current: newState.auth.user,
    });
  }

  // Handle auth state changes
  if (action.type === 'auth/login/fulfilled') {
    sessionService.startSession();
  } else if (action.type === 'auth/logout') {
    sessionService.endSession();
  }

  return result;
};
