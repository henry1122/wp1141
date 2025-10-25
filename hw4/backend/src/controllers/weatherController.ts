import { Request, Response } from 'express';
import { dbGet, dbAll } from '../utils/database';

interface WeatherForecast {
  date: string;
  temperature: {
    high: number;
    low: number;
  };
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  uvIndex: number;
}

interface TrailWeather {
  trailId: number;
  trailName: string;
  location: string;
  elevation: number;
  forecast: WeatherForecast[];
}

// 模擬天氣數據生成器
const generateWeatherData = (trailId: number, elevation: number, location: string): WeatherForecast[] => {
  const forecasts: WeatherForecast[] = [];
  const conditions = ['sunny', 'cloudy', 'partly_cloudy', 'rainy', 'stormy'];
  
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // 根據海拔高度調整溫度
    const baseTemp = 25 - (elevation / 100) * 0.6;
    const tempVariation = Math.random() * 8 - 4;
    const high = Math.round(baseTemp + tempVariation);
    const low = Math.round(high - 8 - Math.random() * 5);
    
    // 根據海拔高度調整濕度
    const baseHumidity = 70 - (elevation / 100) * 0.3;
    const humidity = Math.round(baseHumidity + Math.random() * 20 - 10);
    
    // 根據海拔高度調整風速
    const baseWindSpeed = 10 + (elevation / 100) * 0.5;
    const windSpeed = Math.round(baseWindSpeed + Math.random() * 10 - 5);
    
    // 根據海拔高度調整降水機率
    const basePrecipitation = 20 + (elevation / 100) * 0.2;
    const precipitation = Math.round(basePrecipitation + Math.random() * 30 - 15);
    
    // 根據海拔高度調整UV指數
    const baseUVIndex = 6 + (elevation / 100) * 0.1;
    const uvIndex = Math.round(baseUVIndex + Math.random() * 2 - 1);
    
    forecasts.push({
      date: date.toISOString().split('T')[0],
      temperature: { high, low },
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: Math.max(0, Math.min(100, humidity)),
      windSpeed: Math.max(0, windSpeed),
      precipitation: Math.max(0, Math.min(100, precipitation)),
      uvIndex: Math.max(1, Math.min(11, uvIndex))
    });
  }
  
  return forecasts;
};

// 獲取所有步道的天氣預報
export const getTrailsWeather = async (req: Request, res: Response) => {
  try {
    const trails = await dbAll(`
      SELECT id, name, start_location, elevation_gain 
      FROM trails 
      ORDER BY name
    `);

    const trailsWeather: TrailWeather[] = trails.map((trail: any) => ({
      trailId: trail.id,
      trailName: trail.name,
      location: trail.start_location,
      elevation: trail.elevation_gain,
      forecast: generateWeatherData(trail.id, trail.elevation_gain, trail.start_location)
    }));

    res.json({
      success: true,
      data: trailsWeather
    });
  } catch (error) {
    console.error('Error fetching trails weather:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trails weather data'
    });
  }
};

// 獲取特定步道的天氣預報
export const getTrailWeather = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const trail = await dbGet(`
      SELECT id, name, start_location, elevation_gain 
      FROM trails 
      WHERE id = ?
    `, [id]);

    if (!trail) {
      return res.status(404).json({
        success: false,
        message: 'Trail not found'
      });
    }

    const trailWeather: TrailWeather = {
      trailId: trail.id,
      trailName: trail.name,
      location: trail.start_location,
      elevation: trail.elevation_gain,
      forecast: generateWeatherData(trail.id, trail.elevation_gain, trail.start_location)
    };

    res.json({
      success: true,
      data: trailWeather
    });
  } catch (error) {
    console.error('Error fetching trail weather:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trail weather data'
    });
  }
};

// 獲取天氣警報
export const getWeatherAlerts = async (req: Request, res: Response) => {
  try {
    // 模擬天氣警報數據
    const alerts = [
      {
        id: 1,
        type: 'warning',
        title: '強風警報',
        message: '山區風速可能達到強風等級，請注意安全',
        severity: 'medium',
        affectedTrails: ['玉山主峰', '雪山主峰', '南湖大山'],
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        type: 'info',
        title: '低溫特報',
        message: '高山地區夜間溫度可能降至0度以下，請注意保暖',
        severity: 'low',
        affectedTrails: ['合歡山主峰', '奇萊南峰', '嘉明湖'],
        validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      }
    ];

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather alerts'
    });
  }
};

