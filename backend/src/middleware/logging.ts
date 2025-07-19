import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '../services/LoggingService';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    LoggingService.logRequest(req, duration);
  });

  next();
};
