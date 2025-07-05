// src/components/AuthAppBar.jsx
import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { auth, googleProvider } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import FileSpeakLogoWhite from '../assets/images/FileSpeakLogo_white.png';
import { Link } from 'react-router-dom';

function AuthAppBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleEmailLogin = async () => {
    const email = prompt("Email:");
    const password = prompt("Password:");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        alert(err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <AppBar position="sticky" color="primary" elevation={3}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img
              src={FileSpeakLogoWhite}
              alt="FileSpeak logo"
              style={{ height: 36 }}
            />
          </Link>
        </Box>
        {!user ? (
          <Box>
            <Button color="inherit" onClick={handleEmailLogin}>
              Login / Signup
            </Button>
            <Button color="inherit" onClick={handleGoogleLogin}>
              Google
            </Button>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">
              {user.email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default AuthAppBar;
