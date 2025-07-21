interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number; // in milliseconds
  blockDuration: number; // in milliseconds
}

interface RateLimitEntry {
  timestamps: number[];
  blocked: boolean;
  blockExpiry?: number;
}

class RateLimitService {
  private limits: Map<string, RateLimitConfig> = new Map();
  private storage: Map<string, RateLimitEntry> = new Map();

  constructor() {
    // Define default rate limits for different operations
    this.limits.set('auth', {
      maxRequests: 5,
      timeWindow: 60000, // 1 minute
      blockDuration: 300000, // 5 minutes
    });

    this.limits.set('api', {
      maxRequests: 100,
      timeWindow: 60000, // 1 minute
      blockDuration: 60000, // 1 minute
    });

    this.limits.set('validation', {
      maxRequests: 10,
      timeWindow: 60000, // 1 minute
      blockDuration: 120000, // 2 minutes
    });

    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), 60000);
  }

  public async checkRateLimit(
    operation: string,
    identifier: string
  ): Promise<boolean> {
    const config = this.limits.get(operation);
    if (!config) return true; // No rate limit configured

    const key = `${operation}:${identifier}`;
    const entry = this.getEntry(key);

    // Check if currently blocked
    if (entry.blocked) {
      if (entry.blockExpiry && entry.blockExpiry <= Date.now()) {
        // Block duration expired, reset entry
        this.resetEntry(key);
      } else {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    }

    // Remove timestamps outside the time window
    const now = Date.now();
    entry.timestamps = entry.timestamps.filter(
      (timestamp) => now - timestamp < config.timeWindow
    );

    // Check if rate limit exceeded
    if (entry.timestamps.length >= config.maxRequests) {
      this.blockEntry(key, config.blockDuration);
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Add current timestamp
    entry.timestamps.push(now);
    this.storage.set(key, entry);

    return true;
  }

  private getEntry(key: string): RateLimitEntry {
    return (
      this.storage.get(key) || {
        timestamps: [],
        blocked: false,
      }
    );
  }

  private blockEntry(key: string, duration: number): void {
    this.storage.set(key, {
      timestamps: [],
      blocked: true,
      blockExpiry: Date.now() + duration,
    });
  }

  private resetEntry(key: string): void {
    this.storage.set(key, {
      timestamps: [],
      blocked: false,
    });
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (entry.blockExpiry && entry.blockExpiry <= now) {
        this.storage.delete(key);
      }
    }
  }

  public updateLimits(operation: string, config: RateLimitConfig): void {
    this.limits.set(operation, config);
  }
}

export const rateLimitService = new RateLimitService();
