import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Fab, 
  Tooltip, 
  IconButton, 
  Typography, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Chip
} from '@mui/material';
import {
  Accessibility,
  ZoomIn,
  ZoomOut,
  Contrast,
  TextIncrease,
  TextDecrease,
  Palette,
  Language,
  Gradient,
  PhotoCamera,
} from '@mui/icons-material';

interface AccessibilityHelperProps {
  onFontSizeChange?: (size: number) => void;
  onContrastChange?: (highContrast: boolean) => void;
  onZoomChange?: (zoom: number) => void;
  onColorSchemeChange?: (scheme: string) => void;
  onLanguageChange?: (language: string) => void;
  onGradientChange?: (gradient: string) => void;
  onBackgroundChange?: (background: string) => void;
}

const AccessibilityHelper: React.FC<AccessibilityHelperProps> = ({
  onFontSizeChange,
  onContrastChange,
  onZoomChange,
  onColorSchemeChange,
  onLanguageChange,
  onGradientChange,
  onBackgroundChange,
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isOpen, setIsOpen] = useState(false);
  const [colorScheme, setColorScheme] = useState('default');
  const [language, setLanguage] = useState('zh-TW');
  const [gradient, setGradient] = useState('none');
  const [background, setBackground] = useState('default');

  useEffect(() => {
    // Apply font size to document
    document.documentElement.style.fontSize = `${fontSize}px`;
    onFontSizeChange?.(fontSize);
  }, [fontSize, onFontSizeChange]);

  useEffect(() => {
    // Apply high contrast
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    onContrastChange?.(highContrast);
  }, [highContrast, onContrastChange]);

  useEffect(() => {
    // Apply zoom
    document.documentElement.style.zoom = `${zoom}%`;
    onZoomChange?.(zoom);
  }, [zoom, onZoomChange]);

  useEffect(() => {
    // Apply color scheme
    document.body.className = document.body.className.replace(/color-scheme-\w+/g, '');
    if (colorScheme !== 'default') {
      document.body.classList.add(`color-scheme-${colorScheme}`);
      console.log(`Applied color scheme: ${colorScheme}`);
    }
    onColorSchemeChange?.(colorScheme);
  }, [colorScheme, onColorSchemeChange]);

  useEffect(() => {
    // Apply language
    document.documentElement.lang = language;
    onLanguageChange?.(language);
  }, [language, onLanguageChange]);

  useEffect(() => {
    // Apply gradient
    document.body.className = document.body.className.replace(/gradient-\w+/g, '');
    if (gradient !== 'none') {
      document.body.classList.add(`gradient-${gradient}`);
      console.log(`Applied gradient: ${gradient}`);
    }
    onGradientChange?.(gradient);
  }, [gradient, onGradientChange]);

  useEffect(() => {
    // Apply background
    document.body.className = document.body.className.replace(/background-\w+/g, '');
    if (background !== 'default') {
      document.body.classList.add(`background-${background}`);
      console.log(`Applied background: ${background}`);
    }
    onBackgroundChange?.(background);
  }, [background, onBackgroundChange]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const toggleContrast = () => {
    setHighContrast(prev => !prev);
  };

  const increaseZoom = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const decreaseZoom = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const resetSettings = () => {
    setFontSize(16);
    setHighContrast(false);
    setZoom(100);
    setColorScheme('default');
    setLanguage('zh-TW');
    setGradient('none');
    setBackground('default');
  };

  const handleColorSchemeChange = (event: any) => {
    setColorScheme(event.target.value);
  };

  const handleLanguageChange = (event: any) => {
    setLanguage(event.target.value);
  };

  const handleGradientChange = (event: any) => {
    setGradient(event.target.value);
  };

  const handleBackgroundChange = (event: any) => {
    setBackground(event.target.value);
  };

  return (
    <>
      {/* Accessibility Panel */}
      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 80,
            right: 20,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            p: 2,
            zIndex: 1000,
            minWidth: 280,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={decreaseFontSize}>
                <TextDecrease />
              </IconButton>
              <Typography variant="body2">字體大小: {fontSize}px</Typography>
              <IconButton size="small" onClick={increaseFontSize}>
                <TextIncrease />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={decreaseZoom}>
                <ZoomOut />
              </IconButton>
              <Typography variant="body2">縮放: {zoom}%</Typography>
              <IconButton size="small" onClick={increaseZoom}>
                <ZoomIn />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small" 
                onClick={toggleContrast}
                color={highContrast ? 'primary' : 'default'}
              >
                <Contrast />
              </IconButton>
              <Typography variant="body2">
                {highContrast ? '高對比度' : '一般對比度'}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* 顏色主題 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Palette sx={{ fontSize: 20 }} />
              <Typography variant="body2" sx={{ minWidth: 80 }}>顏色主題</Typography>
            </Box>
            <FormControl size="small" fullWidth>
              <Select
                value={colorScheme}
                onChange={handleColorSchemeChange}
                displayEmpty
              >
                <MenuItem value="default">預設</MenuItem>
                <MenuItem value="dark">深色</MenuItem>
                <MenuItem value="blue">藍色</MenuItem>
                <MenuItem value="green">綠色</MenuItem>
                <MenuItem value="purple">紫色</MenuItem>
                <MenuItem value="orange">橙色</MenuItem>
              </Select>
            </FormControl>

            {/* 語言選擇 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 1 }}>
              <Language sx={{ fontSize: 20 }} />
              <Typography variant="body2" sx={{ minWidth: 80 }}>語言</Typography>
            </Box>
            <FormControl size="small" fullWidth>
              <Select
                value={language}
                onChange={handleLanguageChange}
                displayEmpty
              >
                <MenuItem value="zh-TW">繁體中文</MenuItem>
                <MenuItem value="zh-CN">簡體中文</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ja">日本語</MenuItem>
                <MenuItem value="ko">한국어</MenuItem>
              </Select>
            </FormControl>

            {/* 漸層效果 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 1 }}>
              <Gradient sx={{ fontSize: 20 }} />
              <Typography variant="body2" sx={{ minWidth: 80 }}>漸層</Typography>
            </Box>
            <FormControl size="small" fullWidth>
              <Select
                value={gradient}
                onChange={handleGradientChange}
                displayEmpty
              >
                <MenuItem value="none">無</MenuItem>
                <MenuItem value="sunset">日落</MenuItem>
                <MenuItem value="ocean">海洋</MenuItem>
                <MenuItem value="forest">森林</MenuItem>
                <MenuItem value="mountain">山脈</MenuItem>
                <MenuItem value="aurora">極光</MenuItem>
              </Select>
            </FormControl>

            {/* 背景照片 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 1 }}>
              <PhotoCamera sx={{ fontSize: 20 }} />
              <Typography variant="body2" sx={{ minWidth: 80 }}>背景</Typography>
            </Box>
            <FormControl size="small" fullWidth>
              <Select
                value={background}
                onChange={handleBackgroundChange}
                displayEmpty
              >
                <MenuItem value="default">預設</MenuItem>
                <MenuItem value="mountain">山景</MenuItem>
                <MenuItem value="forest">森林</MenuItem>
                <MenuItem value="ocean">海洋</MenuItem>
                <MenuItem value="city">城市</MenuItem>
                <MenuItem value="sunset">日落</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                size="small" 
                onClick={resetSettings}
                variant="outlined"
                color="secondary"
              >
                重置所有設定
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Toggle Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Tooltip title="無障礙設定">
          <Accessibility />
        </Tooltip>
      </Fab>
    </>
  );
};

export default AccessibilityHelper;

