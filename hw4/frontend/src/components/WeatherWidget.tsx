import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import {
  WbSunny,
  Cloud,
  Thunderstorm,
  AcUnit,
  WaterDrop,
  Air,
  Visibility,
} from '@mui/icons-material';
import FadeIn from './animations/FadeIn';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
}

const WeatherWidget: React.FC = () => {
  const theme = useTheme();
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 24,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 6,
    forecast: [
      { day: '今天', high: 26, low: 18, condition: 'sunny' },
      { day: '明天', high: 28, low: 20, condition: 'cloudy' },
      { day: '後天', high: 25, low: 17, condition: 'rainy' },
    ],
  });

  const getWeatherIcon = (condition: string) => {
    const iconProps = { sx: { fontSize: 40 } };
    switch (condition) {
      case 'sunny':
        return <WbSunny {...iconProps} sx={{ color: '#ff9800' }} />;
      case 'cloudy':
        return <Cloud {...iconProps} sx={{ color: '#9e9e9e' }} />;
      case 'rainy':
        return <Thunderstorm {...iconProps} sx={{ color: '#2196f3' }} />;
      case 'snowy':
        return <AcUnit {...iconProps} sx={{ color: '#00bcd4' }} />;
      default:
        return <WbSunny {...iconProps} sx={{ color: '#ff9800' }} />;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'sunny': return '晴朗';
      case 'cloudy': return '多雲';
      case 'rainy': return '雨天';
      case 'snowy': return '雪天';
      default: return '晴朗';
    }
  };

  const getUVIndexColor = (index: number) => {
    if (index <= 2) return 'success';
    if (index <= 5) return 'warning';
    if (index <= 7) return 'error';
    return 'error';
  };

  const getUVIndexText = (index: number) => {
    if (index <= 2) return '低';
    if (index <= 5) return '中等';
    if (index <= 7) return '高';
    return '極高';
  };

  return (
    <FadeIn direction="up" delay={200}>
      <Card
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            animation: 'float 20s ease-in-out infinite',
          },
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          {/* Current Weather */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                {weather.temperature}°C
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {getConditionText(weather.condition)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              {getWeatherIcon(weather.condition)}
            </Box>
          </Box>

          {/* Weather Details */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WaterDrop sx={{ mr: 1, opacity: 0.8 }} />
              <Typography variant="body2">
                濕度 {weather.humidity}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Air sx={{ mr: 1, opacity: 0.8 }} />
              <Typography variant="body2">
                風速 {weather.windSpeed} km/h
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Visibility sx={{ mr: 1, opacity: 0.8 }} />
              <Typography variant="body2">
                能見度 {weather.visibility} km
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WbSunny sx={{ mr: 1, opacity: 0.8 }} />
              <Typography variant="body2">
                UV指數 {weather.uvIndex}
              </Typography>
            </Box>
          </Box>

          {/* UV Index Warning */}
          <Box sx={{ mb: 3 }}>
            <Chip
              label={`UV指數: ${weather.uvIndex} (${getUVIndexText(weather.uvIndex)})`}
              color={getUVIndexColor(weather.uvIndex) as any}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                '& .MuiChip-label': { fontWeight: 'bold' }
              }}
            />
          </Box>

          {/* Forecast */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
              三日預報
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {weather.forecast.map((day, index) => (
                <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    {day.day}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    {getWeatherIcon(day.condition)}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {day.high}°/{day.low}°
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Hiking Recommendation */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.9 }}>
              {weather.condition === 'sunny' && weather.uvIndex > 5
                ? '☀️ 建議做好防曬準備，適合健行'
                : weather.condition === 'rainy'
                ? '🌧️ 建議攜帶雨具，注意安全'
                : '🌤️ 天氣良好，適合戶外活動'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </FadeIn>
  );
};

export default WeatherWidget;

