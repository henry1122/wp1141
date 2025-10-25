import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Rating,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  TrendingUp,
  Person,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { trailsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const TrailDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: trail, isLoading, error } = useQuery(
    ['trail', id],
    () => trailsAPI.getTrailById(Number(id)),
    {
      enabled: !!id,
    }
  );

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

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !trail) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          找不到指定的路線，或載入時發生錯誤。
        </Alert>
      </Container>
    );
  }

  const isOwner = user?.id === trail.user_id;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" component="h1" gutterBottom>
            {trail.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Chip 
              label={getDifficultyLabel(trail.difficulty)} 
              color={getDifficultyColor(trail.difficulty) as any}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={trail.rating} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({trail.review_count} 則評價)
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 4 }}>
            {trail.description}
          </Typography>

          {/* Trail Info */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                路線資訊
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      預估時間: {trail.duration} 分鐘
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      距離: {trail.distance} 公里
                    </Typography>
                  </Box>
                </Grid>

                {trail.elevation_gain > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrendingUp sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        爬升高度: {trail.elevation_gain} 公尺
                      </Typography>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      作者: {trail.author_username}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                路線地圖
              </Typography>
              <Box 
                sx={{ 
                  height: 400, 
                  bgcolor: 'grey.100', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: 1
                }}
              >
                <Typography color="text.secondary">
                  地圖功能將在此處顯示
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                起點與終點
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  起點
                </Typography>
                <Typography variant="body1">
                  {trail.start_location}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  終點
                </Typography>
                <Typography variant="body1">
                  {trail.end_location}
                </Typography>
              </Box>

              {trail.tags.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    標籤
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {trail.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Box>
                </Box>
              )}

              {isOwner && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/edit-trail/${trail.id}`)}
                    fullWidth
                  >
                    編輯路線
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    fullWidth
                  >
                    刪除路線
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrailDetail;


