import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile,
  registerValidation,
  loginValidation 
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidation, register);

// POST /api/auth/login
router.post('/login', loginValidation, login);

// GET /api/auth/profile
router.get('/profile', authenticateToken, getProfile);

export { router as authRoutes };


