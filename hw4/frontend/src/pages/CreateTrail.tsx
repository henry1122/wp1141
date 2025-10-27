import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { trailsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Form validation schema
const schema = yup.object({
  name: yup.string().min(1, '路線名稱至少1個字').max(100, '路線名稱最多100個字').required('路線名稱為必填項目'),
  description: yup.string().min(1, '路線描述至少1個字').max(1000, '路線描述最多1000個字').required('路線描述為必填項目'),
  difficulty: yup.string().oneOf(['easy', 'medium', 'hard', 'expert']).required('難度為必填項目'),
  distance: yup.number().min(0.1, '距離必須至少0.1公里').max(1000, '距離不能超過1000公里').required('距離為必填項目'),
  duration: yup.number().min(1, '時間必須至少1分鐘').max(1440, '時間不能超過1440分鐘').required('時間為必填項目'),
  elevation_gain: yup.number().min(0, '海拔高度不能為負數').max(10000, '海拔高度不能超過10000公尺').required('海拔高度為必填項目'),
  start_location: yup.string().min(1, '起點至少1個字').max(200, '起點最多200個字').required('起點為必填項目'),
  end_location: yup.string().min(1, '終點至少1個字').max(200, '終點最多200個字').required('終點為必填項目'),
  tags: yup.string().optional()
});

interface CreateTrailForm {
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  distance: number;
  duration: number;
  elevation_gain: number;
  start_location: string;
  end_location: string;
  tags: string;
}

const CreateTrail: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // No authentication required - all users can create trails

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<CreateTrailForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      difficulty: 'medium',
      distance: 1,
      duration: 60,
      elevation_gain: 0,
      start_location: '',
      end_location: '',
      tags: ''
    }
  });

  const watchedTags = watch('tags');

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            正在載入...
          </Typography>
        </Paper>
      </Container>
    );
  }

  const onSubmit = async (data: CreateTrailForm) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Parse tags from comma-separated string
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      
      const trailData = {
        ...data,
        tags: tagsArray,
        coordinates: [] // Empty coordinates array for now
      };

      console.log('Sending trail data:', trailData);
      const response = await trailsAPI.createTrail(trailData);
      console.log('Trail created successfully:', response);
      setSuccess(true);
      
      // Redirect to trails list after successful creation
      setTimeout(() => {
        navigate('/trails');
      }, 2000);

    } catch (err: any) {
      console.error('Create trail error:', err);
      if (err.response?.status === 400) {
        setError(err.response?.data?.error || '請檢查輸入的資料');
      } else {
        setError(err.response?.data?.message || '建立路線時發生錯誤');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficultyOptions = [
    { value: 'easy', label: '簡單' },
    { value: 'medium', label: '中等' },
    { value: 'hard', label: '困難' },
    { value: 'expert', label: '專家級' }
  ];

  if (success) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" gutterBottom>
            ✅ 路線建立成功！
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            您的健行路線已成功建立，正在跳轉到路線列表...
          </Typography>
          <CircularProgress />
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          建立新路線
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          分享您的健行路線，讓其他健行者也能享受美好的健行體驗
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Route Name */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="路線名稱"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    placeholder="例如：玉山主峰、陽明山步道"
                  />
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="路線描述"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    placeholder="請詳細描述路線特色、風景、注意事項等..."
                  />
                )}
              />
            </Grid>

            {/* Difficulty */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.difficulty}>
                    <InputLabel>難度等級</InputLabel>
                    <Select {...field} label="難度等級">
                      {difficultyOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Distance */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="distance"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="距離 (公里)"
                    type="number"
                    fullWidth
                    error={!!errors.distance}
                    helperText={errors.distance?.message}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                )}
              />
            </Grid>

            {/* Duration */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="預估時間 (分鐘)"
                    type="number"
                    fullWidth
                    error={!!errors.duration}
                    helperText={errors.duration?.message}
                    inputProps={{ min: 0 }}
                  />
                )}
              />
            </Grid>

            {/* Elevation Gain */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="elevation_gain"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="海拔高度 (公尺)"
                    type="number"
                    fullWidth
                    error={!!errors.elevation_gain}
                    helperText={errors.elevation_gain?.message}
                    inputProps={{ min: 0 }}
                  />
                )}
              />
            </Grid>

            {/* Start Location */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="start_location"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="起點"
                    fullWidth
                    error={!!errors.start_location}
                    helperText={errors.start_location?.message}
                    placeholder="例如：塔塔加登山口"
                  />
                )}
              />
            </Grid>

            {/* End Location */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="end_location"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="終點"
                    fullWidth
                    error={!!errors.end_location}
                    helperText={errors.end_location?.message}
                    placeholder="例如：玉山主峰"
                  />
                )}
              />
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="標籤"
                    fullWidth
                    error={!!errors.tags}
                    helperText="請用逗號分隔多個標籤，例如：百岳,高山,日出,雲海"
                    placeholder="例如：百岳,高山,日出,雲海"
                  />
                )}
              />
              {watchedTags && (
                <Box sx={{ mt: 1 }}>
                  {watchedTags.split(',').map((tag, index) => {
                    const trimmedTag = tag.trim();
                    return trimmedTag ? (
                      <Chip
                        key={index}
                        label={trimmedTag}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ) : null;
                  })}
                </Box>
              )}
            </Grid>

            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/trails')}
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? '建立中...' : '建立路線'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateTrail;

