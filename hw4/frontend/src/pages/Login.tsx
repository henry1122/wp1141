import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const schema = yup.object({
  email: yup
    .string()
    .email('請輸入有效的電子郵件地址')
    .required('電子郵件為必填欄位'),
  password: yup
    .string()
    .min(6, '密碼至少需要6個字符')
    .required('密碼為必填欄位'),
});

type FormData = yup.InferType<typeof schema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError('');
      await login(data.email, data.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || '登入失敗，請檢查您的帳號密碼');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            登入
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="電子郵件"
              autoComplete="email"
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="密碼"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : '登入'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                還沒有帳號？{' '}
                <Link component={RouterLink} to="/register">
                  立即註冊
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Demo Account Info */}
        <Paper
          elevation={1}
          sx={{
            padding: 3,
            marginTop: 3,
            width: '100%',
            backgroundColor: 'grey.50',
          }}
        >
          <Typography variant="h6" gutterBottom>
            測試帳號
          </Typography>
          <Typography variant="body2" color="text.secondary">
            電子郵件: john@example.com<br />
            密碼: password123
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;


