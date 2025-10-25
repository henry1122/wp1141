import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  LinearProgress,
  Chip,
  useTheme,
} from '@mui/material';
import {
  EmojiEvents,
  Hiking,
  Speed,
  FitnessCenter,
  Star,
  Timeline,
  Terrain,
  Explore,
  Favorite,
  Share,
} from '@mui/icons-material';
import FadeIn from '../components/animations/FadeIn';
import StaggeredList from '../components/animations/StaggeredList';

const Achievements: React.FC = () => {
  const theme = useTheme();

  const achievements = [
    {
      id: 1,
      title: '初出茅廬',
      description: '完成第一條健行路線',
      icon: <Hiking />,
      color: 'primary',
      progress: 100,
      unlocked: true,
      rarity: 'common',
    },
    {
      id: 2,
      title: '速度之王',
      description: '在30分鐘內完成5公里路線',
      icon: <Speed />,
      color: 'secondary',
      progress: 75,
      unlocked: false,
      rarity: 'rare',
    },
    {
      id: 3,
      title: '體能達人',
      description: '連續7天完成健行',
      icon: <FitnessCenter />,
      color: 'success',
      progress: 60,
      unlocked: false,
      rarity: 'epic',
    },
    {
      id: 4,
      title: '五星評價',
      description: '獲得10個五星評價',
      icon: <Star />,
      color: 'warning',
      progress: 40,
      unlocked: false,
      rarity: 'legendary',
    },
    {
      id: 5,
      title: '路線探索家',
      description: '完成50條不同路線',
      icon: <Explore />,
      color: 'info',
      progress: 20,
      unlocked: false,
      rarity: 'epic',
    },
    {
      id: 6,
      title: '高山征服者',
      description: '完成10條高難度路線',
      icon: <Terrain />,
      color: 'error',
      progress: 10,
      unlocked: false,
      rarity: 'legendary',
    },
    {
      id: 7,
      title: '社交達人',
      description: '分享50條路線',
      icon: <Share />,
      color: 'primary',
      progress: 30,
      unlocked: false,
      rarity: 'rare',
    },
    {
      id: 8,
      title: '收藏家',
      description: '收藏100條路線',
      icon: <Favorite />,
      color: 'secondary',
      progress: 15,
      unlocked: false,
      rarity: 'epic',
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#9e9e9e';
      case 'rare': return '#2196f3';
      case 'epic': return '#9c27b0';
      case 'legendary': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return '普通';
      case 'rare': return '稀有';
      case 'epic': return '史詩';
      case 'legendary': return '傳說';
      default: return '普通';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <FadeIn direction="up">
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          🏆 成就系統
        </Typography>
      </FadeIn>
      
      <FadeIn direction="up" delay={200}>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
          挑戰各種成就，展現你的健行實力！
        </Typography>
      </FadeIn>

      {/* Achievement Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <FadeIn direction="up" delay={300}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                <EmojiEvents sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" color="primary.main">
                1/8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                已解鎖成就
              </Typography>
            </Card>
          </FadeIn>
        </Grid>
        <Grid item xs={12} md={4}>
          <FadeIn direction="up" delay={400}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                <Timeline sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" color="secondary.main">
                12.5%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                完成進度
              </Typography>
            </Card>
          </FadeIn>
        </Grid>
        <Grid item xs={12} md={4}>
          <FadeIn direction="up" delay={500}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                <Star sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" color="success.main">
                125
              </Typography>
              <Typography variant="body2" color="text.secondary">
                成就點數
              </Typography>
            </Card>
          </FadeIn>
        </Grid>
      </Grid>

      {/* Achievements Grid */}
      <StaggeredList delay={100} direction="up">
        {achievements.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                opacity: achievement.unlocked ? 1 : 0.7,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${getRarityColor(achievement.rarity)}, ${getRarityColor(achievement.rarity)}80)`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: achievement.unlocked 
                        ? `${achievement.color}.main` 
                        : 'grey.400',
                      mr: 2,
                      width: 50,
                      height: 50,
                    }}
                  >
                    {achievement.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3">
                      {achievement.title}
                    </Typography>
                    <Chip
                      label={getRarityLabel(achievement.rarity)}
                      size="small"
                      sx={{
                        bgcolor: getRarityColor(achievement.rarity),
                        color: 'white',
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {achievement.description}
                </Typography>

                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      進度
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {achievement.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={achievement.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: achievement.unlocked 
                          ? `${achievement.color}.main` 
                          : 'grey.400',
                      },
                    }}
                  />
                </Box>

                {achievement.unlocked && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'gold',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EmojiEvents sx={{ fontSize: 16, color: 'white' }} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </StaggeredList>

      {/* Achievement Tips */}
      <FadeIn direction="up" delay={800}>
        <Card sx={{ mt: 6, p: 4, bgcolor: 'grey.50' }}>
          <Typography variant="h5" gutterBottom>
            💡 成就解鎖小貼士
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                • 每天完成一條路線可以快速累積成就進度
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                • 挑戰不同難度的路線可以解鎖更多成就
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                • 分享你的路線給朋友，獲得更多互動
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                • 收藏喜歡的路線，建立你的專屬路線庫
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </FadeIn>
    </Container>
  );
};

export default Achievements;

