import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import WeatherWidget from '../components/WeatherWidget';
import FadeIn from '../components/animations/FadeIn';

const Weather: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <FadeIn direction="up">
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          🌤️ 天氣資訊
        </Typography>
      </FadeIn>
      
      <FadeIn direction="up" delay={200}>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
          掌握最新天氣狀況，為你的健行之旅做好準備
        </Typography>
      </FadeIn>

      <Grid container spacing={4}>
        {/* Main Weather Widget */}
        <Grid item xs={12} md={8}>
          <WeatherWidget />
        </Grid>

        {/* Weather Tips */}
        <Grid item xs={12} md={4}>
          <FadeIn direction="up" delay={400}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  🎯 健行天氣小貼士
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    ☀️ 晴天健行
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 做好防曬準備，攜帶防曬乳和帽子<br/>
                    • 多補充水分，避免中暑<br/>
                    • 選擇有遮蔭的路線
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="info.main" gutterBottom>
                    ☁️ 多雲天氣
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 最適合健行的天氣<br/>
                    • 溫度適中，不會太熱<br/>
                    • 記得攜帶輕便雨具以防萬一
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="error.main" gutterBottom>
                    🌧️ 雨天健行
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 避免前往危險路段<br/>
                    • 穿著防滑鞋具<br/>
                    • 注意雷電安全
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" color="warning.main" gutterBottom>
                    ❄️ 低溫天氣
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 穿著保暖衣物<br/>
                    • 注意路面結冰<br/>
                    • 攜帶熱飲補充熱量
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </FadeIn>
        </Grid>

        {/* Weather Alerts */}
        <Grid item xs={12}>
          <FadeIn direction="up" delay={600}>
            <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ⚠️ 天氣警報
                </Typography>
                <Typography variant="body1">
                  目前無特殊天氣警報。建議在出發前再次確認最新天氣資訊，確保健行安全。
                </Typography>
              </CardContent>
            </Card>
          </FadeIn>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Weather;

