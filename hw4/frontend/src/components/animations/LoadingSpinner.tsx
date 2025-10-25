import React from 'react';
import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const dots = keyframes`
  0%, 20% {
    color: rgba(0,0,0,0);
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  40% {
    color: black;
    text-shadow:
      .25em 0 0 rgba(0,0,0,0),
      .5em 0 0 rgba(0,0,0,0);
  }
  60% {
    text-shadow:
      .25em 0 0 black,
      .5em 0 0 rgba(0,0,0,0);
  }
  80%, 100% {
    text-shadow:
      .25em 0 0 black,
      .5em 0 0 black;
  }
`;

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  variant?: 'spinner' | 'skeleton' | 'dots';
  rows?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = '載入中...',
  size = 40,
  variant = 'spinner',
  rows = 3
}) => {
  if (variant === 'skeleton') {
    return (
      <Box sx={{ width: '100%' }}>
        {Array.from({ length: rows }).map((_, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            <Box sx={{ mt: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === 'dots') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          py: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            animation: `${dots} 1.4s linear infinite`,
            fontFamily: 'monospace',
          }}
        >
          ...
        </Typography>
        {message && (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        py: 4,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          animation: `${pulse} 2s ease-in-out infinite`,
        }}
      >
        <CircularProgress
          size={size}
          thickness={4}
          sx={{
            animation: `${rotate} 1s linear infinite`,
            color: 'primary.main',
          }}
        />
      </Box>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          animation: `${pulse} 2s ease-in-out infinite`,
          animationDelay: '0.5s',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;

