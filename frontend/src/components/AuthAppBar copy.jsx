import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function AuthAppBar() {
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
      setSnack({ open: true, message: 'You have been signed out.', severity: 'success' });
    } catch (err) {
      setSnack({ open: true, message: 'Logout failed. Please try again.', severity: 'error' });
    } finally {
      setIsSigningOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <>
      <AppBar position="sticky" color="primary" elevation={3}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            FileSpeak
          </Typography>

          {!user ? (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Sign in
            </Button>
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2">{user.email}</Typography>
              <Button color="inherit" onClick={() => setShowLogoutConfirm(true)}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={showLogoutConfirm}
        onClose={() => !isSigningOut && setShowLogoutConfirm(false)}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          },
        }}
      >
        <DialogTitle>Confirm Sign Out</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to sign out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowLogoutConfirm(false)}
            color="primary"
            disabled={isSigningOut}
          >
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error" disabled={isSigningOut}>
            {isSigningOut ? <CircularProgress size={20} color="inherit" /> : 'Sign Out'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
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

export default AuthAppBar;
