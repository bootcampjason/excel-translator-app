import React, { useState } from 'react';
import { Button, Box, Typography, Paper, Fade } from '@mui/material';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import EmailAuthForm from '../components/EmailAuthForm';
import GoogleLogo from '../assets/images/google_logo.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function LoginPage() {
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box
      sx={{
        mt: 10,
        mx: 'auto',
        maxWidth: 400,
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'linear-gradient(135deg, #ffffff,rgb(233, 240, 247))', // bright modern background
      }}
    >
      <Paper elevation={3} sx={{
        p: 4,
        maxWidth: 400,
        textAlign: 'center',
        background: '#fcffff'
      }}>
        <Typography variant="h5" gutterBottom>
          Sign In to FileSpeak
        </Typography>
        <Button
          variant="contained"
          color="googleLight"
          fullWidth onClick={handleGoogleLogin}
          sx={{
            my: 2,
            fontWeight: 500,
            fontSize: '1rem',
          }}>
          <img
            src={GoogleLogo}
            alt="Google"
            style={{ width: 30, height: 30 }}
          />
          Login with Google
        </Button>
        {!showEmailForm && (
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setShowEmailForm(true)}
            sx={{ mt: 0, textTransform: 'none', fontWeight: 500, fontSize: '1rem', }}
          >
            Login with Email
          </Button>
        )}

        <Fade in={showEmailForm}>
          <div>
            {showEmailForm && <EmailAuthForm />}
          </div>
        </Fade>
        <Box display="flex" justifyContent="flex-start">
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;
