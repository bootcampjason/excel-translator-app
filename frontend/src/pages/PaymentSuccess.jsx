import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function PaymentSuccess() {
  return (
    <Box textAlign="center" mt={10} px={2}>
      <Typography variant="h4" gutterBottom color="green">
        ✅ Payment Successful!
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={4}>
        Thank you for upgrading your plan. You now have access to premium features.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/">
        Go to Dashboard
      </Button>
    </Box>
  );
}

export default PaymentSuccess;
