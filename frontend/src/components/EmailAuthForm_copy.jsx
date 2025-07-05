// src/components/EmailAuthForm.jsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';

function EmailAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      // Try sign-in
      await signInWithEmailAndPassword(auth, email, password);
      setStatus({ loading: false, error: '', success: 'Signed in successfully!' });
    } catch (err) {
      // If user doesn't exist, try creating one
      if (err.code === 'auth/user-not-found') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          setStatus({ loading: false, error: '', success: 'Account created and signed in!' });
        } catch (signupError) {
          setStatus({ loading: false, error: signupError.message, success: '' });
        }
      } else {
        setStatus({ loading: false, error: err.message, success: '' });
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, textAlign: 'left' }}>
      {status.error && <Alert severity="error" sx={{ mb: 2 }}>{status.error}</Alert>}
      {status.success && <Alert severity="success" sx={{ mb: 2 }}>{status.success}</Alert>}

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Password"
        fullWidth
        margin="normal"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={status.loading}
        sx={{ mt: 2 }}
      >
        {status.loading ? <CircularProgress size={20} /> : 'Continue'}
      </Button>
    </Box>
  );
}

export default EmailAuthForm;
