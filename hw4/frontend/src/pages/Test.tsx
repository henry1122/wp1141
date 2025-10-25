import React from 'react';
import { Box, Typography } from '@mui/material';

const Test: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">測試頁面</Typography>
      <Typography>如果您看到這個頁面，說明應用程式正在運行。</Typography>
    </Box>
  );
};

export default Test;

