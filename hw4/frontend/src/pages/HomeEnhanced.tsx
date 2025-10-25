import React from 'react';
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
} from '@mui/material';
import {
  Hiking,
  LocationOn,
  Schedule,
  TrendingUp,
  Star,
  Add,
  Speed,
  FitnessCenter,
  Terrain,
  People,
  Timeline,
  Cloud,
  EmojiEvents,
  WbSunny,
  Thunderstorm,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { trailsAPI, statsAPI, weatherAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import FadeIn from '../components/animations/FadeIn';
import StaggeredList from '../components/animations/StaggeredList';
import LoadingSpinner from '../components/animations/LoadingSpinner';

const HomeEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  // 獲取熱門路線
  const { data: popularTrails, isLoading: trailsLoading } = useQuery(
    'popular-trails',
    () => trailsAPI.getTrails({ sort_by: 'rating', sort_order: 'desc', limit: 6 }),
    {
      select: (data) => data.trails,
    }
  );

  // 獲取公開統計
  const { data: publicStats, isLoading: statsLoading } = useQuery(
    'public-stats',
    () => statsAPI.getPublicStats().then(res => res.data.data),
  );

  // 獲取天氣警報
  const { data: weatherAlerts, isLoading: alertsLoading } = useQuery(
    'weather-alerts',
    () => weatherAPI.getWeatherAlerts().then(res => res.data.data),
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      case 'expert': return 'error';
      default: return 'default';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '簡單';
      case 'medium': return '中等';
      case 'hard': return '困難';
      case 'expert': return '專家';
      default: return '未知';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Speed sx={{ fontSize: 16 }} />;
      case 'medium': return <FitnessCenter sx={{ fontSize: 16 }} />;
      case 'hard': return <Terrain sx={{ fontSize: 16 }} />;
      case 'expert': return <Star sx={{ fontSize: 16 }} />;
      default: return <Speed sx={{ fontSize: 16 }} />;
    }
  };

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'warning': return <Thunderstorm sx={{ color: 'warning.main' }} />;
      case 'info': return <Cloud sx={{ color: 'info.main' }} />;
      default: return <WbSunny sx={{ color: 'success.main' }} />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小時${mins > 0 ? `${mins}分鐘` : ''}`;
    }
    return `${mins}分鐘`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 歡迎區塊 */}
      <FadeIn direction="up">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            台灣健行路線
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            探索台灣最美的健行路線，記錄你的健行足跡
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/trails')}
              sx={{ borderRadius: 2 }}
            >
              瀏覽路線
            </Button>
            {user && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<Add />}
                onClick={() => navigate('/create-trail')}
                sx={{ borderRadius: 2 }}
              >
                建立路線
              </Button>
            )}
          </Box>
        </Box>
      </FadeIn>

      {/* 統計概覽 */}
      <FadeIn direction="up" delay={200}>
        <Paper sx={{ p: 3, mb: 6 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            社群統計
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                  <Hiking sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h4" color="primary.main">
                  {publicStats?.totalTrails || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  總路線數
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                  <People sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h4" color="secondary.main">
                  {publicStats?.totalUsers || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  註冊用戶
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                  <Star sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h4" color="success.main">
                  {publicStats?.popularTrails?.[0]?.rating?.toFixed(1) || '0.0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  最高評分
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                  <LocationOn sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h4" color="warning.main">
                  {publicStats?.regionDistribution?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  涵蓋地區
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </FadeIn>

      {/* 天氣警報 */}
      {weatherAlerts && weatherAlerts.length > 0 && (
        <FadeIn direction="up" delay={300}>
          <Paper sx={{ p: 3, mb: 6, bgcolor: 'warning.light' }}>
            <Typography variant="h5" gutterBottom>
              天氣警報
            </Typography>
            {weatherAlerts.map((alert: any, index: number) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {getWeatherIcon(alert.type)}
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6">
                    {alert.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {alert.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    影響路線: {alert.affectedTrails.join(', ')}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </FadeIn>
      )}

      {/* 熱門路線 */}
      <FadeIn direction="up" delay={400}>
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4">
              熱門路線
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/trails')}
              sx={{ borderRadius: 2 }}
            >
              查看全部
            </Button>
          </Box>

          {trailsLoading ? (
            <LoadingSpinner message="正在載入熱門路線..." />
          ) : (
            <StaggeredList>
              <Grid container spacing={3}>
                {popularTrails?.map((trail: any, index: number) => (
                  <Grid item xs={12} sm={6} md={4} key={trail.id}>
                    <FadeIn direction="up" delay={index * 100}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          {/* 路線標題和難度 */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" component="h2" sx={{ flexGrow: 1, mr: 1 }}>
                              {trail.name}
                            </Typography>
                            <Chip
                              icon={getDifficultyIcon(trail.difficulty)}
                              label={getDifficultyLabel(trail.difficulty)}
                              color={getDifficultyColor(trail.difficulty) as any}
                              size="small"
                            />
                          </Box>

                          {/* 路線描述 */}
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {trail.description}
                          </Typography>

                          {/* 路線資訊 */}
                          <Grid container spacing={1} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  起點
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                {trail.start_location}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  距離
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                {trail.distance} 公里
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  時間
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                {formatDuration(trail.duration)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TrendingUp sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  爬升
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                {trail.elevation_gain} 公尺
                              </Typography>
                            </Grid>
                          </Grid>

                          {/* 評分 */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating value={trail.rating} readOnly precision={0.1} size="small" />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {trail.rating} ({trail.review_count})
                            </Typography>
                          </Box>

                          {/* 標籤 */}
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {trail.tags?.slice(0, 3).map((tag: string, tagIndex: number) => (
                              <Chip key={tagIndex} label={tag} size="small" variant="outlined" />
                            ))}
                            {trail.tags?.length > 3 && (
                              <Chip label={`+${trail.tags.length - 3}`} size="small" variant="outlined" />
                            )}
                          </Box>
                        </CardContent>

                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => navigate(`/trails/${trail.id}`)}
                            sx={{ borderRadius: 2 }}
                          >
                            查看詳情
                          </Button>
                        </CardActions>
                      </Card>
                    </FadeIn>
                  </Grid>
                ))}
              </Grid>
            </StaggeredList>
          )}
        </Box>
      </FadeIn>

      {/* 功能導航 */}
      <FadeIn direction="up" delay={500}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            探索更多功能
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => navigate('/stats')}
              >
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                  <Timeline sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  統計分析
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  查看社群統計和個人數據
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => navigate('/weather')}
              >
                <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                  <Cloud sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  天氣資訊
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  查看步道天氣預報
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => navigate('/achievements')}
              >
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                  <EmojiEvents sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  成就系統
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  解鎖健行成就徽章
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => navigate('/trails')}
              >
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                  <Hiking sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  所有路線
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  瀏覽完整的路線資料庫
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </FadeIn>
    </Container>
  );
};

export default HomeEnhanced;

