import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbGet } from '../utils/initDatabase';
import { User } from '../types';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('=== Auth Debug ===');
    console.log('Auth header:', authHeader);
    console.log('Token:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.log('❌ JWT_SECRET not found');
      res.status(500).json({
        success: false,
        error: 'JWT secret not configured'
      });
      return;
    }
    
    console.log('✅ JWT_SECRET found, verifying token...');
    const decoded = jwt.verify(token, jwtSecret) as { userId: number };
    console.log('✅ Token verified, userId:', decoded.userId);
    
    // Get user from database
    console.log('🔍 Looking for user with ID:', decoded.userId);
    const user = await dbGet(
      'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
      [decoded.userId]
    ) as User;

    if (!user) {
      console.log('❌ User not found in database');
      res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      });
      return;
    }

    console.log('✅ User found:', user.username);
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Authentication error'
      });
    }
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.log('❌ JWT_SECRET not found');
      res.status(500).json({
        success: false,
        error: 'JWT secret not configured'
      });
      return;
    }
    
    console.log('✅ JWT_SECRET found, verifying token...');
    const decoded = jwt.verify(token, jwtSecret) as { userId: number };
    console.log('✅ Token verified, userId:', decoded.userId);
      const user = await dbGet(
        'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
        [decoded.userId]
      ) as User;

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
};


