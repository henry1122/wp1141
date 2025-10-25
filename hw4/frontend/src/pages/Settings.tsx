import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Slider,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';

const Settings: React.FC = () => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [colorScheme, setColorScheme] = useState('default');
  const [language, setLanguage] = useState('zh-TW');
  const [gradient, setGradient] = useState('none');
  const [background, setBackground] = useState('default');

  // 應用字體大小
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // 應用高對比度
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // 應用縮放
  useEffect(() => {
    document.documentElement.style.zoom = `${zoom}%`;
  }, [zoom]);

  // 應用顏色主題
  useEffect(() => {
    document.body.className = document.body.className.replace(/color-scheme-\w+/g, '');
    if (colorScheme !== 'default') {
      document.body.classList.add(`color-scheme-${colorScheme}`);
    }
  }, [colorScheme]);

  // 應用語言
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // 應用漸層
  useEffect(() => {
    document.body.className = document.body.className.replace(/gradient-\w+/g, '');
    if (gradient !== 'none') {
      document.body.classList.add(`gradient-${gradient}`);
    }
  }, [gradient]);

  // 應用背景
  useEffect(() => {
    document.body.className = document.body.className.replace(/background-\w+/g, '');
    if (background !== 'default') {
      document.body.classList.add(`background-${background}`);
    }
  }, [background]);

  const resetSettings = () => {
    setFontSize(16);
    setHighContrast(false);
    setZoom(100);
    setColorScheme('default');
    setLanguage('zh-TW');
    setGradient('none');
    setBackground('default');
  };

  const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
    setFontSize(newValue as number);
  };

  const handleZoomChange = (event: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        🎨 個人設定
      </Typography>

      <Grid container spacing={3}>
        {/* 字體設定 */}
        <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="字體設定"
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>字體大小: {fontSize}px</Typography>
                  <Slider
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    min={12}
                    max={24}
                    step={1}
                    marks={[
                      { value: 12, label: '12px' },
                      { value: 16, label: '16px' },
                      { value: 20, label: '20px' },
                      { value: 24, label: '24px' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>縮放: {zoom}%</Typography>
                  <Slider
                    value={zoom}
                    onChange={handleZoomChange}
                    min={50}
                    max={200}
                    step={10}
                    marks={[
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' },
                      { value: 150, label: '150%' },
                      { value: 200, label: '200%' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={highContrast}
                      onChange={(e) => setHighContrast(e.target.checked)}
                    />
                  }
                  label="高對比度模式"
                />
              </CardContent>
            </Card>
        </Grid>

        {/* 外觀設定 */}
        <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="外觀設定"
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>顏色主題</InputLabel>
                    <Select
                      value={colorScheme}
                      onChange={(e) => setColorScheme(e.target.value)}
                      label="顏色主題"
                    >
                      <MenuItem value="default">預設</MenuItem>
                      <MenuItem value="dark">深色</MenuItem>
                      <MenuItem value="blue">藍色</MenuItem>
                      <MenuItem value="green">綠色</MenuItem>
                      <MenuItem value="purple">紫色</MenuItem>
                      <MenuItem value="orange">橙色</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>漸層效果</InputLabel>
                    <Select
                      value={gradient}
                      onChange={(e) => setGradient(e.target.value)}
                      label="漸層效果"
                    >
                      <MenuItem value="none">無</MenuItem>
                      <MenuItem value="sunset">日落</MenuItem>
                      <MenuItem value="ocean">海洋</MenuItem>
                      <MenuItem value="forest">森林</MenuItem>
                      <MenuItem value="mountain">山脈</MenuItem>
                      <MenuItem value="aurora">極光</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>背景照片</InputLabel>
                    <Select
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      label="背景照片"
                    >
                      <MenuItem value="default">預設</MenuItem>
                      <MenuItem value="mountain">山景</MenuItem>
                      <MenuItem value="forest">森林</MenuItem>
                      <MenuItem value="ocean">海洋</MenuItem>
                      <MenuItem value="city">城市</MenuItem>
                      <MenuItem value="sunset">日落</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
        </Grid>

        {/* 語言設定 */}
        <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="語言設定"
              />
              <CardContent>
                <FormControl fullWidth>
                  <InputLabel>介面語言</InputLabel>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    label="介面語言"
                  >
                    <MenuItem value="zh-TW">繁體中文</MenuItem>
                    <MenuItem value="zh-CN">簡體中文</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="ja">日本語</MenuItem>
                    <MenuItem value="ko">한국어</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
        </Grid>

        {/* 操作按鈕 */}
        <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="操作"
              />
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={resetSettings}
                    fullWidth
                  >
                    重置所有設定
                  </Button>
                </Box>
              </CardContent>
            </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
