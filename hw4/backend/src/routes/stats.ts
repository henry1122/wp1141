import { Router } from 'express';
import { getUserStats, getPublicStats, getTrailStats } from '../controllers/statsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 獲取用戶統計數據（需要認證）
router.get('/user', authenticateToken, getUserStats);

// 獲取公開統計數據
router.get('/public', getPublicStats);

// 獲取特定步道的統計數據
router.get('/trail/:id', getTrailStats);

export default router;

