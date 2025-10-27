import React, { useState } from 'react';
import { Container, Paper, Typography, Button, Alert, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { trailsAPI } from '../services/api';

const DebugCreateTrail: React.FC = () => {
  const { user, token } = useAuth();
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testCreateTrail = async () => {
    try {
      setError('');
      setResult('Testing create trail...');
      
      const testData = {
        name: '測試路線',
        description: '這是一個測試路線',
        difficulty: 'medium' as const,
        distance: 5.0,
        duration: 120,
        elevation_gain: 500,
        coordinates: [],
        start_location: '測試起點',
        end_location: '測試終點',
        tags: ['測試', 'debug']
      };

      console.log('User:', user);
      console.log('Token:', token);
      console.log('Test data:', testData);

      const response = await trailsAPI.createTrail(testData);
      setResult(`Success: ${JSON.stringify(response, null, 2)}`);
    } catch (err: any) {
      console.error('Error:', err);
      setError(`Error: ${err.message} - ${JSON.stringify(err.response?.data, null, 2)}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          建立路線除錯頁面
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">用戶狀態：</Typography>
          <Typography>用戶：{user ? `${user.username} (${user.email})` : '未登入'}</Typography>
          <Typography>Token：{token ? '已設定' : '未設定'}</Typography>
        </Box>

        <Button 
          variant="contained" 
          onClick={testCreateTrail}
          sx={{ mb: 3 }}
        >
          測試建立路線
        </Button>

        {result && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2" component="pre">
              {result}
            </Typography>
          </Alert>
        )}

        {error && (
          <Alert severity="error">
            <Typography variant="body2" component="pre">
              {error}
            </Typography>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default DebugCreateTrail;
