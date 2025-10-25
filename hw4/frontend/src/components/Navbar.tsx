import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Hiking,
  Home,
  Explore,
  Add,
  Person,
  Logout,
  EmojiEvents,
  Cloud,
  Timeline,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('green');

  // 監聽背景顏色變化
  useEffect(() => {
    const checkBackgroundColor = () => {
      const bodyClasses = document.body.className;
      const colorMatch = bodyClasses.match(/bg-color-(\w+)/);
      if (colorMatch) {
        setBackgroundColor(colorMatch[1]);
      } else {
        setBackgroundColor('green'); // 默認顏色
      }
    };

    checkBackgroundColor();
    
    // 監聽 class 變化
    const observer = new MutationObserver(checkBackgroundColor);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    handleMenuClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem 
          button 
          onClick={() => handleNavigation('/')}
          selected={isActive('/')}
        >
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="首頁" />
        </ListItem>
        
        <ListItem 
          button 
          onClick={() => handleNavigation('/trails')}
          selected={isActive('/trails')}
        >
          <ListItemIcon>
            <Explore />
          </ListItemIcon>
          <ListItemText primary="路線探索" />
        </ListItem>

        <ListItem 
          button 
          onClick={() => handleNavigation('/achievements')}
          selected={isActive('/achievements')}
        >
          <ListItemIcon>
            <EmojiEvents />
          </ListItemIcon>
          <ListItemText primary="成就系統" />
        </ListItem>

        <ListItem 
          button 
          onClick={() => handleNavigation('/weather')}
          selected={isActive('/weather')}
        >
          <ListItemIcon>
            <Cloud />
          </ListItemIcon>
          <ListItemText primary="天氣資訊" />
        </ListItem>

        <ListItem 
          button 
          onClick={() => handleNavigation('/stats')}
          selected={isActive('/stats')}
        >
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText primary="統計分析" />
        </ListItem>

        <ListItem 
          button 
          onClick={() => handleNavigation('/settings')}
          selected={isActive('/settings')}
        >
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="個人設定" />
        </ListItem>

        {user && (
          <>
            <ListItem 
              button 
              onClick={() => handleNavigation('/create-trail')}
              selected={isActive('/create-trail')}
            >
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="建立路線" />
            </ListItem>

            <ListItem 
              button 
              onClick={() => handleNavigation('/profile')}
              selected={isActive('/profile')}
            >
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="個人資料" />
            </ListItem>

            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="登出" />
            </ListItem>
          </>
        )}

        {!user && (
          <>
            <ListItem 
              button 
              onClick={() => handleNavigation('/login')}
              selected={isActive('/login')}
            >
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="登入" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: backgroundColor === 'green' ? 'linear-gradient(135deg, #2e7d32, #4caf50)' :
                      backgroundColor === 'blue' ? 'linear-gradient(135deg, #1976d2, #42a5f5)' :
                      backgroundColor === 'black' ? 'linear-gradient(135deg, #212121, #424242)' :
                      backgroundColor === 'red' ? 'linear-gradient(135deg, #d32f2f, #f44336)' :
                      backgroundColor === 'purple' ? 'linear-gradient(135deg, #7b1fa2, #9c27b0)' :
                      'linear-gradient(135deg, #2e7d32, #4caf50)',
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              flexGrow: 1,
            }}
            onClick={() => navigate('/')}
          >
            <Hiking sx={{ mr: 1, fontSize: 28 }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              健行路線記錄
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
              sx={{ 
                backgroundColor: isActive('/') ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
            >
              首頁
            </Button>
            
            <Button 
              color="inherit" 
              onClick={() => navigate('/trails')}
              sx={{ 
                backgroundColor: isActive('/trails') ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
            >
              路線探索
            </Button>
            
            <Button 
              color="inherit" 
              onClick={() => navigate('/achievements')}
              sx={{ 
                backgroundColor: isActive('/achievements') ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
            >
              成就系統
            </Button>

            {user ? (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/create-trail')}
                  sx={{ 
                    backgroundColor: isActive('/create-trail') ? 'rgba(255,255,255,0.1)' : 'transparent'
                  }}
                >
                  建立路線
                </Button>

                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handleNavigation('/profile')}>
                    <Person sx={{ mr: 1 }} />
                    個人資料
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    登出
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/login')}
                  sx={{ 
                    backgroundColor: isActive('/login') ? 'rgba(255,255,255,0.1)' : 'transparent'
                  }}
                >
                  登入
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/register')}
                  sx={{ 
                    backgroundColor: isActive('/register') ? 'rgba(255,255,255,0.1)' : 'transparent'
                  }}
                >
                  註冊
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;

