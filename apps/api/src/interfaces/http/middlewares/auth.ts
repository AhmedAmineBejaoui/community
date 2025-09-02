import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../../config';
import { JwtPayload } from '@neighborhood-hub/types';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication token required',
      },
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.nextAuthSecret) as JwtPayload;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Invalid or expired token',
      },
    });
  }
}

export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.nextAuthSecret) as JwtPayload;
      (req as AuthenticatedRequest).user = decoded;
    } catch (error) {
      // Token is invalid, but we continue without authentication
    }
  }

  next();
}
