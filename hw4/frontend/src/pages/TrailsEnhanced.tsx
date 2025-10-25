import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  Pagination,
  CircularProgress,
  Alert,
  Avatar,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  TrendingUp,
  Search,
  Speed,
  FitnessCenter,
  Star,
  Terrain,
  Add,
  FilterList,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { trailsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import FadeIn from '../components/animations/FadeIn';
import StaggeredList from '../components/animations/StaggeredList';
import LoadingSpinner from '../components/animations/LoadingSpinner';

const TrailsEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    sortBy: 'rating',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const { data: trailsData, isLoading, error } = useQuery(
    ['trails', filters, page],
    () => trailsAPI.getTrails({
      ...filters,
      page,
      limit: itemsPerPage,
    }),
    {
      keepPreviousData: true,
    }
  );

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小時${mins > 0 ? `${mins}分鐘` : ''}`;
    }
    return `${mins}分鐘`;
  };

  if (isLoading) {
    return <LoadingSpinner message="正在載入路線..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          載入路線時發生錯誤，請稍後再試。
        </Alert>
      </Container>
    );
  }

  const trails = trailsData?.trails || [];
  const totalPages = Math.ceil((trailsData?.pagination?.total || 0) / itemsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <FadeIn direction="up">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1">
            健行路線
          </Typography>
          {user && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create-trail')}
              sx={{ borderRadius: 2 }}
            >
              建立路線
            </Button>
          )}
        </Box>
      </FadeIn>

      {/* 搜尋和篩選 */}
      <FadeIn direction="up" delay={200}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="搜尋路線名稱或地點..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>難度等級</InputLabel>
                <Select
                  value={filters.difficulty}
                  label="難度等級"
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                >
                  <MenuItem value="">全部</MenuItem>
                  <MenuItem value="easy">簡單</MenuItem>
                  <MenuItem value="medium">中等</MenuItem>
                  <MenuItem value="hard">困難</MenuItem>
                  <MenuItem value="expert">專家</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>排序方式</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="排序方式"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <MenuItem value="rating">評分</MenuItem>
                  <MenuItem value="distance">距離</MenuItem>
                  <MenuItem value="duration">時間</MenuItem>
                  <MenuItem value="elevation_gain">爬升</MenuItem>
                  <MenuItem value="created_at">建立時間</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>排序順序</InputLabel>
                <Select
                  value={filters.sortOrder}
                  label="排序順序"
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                >
                  <MenuItem value="desc">降序</MenuItem>
                  <MenuItem value="asc">升序</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </FadeIn>

      {/* 路線列表 */}
      <StaggeredList>
        <Grid container spacing={3}>
          {trails.map((trail: any, index: number) => (
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

      {/* 分頁 */}
      {totalPages > 1 && (
        <FadeIn direction="up" delay={500}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              size="large"
            />
          </Box>
        </FadeIn>
      )}

      {/* 空狀態 */}
      {trails.length === 0 && !isLoading && (
        <FadeIn direction="up">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Avatar sx={{ bgcolor: 'grey.200', mx: 'auto', mb: 2, width: 80, height: 80 }}>
              <Search sx={{ fontSize: 40, color: 'grey.500' }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              找不到符合條件的路線
            </Typography>
            <Typography variant="body2" color="text.secondary">
              請嘗試調整搜尋條件或篩選器
            </Typography>
          </Box>
        </FadeIn>
      )}
    </Container>
  );
};

export default TrailsEnhanced;

