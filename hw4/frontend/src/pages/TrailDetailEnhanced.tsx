import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Rating,
  Grid,
  Divider,
  useTheme,
  Paper,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  LocationOn,
  Schedule,
  Terrain,
  Star,
  WbSunny,
  Cloud,
  Thunderstorm,
  AcUnit,
  WaterDrop,
  Air,
  Visibility,
  Speed,
  FitnessCenter,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { trailsAPI } from '../services/api';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import FadeIn from '../components/animations/FadeIn';
import LoadingSpinner from '../components/animations/LoadingSpinner';

const TrailDetailEnhanced: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const queryClient = useQueryClient();

  // 獲取步道詳情
  const { data: trail, isLoading: trailLoading } = useQuery(
    ['trail', id],
    () => trailsAPI.getTrailById(Number(id)),
    {
      enabled: !!id,
    }
  );

  // 獲取步道天氣預報
  const { data: weatherData, isLoading: weatherLoading } = useQuery(
    ['trail-weather', id],
    () => api.get(`/weather/trails/${id}`).then(res => res.data.data),
    {
      enabled: !!id,
    }
  );

  // 獲取步道統計
  const { data: statsData, isLoading: statsLoading } = useQuery(
    ['trail-stats', id],
    () => api.get(`/stats/trail/${id}`).then(res => res.data.data),
    {
      enabled: !!id,
    }
  );

  // 刪除步道
  const deleteMutation = useMutation(
    () => trailsAPI.deleteTrail(Number(id)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trails');
        navigate('/trails');
      },
    }
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
      case 'easy': return <Speed sx={{ fontSize: 20 }} />;
      case 'medium': return <FitnessCenter sx={{ fontSize: 20 }} />;
      case 'hard': return <Terrain sx={{ fontSize: 20 }} />;
      case 'expert': return <Star sx={{ fontSize: 20 }} />;
      default: return <Speed sx={{ fontSize: 20 }} />;
    }
  };

  const getWeatherIcon = (condition: string) => {
    const iconProps = { sx: { fontSize: 24 } };
    switch (condition) {
      case 'sunny':
        return <WbSunny {...iconProps} sx={{ color: '#ff9800' }} />;
      case 'cloudy':
        return <Cloud {...iconProps} sx={{ color: '#9e9e9e' }} />;
      case 'partly_cloudy':
        return <Cloud {...iconProps} sx={{ color: '#9e9e9e' }} />;
      case 'rainy':
        return <Thunderstorm {...iconProps} sx={{ color: '#2196f3' }} />;
      case 'stormy':
        return <Thunderstorm {...iconProps} sx={{ color: '#f44336' }} />;
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
      case 'partly_cloudy': return '多雲時晴';
      case 'rainy': return '雨天';
      case 'stormy': return '雷雨';
      case 'snowy': return '雪天';
      default: return '晴朗';
    }
  };

  if (trailLoading) {
    return <LoadingSpinner message="正在載入步道詳情..." />;
  }

  if (!trail) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" textAlign="center">
          步道不存在
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 返回按鈕 */}
      <FadeIn direction="up">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/trails')}
          sx={{ mb: 3 }}
        >
          返回路線列表
        </Button>
      </FadeIn>

      <Grid container spacing={4}>
        {/* 主要資訊 */}
        <Grid item xs={12} md={8}>
          <FadeIn direction="up" delay={200}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h4" component="h1">
                    {trail.name}
                  </Typography>
                  {user && user.id === trail.user_id && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => navigate(`/trails/${trail.id}/edit`)}
                      >
                        編輯
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => deleteMutation.mutate()}
                      >
                        刪除
                      </Button>
                    </Box>
                  )}
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {trail.description}
                </Typography>

                {/* 難度標示 */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    難度等級
                  </Typography>
                  <Chip
                    icon={getDifficultyIcon(trail.difficulty)}
                    label={getDifficultyLabel(trail.difficulty)}
                    color={getDifficultyColor(trail.difficulty) as any}
                    size="medium"
                    sx={{ 
                      fontSize: '1rem',
                      height: 40,
                      '& .MuiChip-icon': {
                        fontSize: '1.2rem'
                      }
                    }}
                  />
                </Box>

                {/* 基本資訊 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        起點
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {trail.start_location}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        距離
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {trail.distance} 公里
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        時間
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {trail.duration} 分鐘
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Terrain sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        爬升
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {trail.elevation_gain} 公尺
                    </Typography>
                  </Grid>
                </Grid>

                {/* 評分 */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={trail.rating} readOnly precision={0.1} />
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {trail.rating} ({trail.review_count} 評價)
                  </Typography>
                </Box>

                {/* 標籤 */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {trail.tags?.map((tag: string, index: number) => (
                    <Chip key={index} label={tag} size="small" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </FadeIn>
        </Grid>

        {/* 側邊欄 */}
        <Grid item xs={12} md={4}>
          {/* 天氣預報 */}
          <FadeIn direction="up" delay={400}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  三日天氣預報
                </Typography>
                {weatherLoading ? (
                  <LoadingSpinner message="載入天氣中..." />
                ) : (
                  <Box>
                    {weatherData?.forecast?.map((day: any, index: number) => (
                      <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {index === 0 ? '今天' : index === 1 ? '明天' : '後天'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getWeatherIcon(day.condition)}
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {getConditionText(day.condition)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">
                            {day.temperature.high}°/{day.temperature.low}°
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <WaterDrop sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2">
                                {day.humidity}%
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Air sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2">
                                {day.windSpeed}km/h
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            降水機率: {day.precipitation}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            UV指數: {day.uvIndex}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* 步道統計 */}
          <FadeIn direction="up" delay={600}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  步道統計
                </Typography>
                {statsLoading ? (
                  <LoadingSpinner message="載入統計中..." />
                ) : (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        總瀏覽次數
                      </Typography>
                      <Typography variant="body1">
                        {statsData?.totalViews || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        完成次數
                      </Typography>
                      <Typography variant="body1">
                        {statsData?.totalCompletions || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        平均完成時間
                      </Typography>
                      <Typography variant="body1">
                        {statsData?.averageCompletionTime || 0} 分鐘
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        完成率
                      </Typography>
                      <Typography variant="body1">
                        {Math.round(((statsData?.totalCompletions || 0) / (statsData?.totalViews || 1)) * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.round(((statsData?.totalCompletions || 0) / (statsData?.totalViews || 1)) * 100)}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* 健行建議 */}
          <FadeIn direction="up" delay={800}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  健行建議
                </Typography>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • 建議攜帶充足的水和食物
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • 穿著適合的登山鞋和服裝
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • 注意天氣變化，攜帶雨具
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • 告知家人行程和預計返回時間
                  </Typography>
                  <Typography variant="body2">
                    • 遵守無痕山林原則
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </FadeIn>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrailDetailEnhanced;

