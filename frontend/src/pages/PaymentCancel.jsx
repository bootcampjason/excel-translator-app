import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function PaymentCancel() {
  return (
    <Box textAlign="center" mt={10} px={2}>
      <Typography variant="h4" gutterBottom color="error">
        ❌ Payment Canceled
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={4}>
        Your payment was not completed. You can try again any time.
      </Typography>
      <Button variant="outlined" color="primary" component={Link} to="/">
        Return to Home
      </Button>
    </Box>
  );
}

export default PaymentCancel;
