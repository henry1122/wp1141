import { Router } from 'express';
import {
  getTrails,
  getTrailById,
  createTrail,
  updateTrail,
  deleteTrail,
  createTrailValidation,
  updateTrailValidation
} from '../controllers/trailController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

// GET /api/trails - Get all trails (public, with optional auth for personalized results)
router.get('/', optionalAuth, getTrails);

// GET /api/trails/:id - Get specific trail (public)
router.get('/:id', getTrailById);

// POST /api/trails - Create new trail (public)
router.post('/', optionalAuth, createTrailValidation, createTrail);

// PUT /api/trails/:id - Update trail (authenticated, owner only)
router.put('/:id', authenticateToken, updateTrailValidation, updateTrail);

// DELETE /api/trails/:id - Delete trail (authenticated, owner only)
router.delete('/:id', authenticateToken, deleteTrail);

export { router as trailRoutes };


