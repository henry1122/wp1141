import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { AppError } from '../utils/AppError';

export interface AuthPayload {
  userId: number;
}

export interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export function authRequired(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;
  const tokenFromCookie = (req as any).cookies?.token as string | undefined;

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    throw new AppError(401, 'Authentication required');
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = { id: payload.userId };
    next();
  } catch {
    throw new AppError(401, 'Invalid or expired token');
  }
}



