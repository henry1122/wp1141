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
  username: yup
    .string()
    .min(3, '用戶名至少需要3個字符')
    .max(20, '用戶名不能超過20個字符')
    .matches(/^[a-zA-Z0-9_]+$/, '用戶名只能包含字母、數字和下劃線')
    .required('用戶名為必填欄位'),
  email: yup
    .string()
    .email('請輸入有效的電子郵件地址')
    .required('電子郵件為必填欄位'),
  password: yup
    .string()
    .min(6, '密碼至少需要6個字符')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '密碼必須包含至少一個小寫字母、一個大寫字母和一個數字'
    )
    .required('密碼為必填欄位'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], '密碼確認不匹配')
    .required('密碼確認為必填欄位'),
});

type FormData = yup.InferType<typeof schema>;

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
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
      await registerUser(data.username, data.email, data.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || '註冊失敗，請檢查您的輸入');
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
            註冊
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
              id="username"
              label="用戶名"
              autoComplete="username"
              autoFocus
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="電子郵件"
              autoComplete="email"
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
              autoComplete="new-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="確認密碼"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : '註冊'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                已經有帳號了？{' '}
                <Link component={RouterLink} to="/login">
                  立即登入
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;


