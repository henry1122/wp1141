import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  Chip,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  Hiking,
  Speed,
  EmojiEvents,
  LocationOn,
  Star,
  People,
  Timeline,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../services/api';
import FadeIn from '../components/animations/FadeIn';
import StaggeredList from '../components/animations/StaggeredList';
import LoadingSpinner from '../components/animations/LoadingSpinner';

const Stats: React.FC = () => {
  const theme = useTheme();

  // 獲取公開統計數據
  const { data: publicStats, isLoading: publicLoading } = useQuery(
    'public-stats',
    () => api.get('/stats/public').then(res => res.data.data),
    {
      select: (data) => data,
    }
  );

  // 獲取用戶統計數據
  const { data: userStats, isLoading: userLoading } = useQuery(
    'user-stats',
    () => api.get('/stats/user').then(res => res.data.data),
    {
      select: (data) => data,
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

  if (publicLoading || userLoading) {
    return <LoadingSpinner message="正在載入統計數據..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <FadeIn direction="up">
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          統計分析
        </Typography>
      </FadeIn>
      
      <FadeIn direction="up" delay={200}>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
          了解健行社群的整體數據和你的個人表現
        </Typography>
      </FadeIn>

      {/* 公開統計數據 */}
      <Box sx={{ mb: 6 }}>
        <FadeIn direction="up" delay={300}>
          <Typography variant="h4" gutterBottom>
            社群統計
          </Typography>
        </FadeIn>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FadeIn direction="up" delay={400}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                  <Hiking sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h4" color="primary.main">
                  {publicStats?.totalTrails || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  總路線數
                </Typography>
              </Card>
            </FadeIn>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeIn direction="up" delay={500}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                  <People sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h4" color="secondary.main">
                  {publicStats?.totalUsers || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  註冊用戶
                </Typography>
              </Card>
            </FadeIn>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeIn direction="up" delay={600}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                  <Star sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h4" color="success.main">
                  {publicStats?.popularTrails?.[0]?.rating?.toFixed(1) || '0.0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  最高評分
                </Typography>
              </Card>
            </FadeIn>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeIn direction="up" delay={700}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                  <LocationOn sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h4" color="warning.main">
                  {publicStats?.regionDistribution?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  涵蓋縣市數
                </Typography>
              </Card>
            </FadeIn>
          </Grid>
        </Grid>

        {/* 難度分布 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FadeIn direction="up" delay={800}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    難度分布
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {publicStats?.difficultyDistribution?.map((item: any) => (
                      <Chip
                        key={item.difficulty}
                        label={`${getDifficultyLabel(item.difficulty)}: ${item.count}條`}
                        color={getDifficultyColor(item.difficulty) as any}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </FadeIn>
          </Grid>
          <Grid item xs={12} md={6}>
            <FadeIn direction="up" delay={900}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    地區分布
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {publicStats?.regionDistribution?.map((item: any) => (
                      <Chip
                        key={item.region}
                        label={`${item.region}: ${item.count}條`}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </FadeIn>
          </Grid>
        </Grid>
      </Box>

      {/* 熱門路線 */}
      <Box sx={{ mb: 6 }}>
        <FadeIn direction="up" delay={1000}>
          <Typography variant="h4" gutterBottom>
            熱門路線
          </Typography>
        </FadeIn>
        
        <FadeIn direction="up" delay={1100}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>路線名稱</TableCell>
                  <TableCell>難度</TableCell>
                  <TableCell>評分</TableCell>
                  <TableCell>評價數</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {publicStats?.popularTrails?.slice(0, 10).map((trail: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{trail.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={getDifficultyLabel(trail.difficulty)}
                        color={getDifficultyColor(trail.difficulty) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                        {trail.rating?.toFixed(1)}
                      </Box>
                    </TableCell>
                    <TableCell>{trail.review_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FadeIn>
      </Box>

      {/* 活躍用戶 */}
      <Box sx={{ mb: 6 }}>
        <FadeIn direction="up" delay={1200}>
          <Typography variant="h4" gutterBottom>
            活躍用戶
          </Typography>
        </FadeIn>
        
        <FadeIn direction="up" delay={1300}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>用戶名</TableCell>
                  <TableCell>路線數</TableCell>
                  <TableCell>總距離</TableCell>
                  <TableCell>平均評分</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {publicStats?.activeUsers?.slice(0, 10).map((user: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.trail_count}</TableCell>
                    <TableCell>{user.total_distance?.toFixed(1)} km</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                        {user.avg_rating?.toFixed(1)}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FadeIn>
      </Box>

      {/* 個人統計（如果已登入） */}
      {userStats && (
        <Box>
          <FadeIn direction="up" delay={1400}>
            <Typography variant="h4" gutterBottom>
              我的統計
            </Typography>
          </FadeIn>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FadeIn direction="up" delay={1500}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                    <Hiking sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h4" color="primary.main">
                    {userStats.trailCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    我的路線
                  </Typography>
                </Card>
              </FadeIn>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FadeIn direction="up" delay={1600}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                    <Speed sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h4" color="secondary.main">
                    {userStats.totalDistance?.toFixed(1)}km
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    總距離
                  </Typography>
                </Card>
              </FadeIn>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FadeIn direction="up" delay={1700}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                    <Timeline sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h4" color="success.main">
                    {Math.round((userStats.totalTime || 0) / 60)}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    總時間
                  </Typography>
                </Card>
              </FadeIn>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FadeIn direction="up" delay={1800}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                    <Star sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h4" color="warning.main">
                    {userStats.avgRating?.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    平均評分
                  </Typography>
                </Card>
              </FadeIn>
            </Grid>
          </Grid>

          {/* 個人難度分布 */}
          <FadeIn direction="up" delay={1900}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  我的難度分布
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {userStats.difficultyStats?.map((item: any) => (
                    <Chip
                      key={item.difficulty}
                      label={`${getDifficultyLabel(item.difficulty)}: ${item.count}條`}
                      color={getDifficultyColor(item.difficulty) as any}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </FadeIn>
        </Box>
      )}
    </Container>
  );
};

export default Stats;

