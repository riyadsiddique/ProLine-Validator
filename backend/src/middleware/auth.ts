import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const decoded = verify(token, process.env.JWT_SECRET!) as any;
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
