import React from 'react';
import { Typography, Box, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function PaymentSuccess() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" px={2}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 480,
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)',
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
        <Typography variant="h4" fontWeight={600} color="success.main" gutterBottom>
          Payment Successful
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Thank you for upgrading your plan. You now have access to premium features.
        </Typography>
        <Button variant="contained" size="large" color="success" component={Link} to="/" sx={{ borderRadius: 3 }}>
          Go to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}

export default PaymentSuccess;
