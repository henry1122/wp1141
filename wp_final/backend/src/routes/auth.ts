import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../db';
import { JWT_SECRET } from '../config/env';
import { validateBody } from '../middleware/validate';
import { AppError } from '../utils/AppError';
import { authRequired, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

function generateToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

function setAuthCookie(res: any, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax'
  });
}

router.post('/register', validateBody(registerSchema), (req, res) => {
  const { email, password, name } = req.body as z.infer<typeof registerSchema>;

  const existing = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(email) as { id: number } | undefined;
  if (existing) {
    throw new AppError(409, 'Email already registered');
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const result = db
    .prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)')
    .run(email, name ?? null, passwordHash);

  const userId = Number(result.lastInsertRowid);
  const token = generateToken(userId);
  setAuthCookie(res, token);

  return res.status(201).json({
    id: userId,
    email,
    name: name ?? null
  });
});

router.post('/login', validateBody(loginSchema), (req, res) => {
  const { email, password } = req.body as z.infer<typeof loginSchema>;

  const user = db
    .prepare(
      'SELECT id, email, name, password_hash FROM users WHERE email = ?'
    )
    .get(email) as
    | { id: number; email: string; name: string | null; password_hash: string }
    | undefined;

  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) {
    throw new AppError(401, 'Invalid email or password');
  }

  const token = generateToken(user.id);
  setAuthCookie(res, token);

  return res.json({
    id: user.id,
    email: user.email,
    name: user.name
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(204).send();
});

router.get('/me', authRequired, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const user = db
    .prepare('SELECT id, email, name, created_at FROM users WHERE id = ?')
    .get(userId) as
    | { id: number; email: string; name: string | null; created_at: string }
    | undefined;

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return res.json(user);
});

export default router;



