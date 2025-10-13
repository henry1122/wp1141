import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Chip
} from '@mui/material';
import { School, ShoppingCart, Assignment } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

const Navigation: React.FC = () => {
  const { state } = useAppContext();

  const steps = [
    { label: '課程瀏覽', icon: <School /> },
    { label: '選課清單', icon: <ShoppingCart /> },
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

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          台大選課系統
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {state.selectedCourses.length > 0 && (
            <Chip
              label={`已選 ${state.selectedCourses.length} 門課程`}
              color="secondary"
              size="small"
            />
          )}
          
          {state.submittedRecords.length > 0 && (
            <Chip
              label={`已提交 ${state.submittedRecords.length} 筆記錄`}
              color="success"
              size="small"
            />
          )}
        </Box>
      </Toolbar>
      
      <Box sx={{ px: 2, pb: 1 }}>
        <Stepper activeStep={getCurrentStepIndex()} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={step.icon}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '0.875rem'
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










