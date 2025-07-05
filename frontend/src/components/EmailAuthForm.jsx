// src/components/EmailAuthForm.jsx
import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

function EmailAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {isSignup ? 'Create an Account' : 'Sign in with Email'}
      </Typography>

      <TextField
        fullWidth
        label="Email"
        type="email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <Typography color="error" variant="body2" mt={1}>
          {error}
        </Typography>
      )}

      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
        onClick={handleAuth}
      >
        {isSignup ? 'Create Account' : 'Sign In'}
      </Button>

      <Button
        fullWidth
        variant="text"
        sx={{ mt: 1, textTransform: 'none' }}
        onClick={() => setIsSignup(prev => !prev)}
      >
        {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
      </Button>
    </Box>
  );
}

export default EmailAuthForm;
