import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Snackbar,
  Alert,
} from '@mui/material';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function EmailAuthForm({ onClose }) {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  const showSnackbar = (message, severity = 'success') => {
    setSnack({ open: true, message, severity });
  };

  const errorMsg = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/missing-password':
        return 'Password is required.';
      default:
        return 'Incorrect email or password. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnack({ open: false, message: '', severity: 'success' });

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      showSnackbar('Email is required.', 'error');
      return;
    }

    if (mode === 'reset') {
      try {
        await sendPasswordResetEmail(auth, trimmedEmail);
        showSnackbar('Password reset email sent.');
        setMode('login');
      } catch (err) {
        showSnackbar(errorMsg(err.code), 'error');
      }
      return;
    }

    if (password.length < 6) {
      showSnackbar('Password must be at least 6 characters long.', 'error');
      return;
    }

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
        showSnackbar('✅ Logged in successfully.');
      } else {
        await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        showSnackbar('✅ Account created! You are now signed in.');
      }

      setTimeout(() => {
        onClose?.();
        navigate('/');
      }, 1000);
    } catch (err) {
      showSnackbar(errorMsg(err.code), 'error');
    }
  };

  return (
    <>
    <Divider>Or</Divider>
      <Box component="form" onSubmit={handleSubmit} mt={3}>

        {mode === 'reset' && (
          <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
            Reset your password
          </Typography>
        )}

        {mode === 'login' && (
          <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
            Login with your email
          </Typography>
        )}

        {mode === 'signup' && (
          <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
            Create new account 
          </Typography>
        )}

        <TextField
          fullWidth
          type="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        {mode !== 'reset' && (
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}

        <Button type="submit" fullWidth variant="contained" color="primary">
          {mode === 'login'
            ? 'Log In'
            : mode === 'signup'
              ? 'Sign Up'
              : 'Send Reset Link'}
        </Button>

        <Box mt={2} display="flex" justifyContent="space-between" flexWrap="wrap">
          {mode !== 'reset' ? (
            <>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() =>
                  setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
                }
              >
                {mode === 'login'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account?'}
              </Link>

              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => setMode('reset')}
              >
                Forgot Password?
              </Link>
            </>
          ) : (
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => setMode('login')}
            >
              Back to login
            </Link>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default EmailAuthForm;
