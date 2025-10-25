import React from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
} from '@mui/material';

const EditTrail: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        編輯路線
      </Typography>
      
      <Alert severity="info">
        路線編輯功能正在開發中。
      </Alert>
    </Container>
  );
};

export default EditTrail;


