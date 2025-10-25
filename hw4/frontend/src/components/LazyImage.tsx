import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton, Fade } from '@mui/material';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  placeholder?: React.ReactNode;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  sx?: any;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  placeholder,
  fallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjQ0NDIi8+Cjwvc3ZnPgo=',
  onLoad,
  onError,
  className,
  sx,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const defaultPlaceholder = (
    <Skeleton
      variant="rectangular"
      width={width}
      height={height}
      sx={{ borderRadius: 1 }}
    />
  );

  return (
    <Box
      ref={imgRef}
      sx={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        ...sx,
      }}
      className={className}
    >
      {!isInView && (placeholder || defaultPlaceholder)}
      
      {isInView && (
        <Fade in={isLoaded} timeout={300}>
          <Box
            component="img"
            src={hasError ? fallback : src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: isLoaded ? 'block' : 'none',
            }}
          />
        </Fade>
      )}
      
      {isInView && !isLoaded && !hasError && (placeholder || defaultPlaceholder)}
    </Box>
  );
};

export default LazyImage;

