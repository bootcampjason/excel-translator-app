import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { auth, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    const email = prompt("Email:");
    const password = prompt("Password:");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        alert(err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box textAlign="center" mt={8}>
      <Typography variant="h4" gutterBottom>Sign In to FileSpeak</Typography>
      <Button variant="contained" sx={{ m: 1 }} onClick={handleEmailLogin}>
        Login with Email
      </Button>
      <Button variant="contained" sx={{ m: 1 }} onClick={handleGoogleLogin}>
        Continue with Google
      </Button>
    </Box>
  );
}

export default LoginPage;
