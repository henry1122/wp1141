import { Request, Response } from 'express';
import { dbGet, dbAll } from '../utils/database';
import { authenticateToken } from '../middleware/auth';

// 獲取用戶統計數據
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // 獲取用戶創建的路線數量
    const trailCount = await dbGet(`
      SELECT COUNT(*) as count 
      FROM trails 
      WHERE user_id = ?
    `, [userId]);

    // 獲取用戶的總距離
    const totalDistance = await dbGet(`
      SELECT SUM(distance) as total 
      FROM trails 
      WHERE user_id = ?
    `, [userId]);

    // 獲取用戶的總時間
    const totalTime = await dbGet(`
      SELECT SUM(duration) as total 
      FROM trails 
      WHERE user_id = ?
    `, [userId]);

    // 獲取用戶的平均評分
    const avgRating = await dbGet(`
      SELECT AVG(rating) as average 
      FROM trails 
      WHERE user_id = ?
    `, [userId]);

    // 獲取用戶的難度分布
    const difficultyStats = await dbAll(`
      SELECT difficulty, COUNT(*) as count 
      FROM trails 
      WHERE user_id = ? 
      GROUP BY difficulty
    `, [userId]);

    // 獲取用戶的月度統計
    const monthlyStats = await dbAll(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as trail_count,
        SUM(distance) as total_distance,
        SUM(duration) as total_duration
      FROM trails 
      WHERE user_id = ? 
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
      LIMIT 12
    `, [userId]);

    res.json({
      success: true,
      data: {
        trailCount: trailCount?.count || 0,
        totalDistance: totalDistance?.total || 0,
        totalTime: totalTime?.total || 0,
        avgRating: avgRating?.average || 0,
        difficultyStats,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
};

// 獲取所有用戶的公開統計數據
export const getPublicStats = async (req: Request, res: Response) => {
  try {
    // 獲取總路線數量
    const totalTrails = await dbGet(`
      SELECT COUNT(*) as count 
      FROM trails
    `);

    // 獲取總用戶數量
    const totalUsers = await dbGet(`
      SELECT COUNT(*) as count 
      FROM users
    `);

    // 獲取最受歡迎的路線
    const popularTrails = await dbAll(`
      SELECT name, rating, review_count, difficulty
      FROM trails 
      ORDER BY rating DESC, review_count DESC
      LIMIT 10
    `);

    // 獲取難度分布
    const difficultyDistribution = await dbAll(`
      SELECT difficulty, COUNT(*) as count 
      FROM trails 
      GROUP BY difficulty
    `);

    // 獲取涵蓋縣市數
    const regionDistribution = await dbAll(`
      SELECT DISTINCT
        CASE 
          WHEN start_location LIKE '%台北%' THEN '台北市'
          WHEN start_location LIKE '%新北%' THEN '新北市'
          WHEN start_location LIKE '%桃園%' THEN '桃園市'
          WHEN start_location LIKE '%新竹%' THEN '新竹縣市'
          WHEN start_location LIKE '%苗栗%' THEN '苗栗縣'
          WHEN start_location LIKE '%台中%' THEN '台中市'
          WHEN start_location LIKE '%彰化%' THEN '彰化縣'
          WHEN start_location LIKE '%南投%' THEN '南投縣'
          WHEN start_location LIKE '%雲林%' THEN '雲林縣'
          WHEN start_location LIKE '%嘉義%' THEN '嘉義縣市'
          WHEN start_location LIKE '%台南%' THEN '台南市'
          WHEN start_location LIKE '%高雄%' THEN '高雄市'
          WHEN start_location LIKE '%屏東%' THEN '屏東縣'
          WHEN start_location LIKE '%宜蘭%' THEN '宜蘭縣'
          WHEN start_location LIKE '%花蓮%' THEN '花蓮縣'
          WHEN start_location LIKE '%台東%' THEN '台東縣'
          ELSE '其他'
        END as city
      FROM trails 
      WHERE start_location IS NOT NULL AND start_location != ''
    `);

    // 獲取活躍用戶
    const activeUsers = await dbAll(`
      SELECT 
        u.username,
        COUNT(t.id) as trail_count,
        SUM(t.distance) as total_distance,
        AVG(t.rating) as avg_rating
      FROM users u
      LEFT JOIN trails t ON u.id = t.user_id
      GROUP BY u.id, u.username
      HAVING trail_count > 0
      ORDER BY trail_count DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        totalTrails: totalTrails?.count || 0,
        totalUsers: totalUsers?.count || 0,
        popularTrails,
        difficultyDistribution,
        regionDistribution,
        activeUsers
      }
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public statistics'
    });
  }
};

// 獲取步道統計數據
export const getTrailStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const trail = await dbGet(`
      SELECT * FROM trails WHERE id = ?
    `, [id]);

    if (!trail) {
      return res.status(404).json({
        success: false,
        message: 'Trail not found'
      });
    }

    // 獲取步道的詳細統計
    const stats = {
      trailId: trail.id,
      trailName: trail.name,
      totalViews: Math.floor(Math.random() * 1000) + 100, // 模擬數據
      totalCompletions: Math.floor(Math.random() * 100) + 10, // 模擬數據
      averageCompletionTime: trail.duration,
      difficulty: trail.difficulty,
      rating: trail.rating,
      reviewCount: trail.review_count,
      elevationGain: trail.elevation_gain,
      distance: trail.distance
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching trail stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trail statistics'
    });
  }
};

