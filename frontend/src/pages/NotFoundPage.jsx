// src/pages/NotFoundPage.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FileSpeakLogo from '../assets/images/FileSpeakLogo.png'; // Adjust path if needed

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      sx={{
        backgroundColor: '#f4f9f5',
        px: 3,
        py: 6,
      }}
    >
      <img
        src={FileSpeakLogo}
        alt="FileSpeak Logo"
        style={{
          height: 100,
          marginBottom: 24,
        }}
      />
      <ErrorOutlineIcon sx={{ fontSize: 72, color: 'error.main', mb: 2 }} />
      <Typography variant="h3" fontWeight={700} gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 500, mb: 4 }}>
        Oops! The page you’re looking for doesn’t exist. It might have been moved or deleted.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/')}
        sx={{
          borderRadius: 20,
          px: 4,
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        Return to Homepage
      </Button>
    </Box>
  );
}

export default NotFoundPage;
