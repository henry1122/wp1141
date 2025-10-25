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
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  TrendingUp,
  Search,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { trailsAPI } from '../services/api';
import { TrailFilters } from '../types';
import LoadingSpinner from '../components/animations/LoadingSpinner';
import EnhancedSearch from '../components/EnhancedSearch';

const Trails: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TrailFilters>({
    page: 1,
    limit: 12,
    search: '',
    difficulty: '',
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const { data, isLoading, error } = useQuery(
    ['trails', filters],
    () => trailsAPI.getTrails(filters),
    {
      keepPreviousData: true,
    }
  );

  const handleFilterChange = (key: keyof TrailFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      case 'expert': return 'default';
      default: return 'default';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '簡單';
      case 'medium': return '中等';
      case 'hard': return '困難';
      case 'expert': return '專家';
      default: return difficulty;
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          載入路線時發生錯誤，請稍後再試。
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        路線探索
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        發現精彩的健行路線，開始你的冒險之旅
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <EnhancedSearch
              placeholder="搜尋路線名稱、地點..."
              onSearch={(query) => handleFilterChange('search', query)}
              suggestions={[
                { id: '1', text: '陽明山', type: 'trending' },
                { id: '2', text: '象山', type: 'recent' },
                { id: '3', text: '阿里山', type: 'location' },
                { id: '4', text: '太魯閣', type: 'trending' },
              ]}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>難度</InputLabel>
              <Select
                value={filters.difficulty}
                label="難度"
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

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>排序方式</InputLabel>
              <Select
                value={filters.sort_by}
                label="排序方式"
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
              >
                <MenuItem value="created_at">最新</MenuItem>
                <MenuItem value="rating">評分</MenuItem>
                <MenuItem value="distance">距離</MenuItem>
                <MenuItem value="duration">時間</MenuItem>
                <MenuItem value="name">名稱</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>排序順序</InputLabel>
              <Select
                value={filters.sort_order}
                label="排序順序"
                onChange={(e) => handleFilterChange('sort_order', e.target.value)}
              >
                <MenuItem value="desc">降序</MenuItem>
                <MenuItem value="asc">升序</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner variant="skeleton" rows={6} message="正在搜尋路線..." />
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            找到 {data?.pagination.total || 0} 條路線
          </Typography>

          <Grid container spacing={3}>
            {data?.trails.map((trail) => (
              <Grid item xs={12} sm={6} md={4} key={trail.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                  onClick={() => navigate(`/trails/${trail.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {trail.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {trail.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {trail.start_location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {trail.duration} 分鐘 • {trail.distance} 公里
                      </Typography>
                    </Box>

                    {trail.elevation_gain > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TrendingUp sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          爬升 {trail.elevation_gain} 公尺
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Chip 
                        label={getDifficultyLabel(trail.difficulty)} 
                        size="small" 
                        color={getDifficultyColor(trail.difficulty) as any}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={trail.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({trail.review_count})
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      作者: {trail.author_username}
                    </Typography>
                  </CardContent>
                  
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/trails/${trail.id}`)}>
                      查看詳情
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {data?.pagination.pages && data.pagination.pages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={data.pagination.pages}
                page={filters.page || 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Trails;


