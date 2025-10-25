import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>請先登入</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        個人資料
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user.username}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                註冊時間: {new Date(user.created_at).toLocaleDateString('zh-TW')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                我的路線
              </Typography>
              <Typography variant="body2" color="text.secondary">
                您建立的路線將在此處顯示
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;


