import winston from 'winston';
import { Request } from 'express';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export class LoggingService {
  static logRequest(req: Request, duration: number) {
    logger.info({
      method: req.method,
      path: req.path,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      userId: req.user?.userId,
    });
  }

  static logError(error: Error, req: Request) {
    logger.error({
      error: {
        message: error.message,
        stack: error.stack,
      },
      method: req.method,
      path: req.path,
      userId: req.user?.userId,
    });
  }
}
