import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Rating,
  useTheme,
  Paper,
  Avatar,
  LinearProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
} from '@mui/material';
import {
  Hiking,
  LocationOn,
  Schedule,
  Star,
  Add,
  People,
  Cloud,
  WbSunny,
  Thunderstorm,
  Settings,
  Close,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { trailsAPI, statsAPI, weatherAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import FadeIn from '../components/animations/FadeIn';
import StaggeredList from '../components/animations/StaggeredList';
import LoadingSpinner from '../components/animations/LoadingSpinner';

const HomeWithSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  // 設定狀態
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [language, setLanguage] = useState('zh-TW');
  const [backgroundColor, setBackgroundColor] = useState('green');

  // 應用字體大小
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // 應用高對比度
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // 應用縮放
  useEffect(() => {
    document.documentElement.style.zoom = `${zoom}%`;
  }, [zoom]);

  // 應用語言
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // 應用背景顏色
  useEffect(() => {
    document.body.className = document.body.className.replace(/bg-color-\w+/g, '');
    document.body.classList.add(`bg-color-${backgroundColor}`);
  }, [backgroundColor]);

  const resetSettings = () => {
    setFontSize(16);
    setHighContrast(false);
    setZoom(100);
    setLanguage('zh-TW');
    setBackgroundColor('green');
  };

  const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
    setFontSize(newValue as number);
  };

  const handleZoomChange = (event: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  // 獲取熱門路線
  const { data: popularTrails, isLoading: trailsLoading } = useQuery(
    'popular-trails',
    () => trailsAPI.getTrails({ limit: 3, sort: 'rating' }),
    {
      select: (data) => data.trails,
    }
  );

  // 獲取統計數據
  const { data: stats, isLoading: statsLoading } = useQuery(
    'home-stats',
    () => statsAPI.getPublicStats()
  );

  // 獲取天氣數據
  const { data: weather, isLoading: weatherLoading } = useQuery(
    'home-weather',
    () => weatherAPI.getCurrentWeather('Taipei')
  );

  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <WbSunny />;
      case 'rainy':
      case 'rain':
        return <Thunderstorm />;
      default:
        return <Cloud />;
    }
  };

  const getWeatherColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return '#ff9800';
      case 'rainy':
      case 'rain':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '初級':
        return 'success';
      case '中級':
        return 'warning';
      case '高級':
        return 'error';
      case '專家':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return language === 'en' ? 
      (difficulty === '初級' ? 'Beginner' :
       difficulty === '中級' ? 'Intermediate' :
       difficulty === '高級' ? 'Advanced' :
       difficulty === '專家' ? 'Expert' : difficulty) : difficulty;
  };

  const getText = (key: string) => {
    const texts = {
      'zh-TW': {
        welcome: '歡迎來到健行路線記錄',
        subtitle: '探索台灣最美麗的健行路線，記錄您的每一步',
        popularTrails: '熱門路線',
        viewAll: '查看全部',
        stats: '統計數據',
        totalTrails: '總路線數',
        totalUsers: '用戶數量',
        coveredCities: '涵蓋縣市數',
        weather: '天氣資訊',
        temperature: '溫度',
        condition: '天氣狀況',
        humidity: '濕度',
        windSpeed: '風速',
        createTrail: '創建路線',
        exploreTrails: '探索路線',
        achievements: '成就系統',
        weatherInfo: '天氣資訊',
        statsAnalysis: '統計分析',
        viewDetails: '查看詳情',
        hours: '小時',
        km: '公里',
        meters: '公尺',
        settings: '設定',
        fontSize: '字體大小',
        zoom: '縮放',
        highContrast: '高對比度模式',
        language: '語言',
        backgroundColor: '背景顏色',
        reset: '重置設定',
        close: '關閉'
      },
      'en': {
        welcome: 'Welcome to Hiking Trail Records',
        subtitle: 'Explore Taiwan\'s most beautiful hiking trails and record every step',
        popularTrails: 'Popular Trails',
        viewAll: 'View All',
        stats: 'Statistics',
        totalTrails: 'Total Trails',
        totalUsers: 'Users',
        coveredCities: 'Covered Cities',
        weather: 'Weather Info',
        temperature: 'Temperature',
        condition: 'Condition',
        humidity: 'Humidity',
        windSpeed: 'Wind Speed',
        createTrail: 'Create Trail',
        exploreTrails: 'Explore Trails',
        achievements: 'Achievements',
        weatherInfo: 'Weather Info',
        statsAnalysis: 'Statistics',
        viewDetails: 'View Details',
        hours: 'hours',
        km: 'km',
        meters: 'm',
        settings: 'Settings',
        fontSize: 'Font Size',
        zoom: 'Zoom',
        highContrast: 'High Contrast Mode',
        language: 'Language',
        backgroundColor: 'Background Color',
        reset: 'Reset Settings',
        close: 'Close'
      }
    };
    return texts[language as keyof typeof texts]?.[key as keyof typeof texts['zh-TW']] || key;
  };

  if (trailsLoading || statsLoading || weatherLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* 背景圖片 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(./d18260cc-a801-4b68-b2c9-b73e81b94d58.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3,
          zIndex: -1,
        }}
      />

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* 標題區域 */}
        <FadeIn direction="up" delay={0}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              {getText('welcome')}
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              {getText('subtitle')}
            </Typography>
            
            {/* 快速操作按鈕 */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => navigate('/create-trail')}
                sx={{ 
                  background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1b5e20, #388e3c)',
                  }
                }}
              >
                {getText('createTrail')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Hiking />}
                onClick={() => navigate('/trails')}
                sx={{ 
                  borderColor: '#2e7d32',
                  color: '#2e7d32',
                  '&:hover': {
                    borderColor: '#1b5e20',
                    backgroundColor: 'rgba(46, 125, 50, 0.04)',
                  }
                }}
              >
                {getText('exploreTrails')}
              </Button>
            </Box>
          </Box>
        </FadeIn>

        {/* 統計卡片 */}
        <FadeIn direction="up" delay={200}>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                    <Hiking />
                  </Avatar>
                  <Typography variant="h4" color="primary.main" gutterBottom>
                    {stats?.totalTrails || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getText('totalTrails')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                    <People />
                  </Avatar>
                  <Typography variant="h4" color="secondary.main" gutterBottom>
                    {stats?.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getText('totalUsers')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                    <LocationOn />
                  </Avatar>
                  <Typography variant="h4" color="warning.main" gutterBottom>
                    {stats?.regionDistribution?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getText('coveredCities')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: getWeatherColor(weather?.condition), mx: 'auto', mb: 2 }}>
                    {getWeatherIcon(weather?.condition)}
                  </Avatar>
                  <Typography variant="h4" color="text.primary" gutterBottom>
                    {weather?.temperature}°C
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getText('weather')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </FadeIn>

        {/* 熱門路線 */}
        <FadeIn direction="up" delay={400}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {getText('popularTrails')}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/trails')}
                sx={{ 
                  borderColor: '#2e7d32',
                  color: '#2e7d32',
                  '&:hover': {
                    borderColor: '#1b5e20',
                    backgroundColor: 'rgba(46, 125, 50, 0.04)',
                  }
                }}
              >
                {getText('viewAll')}
              </Button>
            </Box>

            <Grid container spacing={3}>
              {popularTrails?.map((trail: any, index: number) => (
                <Grid item xs={12} md={4} key={trail.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {trail.name}
                        </Typography>
                        <Chip
                          label={getDifficultyLabel(trail.difficulty)}
                          color={getDifficultyColor(trail.difficulty)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
                        {trail.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {trail.start_location}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {trail.distance} {getText('km')} • {trail.duration} {getText('hours')}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating value={trail.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {trail.rating} ({trail.review_count} {getText('reviews')})
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {trail.tags?.slice(0, 3).map((tag: string, tagIndex: number) => (
                          <Chip
                            key={tagIndex}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ))}
                        {trail.tags?.length > 3 && (
                          <Chip
                            label={`+${trail.tags.length - 3}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        )}
                      </Box>
                    </CardContent>
                    
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => navigate(`/trails/${trail.id}`)}
                        sx={{ 
                          color: '#2e7d32',
                          '&:hover': {
                            backgroundColor: 'rgba(46, 125, 50, 0.04)',
                          }
                        }}
                      >
                        {getText('viewDetails')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </FadeIn>

        {/* 設定按鈕 */}
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <Button
            variant="contained"
            startIcon={<Settings />}
            onClick={() => setSettingsOpen(true)}
            sx={{
              background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1b5e20, #388e3c)',
              },
              borderRadius: '25px',
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)',
            }}
          >
            {getText('settings')}
          </Button>
        </Box>
      </Container>

      {/* 設定抽屜 */}
      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 350,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              {getText('settings')}
            </Typography>
            <IconButton onClick={() => setSettingsOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <List>
            {/* 字體大小 */}
            <ListItem>
              <ListItemIcon>
                <Typography variant="body2">{getText('fontSize')}: {fontSize}px</Typography>
              </ListItemIcon>
            </ListItem>
            <ListItem>
              <Slider
                value={fontSize}
                onChange={handleFontSizeChange}
                min={12}
                max={24}
                step={1}
                marks={[
                  { value: 12, label: '12px' },
                  { value: 16, label: '16px' },
                  { value: 20, label: '20px' },
                  { value: 24, label: '24px' },
                ]}
                valueLabelDisplay="auto"
              />
            </ListItem>

            <Divider sx={{ my: 2 }} />

            {/* 縮放 */}
            <ListItem>
              <ListItemIcon>
                <Typography variant="body2">{getText('zoom')}: {zoom}%</Typography>
              </ListItemIcon>
            </ListItem>
            <ListItem>
              <Slider
                value={zoom}
                onChange={handleZoomChange}
                min={50}
                max={200}
                step={10}
                marks={[
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' },
                  { value: 150, label: '150%' },
                  { value: 200, label: '200%' },
                ]}
                valueLabelDisplay="auto"
              />
            </ListItem>

            <Divider sx={{ my: 2 }} />

            {/* 高對比度 */}
            <ListItem>
              <FormControlLabel
                control={
                  <Switch
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                  />
                }
                label={getText('highContrast')}
              />
            </ListItem>

            <Divider sx={{ my: 2 }} />

            {/* 語言 */}
            <ListItem>
              <FormControl fullWidth>
                <InputLabel>{getText('language')}</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label={getText('language')}
                >
                  <MenuItem value="zh-TW">中文</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </ListItem>

            <Divider sx={{ my: 2 }} />

            {/* 背景顏色 */}
            <ListItem>
              <FormControl fullWidth>
                <InputLabel>{getText('backgroundColor')}</InputLabel>
                <Select
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  label={getText('backgroundColor')}
                >
                  <MenuItem value="green">綠色</MenuItem>
                  <MenuItem value="blue">藍色</MenuItem>
                  <MenuItem value="black">黑色</MenuItem>
                  <MenuItem value="red">紅色</MenuItem>
                  <MenuItem value="purple">紫色</MenuItem>
                </Select>
              </FormControl>
            </ListItem>

            <Divider sx={{ my: 2 }} />

            {/* 重置按鈕 */}
            <ListItem>
              <Button
                variant="outlined"
                onClick={resetSettings}
                fullWidth
                sx={{ 
                  borderColor: '#2e7d32',
                  color: '#2e7d32',
                  '&:hover': {
                    borderColor: '#1b5e20',
                    backgroundColor: 'rgba(46, 125, 50, 0.04)',
                  }
                }}
              >
                {getText('reset')}
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default HomeWithSettings;
