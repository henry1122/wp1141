import React, { useEffect, useState } from 'react';
import { Box, BoxProps } from '@mui/material';

interface FadeInProps extends BoxProps {
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  children: React.ReactNode;
}

const FadeIn: React.FC<FadeInProps> = ({
  delay = 0,
  duration = 600,
  direction = 'fade',
  children,
  sx,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return 'translateY(30px)';
        case 'down':
          return 'translateY(-30px)';
        case 'left':
          return 'translateX(30px)';
        case 'right':
          return 'translateX(-30px)';
        default:
          return 'none';
      }
    }
    return 'translate(0, 0)';
  };

  return (
    <Box
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default FadeIn;

