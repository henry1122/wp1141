import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Settings,
  Close,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SimpleHome: React.FC = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState('zh-TW');
  const [backgroundColor, setBackgroundColor] = useState('none');

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


  // 應用語言
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // 應用背景顏色
  useEffect(() => {
    document.body.className = document.body.className.replace(/bg-color-\w+/g, '');
    if (backgroundColor !== 'none') {
      document.body.classList.add(`bg-color-${backgroundColor}`);
    }
  }, [backgroundColor]);

  const resetSettings = () => {
    setFontSize(16);
    setHighContrast(false);
    setLanguage('zh-TW');
    setBackgroundColor('none');
  };

  const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
    setFontSize(newValue as number);
  };


  const getText = (key: string) => {
    const texts = {
      'zh-TW': {
        welcome: '歡迎來到健行路線記錄',
        subtitle: '探索台灣最美麗的健行路線，記錄您的每一步',
        settings: '設定',
        fontSize: '字體大小',
        highContrast: '高對比度模式',
        language: '語言',
        backgroundColor: '背景顏色',
        reset: '重置設定',
        close: '關閉',
        description: '這是一個專為台灣健行愛好者設計的綜合平台，提供詳細的健行路線資訊、個人記錄追蹤、成就系統等功能。',
        features: '主要功能',
        feature1: '路線探索 - 發現台灣各地精彩健行路線',
        feature2: '個人記錄 - 記錄您的健行歷程與心得',
        feature3: '成就系統 - 挑戰不同難度的健行目標',
        feature4: '天氣資訊 - 即時天氣預報確保安全健行',
        famousMountains: '台灣百岳與著名山峰',
        mountainIntro: '台灣擁有豐富的山岳資源，從海拔3000公尺以上的百岳到適合初學者的郊山，每座山都有其獨特的魅力。',
        baiyue: '台灣百岳',
        baiyueDesc: '台灣百岳是指海拔3000公尺以上，且山勢雄偉、具有代表性的100座山峰。這些山峰不僅是登山者的挑戰目標，更是台灣自然景觀的精華所在。',
        famousPeaks: '著名山峰',
        yushan: '玉山 (3952m) - 台灣第一高峰，東北亞最高峰',
        xueshan: '雪山 (3886m) - 台灣第二高峰，冰河遺跡豐富',
        alishan: '阿里山 (2663m) - 日出雲海聞名，鐵路文化景觀',
        taroko: '太魯閣 - 大理石峽谷，世界級地質景觀',
        startExploring: '開始探索',
        learnMore: '了解更多'
      },
      'en': {
        welcome: 'Welcome to Hiking Trail Records',
        subtitle: 'Explore Taiwan\'s most beautiful hiking trails and record every step',
        settings: 'Settings',
        fontSize: 'Font Size',
        highContrast: 'High Contrast Mode',
        language: 'Language',
        backgroundColor: 'Background Color',
        reset: 'Reset Settings',
        close: 'Close',
        description: 'This is a comprehensive platform designed for Taiwan hiking enthusiasts, providing detailed trail information, personal record tracking, achievement systems, and more.',
        features: 'Main Features',
        feature1: 'Trail Exploration - Discover amazing hiking trails across Taiwan',
        feature2: 'Personal Records - Track your hiking journey and experiences',
        feature3: 'Achievement System - Challenge yourself with different hiking goals',
        feature4: 'Weather Information - Real-time weather forecasts for safe hiking',
        famousMountains: 'Taiwan\'s Baiyue and Famous Peaks',
        mountainIntro: 'Taiwan boasts rich mountain resources, from the Baiyue peaks over 3000m to beginner-friendly suburban mountains, each with its unique charm.',
        baiyue: 'Taiwan Baiyue',
        baiyueDesc: 'Taiwan Baiyue refers to 100 representative peaks over 3000m in elevation with magnificent terrain. These peaks are not only challenges for mountaineers but also represent the essence of Taiwan\'s natural landscapes.',
        famousPeaks: 'Famous Peaks',
        yushan: 'Yushan (3952m) - Taiwan\'s highest peak, highest in Northeast Asia',
        xueshan: 'Xueshan (3886m) - Taiwan\'s second highest peak, rich in glacial relics',
        alishan: 'Alishan (2663m) - Famous for sunrise and sea of clouds, railway cultural landscape',
        taroko: 'Taroko - Marble gorge, world-class geological landscape',
        startExploring: 'Start Exploring',
        learnMore: 'Learn More'
      }
    };
    return texts[language as keyof typeof texts]?.[key as keyof typeof texts['zh-TW']] || key;
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* 背景圖片 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/d18260cc-a801-4b68-b2c9-b73e81b94d58.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
          zIndex: -1,
        }}
      />

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* 標題區域 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              background: backgroundColor === 'green' ? 'linear-gradient(45deg, #2e7d32, #4caf50)' :
                          backgroundColor === 'blue' ? 'linear-gradient(45deg, #1976d2, #42a5f5)' :
                          backgroundColor === 'black' ? 'linear-gradient(45deg, #212121, #424242)' :
                          backgroundColor === 'red' ? 'linear-gradient(45deg, #d32f2f, #f44336)' :
                          backgroundColor === 'purple' ? 'linear-gradient(45deg, #7b1fa2, #9c27b0)' :
                          'linear-gradient(45deg, #2e7d32, #4caf50)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            {getText('welcome')}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            {getText('subtitle')}
          </Typography>
          
          {/* 網站描述 */}
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 6, 
              maxWidth: '800px', 
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: '1.1rem',
              color: 'text.primary',
              textAlign: 'center'
            }}
          >
            {getText('description')}
          </Typography>
        </Box>

        {/* 主要功能介紹 */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
            {getText('features')}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Box sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, backdropFilter: 'blur(10px)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                {getText('feature1')}
              </Typography>
            </Box>
            <Box sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, backdropFilter: 'blur(10px)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                {getText('feature2')}
              </Typography>
            </Box>
            <Box sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, backdropFilter: 'blur(10px)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                {getText('feature3')}
              </Typography>
            </Box>
            <Box sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, backdropFilter: 'blur(10px)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                {getText('feature4')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 台灣百岳與著名山峰介紹 */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
            {getText('famousMountains')}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              maxWidth: '800px', 
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: '1.1rem',
              textAlign: 'center'
            }}
          >
            {getText('mountainIntro')}
          </Typography>

          {/* 台灣百岳介紹 */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
              {getText('baiyue')}
            </Typography>
            <Box sx={{ 
              p: 4, 
              bgcolor: 'rgba(255, 255, 255, 0.15)', 
              borderRadius: 3, 
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                {getText('baiyueDesc')}
              </Typography>
            </Box>
          </Box>

          {/* 著名山峰介紹 */}
          <Box>
            <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
              {getText('famousPeaks')}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Box sx={{ 
                p: 3, 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: 2, 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#000000' }}>
                  {getText('yushan')}
                </Typography>
              </Box>
              <Box sx={{ 
                p: 3, 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: 2, 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#000000' }}>
                  {getText('xueshan')}
                </Typography>
              </Box>
              <Box sx={{ 
                p: 3, 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: 2, 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#000000' }}>
                  {getText('alishan')}
                </Typography>
              </Box>
              <Box sx={{ 
                p: 3, 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: 2, 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#000000' }}>
                  {getText('taroko')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 行動按鈕 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/trails')}
            sx={{
              background: backgroundColor === 'green' ? 'linear-gradient(45deg, #2e7d32, #4caf50)' :
                          backgroundColor === 'blue' ? 'linear-gradient(45deg, #1976d2, #42a5f5)' :
                          backgroundColor === 'black' ? 'linear-gradient(45deg, #212121, #424242)' :
                          backgroundColor === 'red' ? 'linear-gradient(45deg, #d32f2f, #f44336)' :
                          backgroundColor === 'purple' ? 'linear-gradient(45deg, #7b1fa2, #9c27b0)' :
                          'linear-gradient(45deg, #2e7d32, #4caf50)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              },
              borderRadius: '25px',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              mr: 2
            }}
          >
            {getText('startExploring')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/baiyue')}
            sx={{
              borderColor: backgroundColor === 'green' ? '#2e7d32' :
                          backgroundColor === 'blue' ? '#1976d2' :
                          backgroundColor === 'black' ? '#212121' :
                          backgroundColor === 'red' ? '#d32f2f' :
                          backgroundColor === 'purple' ? '#7b1fa2' :
                          '#2e7d32',
              color: backgroundColor === 'green' ? '#2e7d32' :
                     backgroundColor === 'blue' ? '#1976d2' :
                     backgroundColor === 'black' ? '#212121' :
                     backgroundColor === 'red' ? '#d32f2f' :
                     backgroundColor === 'purple' ? '#7b1fa2' :
                     '#2e7d32',
              '&:hover': {
                borderColor: backgroundColor === 'green' ? '#1b5e20' :
                            backgroundColor === 'blue' ? '#1565c0' :
                            backgroundColor === 'black' ? '#000000' :
                            backgroundColor === 'red' ? '#b71c1c' :
                            backgroundColor === 'purple' ? '#4a148c' :
                            '#1b5e20',
                backgroundColor: backgroundColor === 'green' ? 'rgba(46, 125, 50, 0.04)' :
                                backgroundColor === 'blue' ? 'rgba(25, 118, 210, 0.04)' :
                                backgroundColor === 'black' ? 'rgba(33, 33, 33, 0.04)' :
                                backgroundColor === 'red' ? 'rgba(211, 47, 47, 0.04)' :
                                backgroundColor === 'purple' ? 'rgba(123, 31, 162, 0.04)' :
                                'rgba(46, 125, 50, 0.04)',
              },
              borderRadius: '25px',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            {getText('learnMore')}
          </Button>
        </Box>

        {/* 設定按鈕 */}
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <Button
            variant="contained"
            startIcon={<Settings />}
            onClick={() => setSettingsOpen(true)}
            sx={{
              background: backgroundColor === 'green' ? 'linear-gradient(45deg, #2e7d32, #4caf50)' :
                          backgroundColor === 'blue' ? 'linear-gradient(45deg, #1976d2, #42a5f5)' :
                          backgroundColor === 'black' ? 'linear-gradient(45deg, #212121, #424242)' :
                          backgroundColor === 'red' ? 'linear-gradient(45deg, #d32f2f, #f44336)' :
                          backgroundColor === 'purple' ? 'linear-gradient(45deg, #7b1fa2, #9c27b0)' :
                          'linear-gradient(45deg, #2e7d32, #4caf50)',
              '&:hover': {
                background: backgroundColor === 'green' ? 'linear-gradient(45deg, #1b5e20, #388e3c)' :
                            backgroundColor === 'blue' ? 'linear-gradient(45deg, #1565c0, #1976d2)' :
                            backgroundColor === 'black' ? 'linear-gradient(45deg, #000000, #212121)' :
                            backgroundColor === 'red' ? 'linear-gradient(45deg, #b71c1c, #d32f2f)' :
                            backgroundColor === 'purple' ? 'linear-gradient(45deg, #4a148c, #7b1fa2)' :
                            'linear-gradient(45deg, #1b5e20, #388e3c)',
              },
              borderRadius: '25px',
              px: 3,
              py: 1.5,
              boxShadow: backgroundColor === 'green' ? '0 4px 20px rgba(46, 125, 50, 0.3)' :
                         backgroundColor === 'blue' ? '0 4px 20px rgba(25, 118, 210, 0.3)' :
                         backgroundColor === 'black' ? '0 4px 20px rgba(33, 33, 33, 0.3)' :
                         backgroundColor === 'red' ? '0 4px 20px rgba(211, 47, 47, 0.3)' :
                         backgroundColor === 'purple' ? '0 4px 20px rgba(123, 31, 162, 0.3)' :
                         '0 4px 20px rgba(46, 125, 50, 0.3)',
            }}
          >
            {getText('settings')}
          </Button>
        </Box>
      </Container>

      {/* 設定抽屜 */}
      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 350,
            background: backgroundColor === 'green' ? 'rgba(46, 125, 50, 0.95)' :
                        backgroundColor === 'blue' ? 'rgba(25, 118, 210, 0.95)' :
                        backgroundColor === 'black' ? 'rgba(33, 33, 33, 0.95)' :
                        backgroundColor === 'red' ? 'rgba(211, 47, 47, 0.95)' :
                        backgroundColor === 'purple' ? 'rgba(123, 31, 162, 0.95)' :
                        'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            color: backgroundColor === 'green' || backgroundColor === 'blue' || backgroundColor === 'black' || backgroundColor === 'red' || backgroundColor === 'purple' ? 'white' : 'black',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              {getText('settings')}
            </Typography>
            <IconButton onClick={() => setSettingsOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <List>
            {/* 字體大小 */}
            <ListItem>
              <ListItemText primary={`${getText('fontSize')}: ${fontSize}px`} />
            </ListItem>
            <ListItem>
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
            </ListItem>


            <Divider sx={{ my: 2 }} />

            {/* 高對比度 */}
            <ListItem>
              <FormControlLabel
                control={
                  <Switch
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                  />
                }
                label={getText('highContrast')}
              />
            </ListItem>

            <Divider sx={{ my: 2 }} />

            {/* 語言 */}
            <ListItem>
              <FormControl fullWidth>
                <InputLabel>{getText('language')}</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label={getText('language')}
                >
                  <MenuItem value="zh-TW">中文</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </ListItem>

            <Divider sx={{ my: 2 }} />

            {/* 背景顏色 */}
            <ListItem>
              <FormControl fullWidth>
                <InputLabel>{getText('backgroundColor')}</InputLabel>
                <Select
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  label={getText('backgroundColor')}
                >
                  <MenuItem value="none">僅背景照片</MenuItem>
                  <MenuItem value="green">綠色</MenuItem>
                  <MenuItem value="blue">藍色</MenuItem>
                  <MenuItem value="black">黑色</MenuItem>
                  <MenuItem value="red">紅色</MenuItem>
                  <MenuItem value="purple">紫色</MenuItem>
                </Select>
              </FormControl>
            </ListItem>

            <Divider sx={{ my: 2 }} />

            {/* 重置按鈕 */}
            <ListItem>
              <Button
                variant="outlined"
                onClick={resetSettings}
                fullWidth
                sx={{ 
                  borderColor: '#2e7d32',
                  color: '#2e7d32',
                  '&:hover': {
                    borderColor: '#1b5e20',
                    backgroundColor: 'rgba(46, 125, 50, 0.04)',
                  }
                }}
              >
                {getText('reset')}
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SimpleHome;
