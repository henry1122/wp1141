import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Badge
} from '@mui/material';
import { School, ShoppingCart, Assignment } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

const Navigation: React.FC = () => {
  const { state } = useAppContext();

  const steps = [
    { label: '課程瀏覽', icon: <School /> },
    { label: '已選的課', icon: <ShoppingCart /> },
    { label: '提交記錄', icon: <Assignment /> }
  ];

  const getCurrentStepIndex = () => {
    switch (state.currentStep) {
      case 'browsing': return 0;
      case 'selection': return 1;
      case 'submission': return 2;
      default: return 0;
    }
  };

  // 計算總學分
  const getTotalCredits = () => {
    return state.selectedCourses.reduce((sum, sc) => sum + sc.course.credits, 0);
  };

  const totalCredits = getTotalCredits();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        '& .MuiToolbar-root': {
          minHeight: 72,
        }
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            p: 1,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <School sx={{ fontSize: 32, color: 'white' }} />
            <Typography variant="h5" component="div" sx={{ 
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              台大選課助理
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {state.selectedCourses.length > 0 && (
            <Badge 
              badgeContent={state.selectedCourses.length} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  minWidth: 20,
                  height: 20,
                }
              }}
            >
              <Chip
                icon={<ShoppingCart />}
                label={`已選的課 (${totalCredits} 學分)`}
                variant="outlined"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              />
            </Badge>
          )}
          
          {state.submittedRecords.length > 0 && (
            <Chip
              label={`已提交 ${state.submittedRecords.length} 筆記錄`}
              variant="outlined"
              sx={{ 
                bgcolor: 'rgba(76, 175, 80, 0.2)',
                color: 'white',
                borderColor: 'rgba(76, 175, 80, 0.5)',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(76, 175, 80, 0.3)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            />
          )}
        </Box>
      </Toolbar>
      
      <Box sx={{ px: 3, pb: 2 }}>
        <Stepper 
          activeStep={getCurrentStepIndex()} 
          alternativeLabel
          sx={{
            '& .MuiStepConnector-line': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
              borderWidth: 2,
            },
            '& .MuiStepConnector-active .MuiStepConnector-line': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
            },
            '& .MuiStepConnector-completed .MuiStepConnector-line': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
            }
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={step.icon}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  },
                  '& .MuiStepLabel-iconContainer': {
                    '& .MuiSvgIcon-root': {
                      color: index <= getCurrentStepIndex() ? 'white' : 'rgba(255, 255, 255, 0.5)',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }
                  }
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </AppBar>
  );
};

export default Navigation;
