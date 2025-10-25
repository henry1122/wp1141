import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
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
  IconButton,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Hiking,
  Explore,
  Add,
  TrendingUp,
  LocationOn,
  Schedule,
  Star,
  Favorite,
  Share,
  Cloud,
  WbSunny,
  AcUnit,
  Thunderstorm,
  Terrain,
  Speed,
  FitnessCenter,
  EmojiEvents,
  Timeline,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from 'react-query';
import { trailsAPI } from '../services/api';
import FadeIn from '../components/animations/FadeIn';
import StaggeredList from '../components/animations/StaggeredList';
import LoadingSpinner from '../components/animations/LoadingSpinner';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: 24, condition: 'sunny' });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch featured trails
  const { data: featuredTrails, isLoading } = useQuery(
    'featured-trails',
    () => trailsAPI.getTrails({ limit: 6, sort_by: 'rating', sort_order: 'desc' }),
    {
      select: (data) => data.trails,
    }
  );

  // Fetch user stats if logged in
  const { data: userStats } = useQuery(
    'user-stats',
    () => Promise.resolve({
      totalTrails: 12,
      totalDistance: 45.6,
      achievements: 8,
      level: 5,
    }),
    {
      enabled: !!user,
    }
  );

  const features = [
    {
      icon: <Hiking sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '智能路線規劃',
      description: 'AI 輔助路線推薦，根據你的體能和偏好量身定制',
      color: 'primary',
    },
    {
      icon: <Explore sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'AR 實境導航',
      description: '使用擴增實境技術，讓你在戶外也能輕鬆找到方向',
      color: 'secondary',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      title: '健康數據追蹤',
      description: '記錄心率、卡路里消耗，科學化分析你的健行表現',
      color: 'success',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: '成就系統',
      description: '解鎖各種成就徽章，與朋友分享你的健行里程碑',
      color: 'warning',
    },
  ];

  const weatherIcons = {
    sunny: <WbSunny sx={{ color: '#ff9800' }} />,
    cloudy: <Cloud sx={{ color: '#9e9e9e' }} />,
    rainy: <Thunderstorm sx={{ color: '#2196f3' }} />,
    snowy: <AcUnit sx={{ color: '#00bcd4' }} />,
  };

  const getWeatherIcon = () => weatherIcons[weather.condition as keyof typeof weatherIcons] || weatherIcons.sunny;

  return (
    <Box>
      {/* Hero Section with Parallax Effect */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
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
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <FadeIn direction="up" delay={200}>
            <Typography variant="h2" component="h1" gutterBottom>
              🏔️ 探索台灣最美健行路線
            </Typography>
          </FadeIn>
          <FadeIn direction="up" delay={400}>
            <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
              記錄你的健行足跡，分享精彩路線，與同好一起探索大自然
            </Typography>
          </FadeIn>
          
          {/* Weather and Time Widget */}
          <FadeIn direction="up" delay={600}>
            <Paper
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                px: 3,
                py: 1.5,
                mb: 4,
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
              }}
            >
              {getWeatherIcon()}
              <Typography variant="h6">{weather.temp}°C</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {currentTime.toLocaleTimeString('zh-TW', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
            </Paper>
          </FadeIn>

          <FadeIn direction="up" delay={800}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
                onClick={() => navigate('/trails')}
              >
                <Explore sx={{ mr: 1 }} />
                探索路線
              </Button>
              {user && (
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  onClick={() => navigate('/create-trail')}
                >
                  <Add sx={{ mr: 1 }} />
                  建立路線
                </Button>
              )}
            </Box>
          </FadeIn>
        </Container>
      </Box>

      {/* User Stats Section */}
      {user && userStats && (
        <Box sx={{ bgcolor: 'grey.50', py: 4 }}>
          <Container maxWidth="lg">
            <FadeIn direction="up">
              <Typography variant="h4" textAlign="center" gutterBottom>
                你的健行成就
              </Typography>
            </FadeIn>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={6} md={3}>
                <FadeIn direction="up" delay={200}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <Hiking />
                    </Avatar>
                    <Typography variant="h4" color="primary.main">
                      {userStats.totalTrails}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      完成路線
                    </Typography>
                  </Card>
                </FadeIn>
              </Grid>
              <Grid item xs={6} md={3}>
                <FadeIn direction="up" delay={400}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
                      <Speed />
                    </Avatar>
                    <Typography variant="h4" color="secondary.main">
                      {userStats.totalDistance}km
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      總距離
                    </Typography>
                  </Card>
                </FadeIn>
              </Grid>
              <Grid item xs={6} md={3}>
                <FadeIn direction="up" delay={600}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                      <EmojiEvents />
                    </Avatar>
                    <Typography variant="h4" color="success.main">
                      {userStats.achievements}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      成就徽章
                    </Typography>
                  </Card>
                </FadeIn>
              </Grid>
              <Grid item xs={6} md={3}>
                <FadeIn direction="up" delay={800}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                      <FitnessCenter />
                    </Avatar>
                    <Typography variant="h4" color="warning.main">
                      Lv.{userStats.level}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      健行等級
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      sx={{ mt: 1, borderRadius: 1 }}
                    />
                  </Card>
                </FadeIn>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <FadeIn direction="up">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            🚀 為什麼選擇我們？
          </Typography>
        </FadeIn>
        <FadeIn direction="up" delay={200}>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            我們提供最完整的健行路線記錄和分享平台
          </Typography>
        </FadeIn>

        <StaggeredList delay={200} direction="up">
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${theme.palette[feature.color as keyof typeof theme.palette].main}, ${theme.palette[feature.color as keyof typeof theme.palette].light})`,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </StaggeredList>
      </Container>

      {/* Featured Trails Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <FadeIn direction="up">
            <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
              ⭐ 熱門路線
            </Typography>
          </FadeIn>
          <FadeIn direction="up" delay={200}>
            <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
              看看其他健行愛好者推薦的精彩路線
            </Typography>
          </FadeIn>

          {isLoading ? (
            <LoadingSpinner variant="skeleton" rows={6} message="正在載入精彩路線..." />
          ) : (
            <StaggeredList delay={150} direction="up">
              {featuredTrails?.map((trail) => (
                <Grid item xs={12} sm={6} md={4} key={trail.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${theme.palette.primary.light}10, ${theme.palette.secondary.light}10)`,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                        '&::before': {
                          opacity: 1,
                        },
                      },
                    }}
                    onClick={() => navigate(`/trails/${trail.id}`)}
                  >
                    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" component="h3">
                          {trail.name}
                        </Typography>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          <Favorite />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                        {trail.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {trail.start_location}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {trail.duration} 分鐘 • {trail.distance} 公里
                        </Typography>
                      </Box>

                      {trail.elevation_gain > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Terrain sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            爬升 {trail.elevation_gain} 公尺
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Chip 
                          label={
                            trail.difficulty === 'easy' ? '簡單' :
                            trail.difficulty === 'medium' ? '中等' :
                            trail.difficulty === 'hard' ? '困難' : '專家'
                          }
                          size="small" 
                          color={
                            trail.difficulty === 'easy' ? 'success' :
                            trail.difficulty === 'medium' ? 'warning' :
                            trail.difficulty === 'hard' ? 'error' : 'default'
                          }
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={trail.rating} readOnly size="small" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({trail.review_count})
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          作者: {trail.author_username}
                        </Typography>
                        <IconButton size="small">
                          <Share />
                        </IconButton>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ position: 'relative', zIndex: 1 }}>
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/trails/${trail.id}`)}
                        startIcon={<Explore />}
                      >
                        查看詳情
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </StaggeredList>
          )}

          <FadeIn direction="up" delay={800}>
            <Box textAlign="center" sx={{ mt: 6 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/trails')}
                startIcon={<Explore />}
                sx={{ 
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                }}
              >
                查看更多路線
              </Button>
            </Box>
          </FadeIn>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <FadeIn direction="up">
            <Typography variant="h3" gutterBottom>
              🎯 準備開始你的健行之旅了嗎？
            </Typography>
          </FadeIn>
          <FadeIn direction="up" delay={200}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              加入我們的健行社群，探索更多精彩路線，記錄你的每一步足跡
            </Typography>
          </FadeIn>
          <FadeIn direction="up" delay={400}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {!user ? (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    startIcon={<Hiking />}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    立即註冊
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    登入帳號
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/create-trail')}
                  startIcon={<Add />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  建立我的路線
                </Button>
              )}
            </Box>
          </FadeIn>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

