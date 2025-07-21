import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/uiSlice';

interface SessionConfig {
  maxInactivityTime: number;
  sessionTimeout: number;
  warningTime: number;
}

class SessionService {
  private activityTimer: NodeJS.Timeout | null = null;
  private sessionTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private config: SessionConfig = {
    maxInactivityTime: 30 * 60 * 1000, // 30 minutes
    sessionTimeout: 12 * 60 * 60 * 1000, // 12 hours
    warningTime: 5 * 60 * 1000, // 5 minutes before timeout
  };

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, () => this.resetActivityTimer());
    });

    // Handle tab visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.validateSession();
      }
    });
  }

  public startSession() {
    this.resetActivityTimer();
    this.startSessionTimer();
    this.validateSession();
  }

  private resetActivityTimer() {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }

    this.activityTimer = setTimeout(() => {
      this.handleInactivity();
    }, this.config.maxInactivityTime);
  }

  private startSessionTimer() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }

    this.sessionTimer = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.config.sessionTimeout - this.config.warningTime);

    // Set warning timer
    this.warningTimer = setTimeout(() => {
      this.showSessionWarning();
    }, this.config.sessionTimeout - this.config.warningTime);
  }

  private async validateSession() {
    try {
      const response = await fetch('/api/auth/validate-session', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        this.endSession();
      }
    } catch (error) {
      console.error('Session validation failed:', error);
    }
  }

  private handleInactivity() {
    store.dispatch(
      addNotification({
        type: 'warning',
        message: 'You have been inactive. Please log in again.',
      })
    );
    this.endSession();
  }

  private handleSessionTimeout() {
    store.dispatch(
      addNotification({
        type: 'warning',
        message: 'Your session has expired. Please log in again.',
      })
    );
    this.endSession();
  }

  private showSessionWarning() {
    store.dispatch(
      addNotification({
        type: 'warning',
        message: `Your session will expire in ${
          this.config.warningTime / 60000
        } minutes. Save your work and refresh the page to continue.`,
      })
    );
  }

  public endSession() {
    if (this.activityTimer) clearTimeout(this.activityTimer);
    if (this.sessionTimer) clearTimeout(this.sessionTimer);
    if (this.warningTimer) clearTimeout(this.warningTimer);
    
    store.dispatch(logout());
  }

  public updateConfig(newConfig: Partial<SessionConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.startSession(); // Restart timers with new config
  }
}

export const sessionService = new SessionService();
