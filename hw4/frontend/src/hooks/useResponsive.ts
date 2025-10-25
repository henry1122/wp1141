import { useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

interface BreakpointValues {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
}

interface ResponsiveValues {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeScreen: boolean;
  breakpoints: BreakpointValues;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const useResponsive = (): ResponsiveValues => {
  const theme = useTheme();
  
  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const sm = useMediaQuery(theme.breakpoints.only('sm'));
  const md = useMediaQuery(theme.breakpoints.only('md'));
  const lg = useMediaQuery(theme.breakpoints.only('lg'));
  const xl = useMediaQuery(theme.breakpoints.only('xl'));

  const isMobile = xs || sm;
  const isTablet = md;
  const isDesktop = lg || xl;
  const isLargeScreen = xl;

  const breakpoints: BreakpointValues = { xs, sm, md, lg, xl };

  const getScreenSize = (): 'xs' | 'sm' | 'md' | 'lg' | 'xl' => {
    if (xl) return 'xl';
    if (lg) return 'lg';
    if (md) return 'md';
    if (sm) return 'sm';
    return 'xs';
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    breakpoints,
    screenSize: getScreenSize(),
  };
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default useResponsive;

