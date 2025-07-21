import React from 'react';
import { Typography, Box, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

function PaymentCancel() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" px={2}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 480,
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffebee 0%, #ffffff 100%)',
        }}
      >
        <CancelOutlinedIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" fontWeight={600} color="error.main" gutterBottom>
          Payment Canceled
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Your payment was not completed. You can try again anytime.
        </Typography>
        <Button variant="outlined" size="large" color="primary" component={Link} to="/" sx={{ borderRadius: 3 }}>
          Return to Home
        </Button>
      </Paper>
    </Box>
  );
}

export default PaymentCancel;
