import { Router } from 'express';
import { getTrailsWeather, getTrailWeather, getWeatherAlerts } from '../controllers/weatherController';

const router = Router();

// 獲取所有步道的天氣預報
router.get('/trails', getTrailsWeather);

// 獲取特定步道的天氣預報
router.get('/trails/:id', getTrailWeather);

// 獲取天氣警報
router.get('/alerts', getWeatherAlerts);

export default router;

