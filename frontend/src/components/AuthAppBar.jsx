// src/components/AuthAppBar.jsx
import React, { useEffect, useState } from "react";
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
  Tooltip,
} from "@mui/material";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import FileSpeakLogoWhite from "../assets/images/FileSpeakLogo_white.png";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const PLANS = {
  free: 10000,
  starter: 50000,
  pro: 200000,
};

function AuthAppBar() {
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [message, setMessage] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [charUsed, setCharUsed] = useState(0);
  const [charLimit, setCharLimit] = useState(10000);

  const navigate = useNavigate();

  const fetchUsage = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const plan = data.plan || "free";
        const limit = PLANS[plan] || 10000;
        setCharUsed(data.charUsedThisMonth || 0);
        setCharLimit(limit);
      }
    } catch (error) {
      console.error("[ERROR] Failed to fetch user usage:", error);
    }
  };

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
      setMessage({
        open: true,
        message: "You have been signed out.",
        severity: "success",
      });
    } catch (err) {
      setMessage({
        open: true,
        message: "Logout failed. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSigningOut(false);
      setShowLogoutConfirm(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.uid) {
        fetchUsage(currentUser.uid);
      }
    });
    return () => unsub();
  }, []);

  return (
    <>
      <AppBar position="sticky" color="primary" elevation={3}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={FileSpeakLogoWhite}
                alt="FileSpeak logo"
                style={{ height: 36 }}
              />
            </Link>
          </Box>
          {!user ? (
            <Button
              variant="outlined"
              color="white"
              onClick={() => navigate("/login")}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 20,
              }}
            >
              Sign In
            </Button>
          ) : (
            <Box display="flex" alignItems="center" gap={3}>
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {charUsed.toLocaleString()} /{" "}
                      {charLimit.toLocaleString()} characters used
                    </Typography>
                  </Box>
                }
                placement="bottom"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "#333",
                      color: "#fff",
                      fontSize: "0.85rem",
                      borderRadius: 1.5,
                      boxShadow: 2,
                      px: 2,
                      py: 1.5,
                    },
                  },
                  arrow: {
                    sx: {
                      color: "#333",
                    },
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user.email}{" "}
                  <Typography
                    component="span"
                    variant="body2"
                    color="#d5dbdb"
                  >
                    ({charUsed.toLocaleString()} / {charLimit.toLocaleString()})
                  </Typography>
                </Typography>
              </Tooltip>

              <Button
                variant="contained"
                size="small"
                color="secondary"
                onClick={() => navigate('/upgrade')}
                sx={{
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 20,
                }}
              >
                Upgrade
              </Button>

              <Button
                color="inherit"
                onClick={() => setShowLogoutConfirm(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 20,
                }}
              >
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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
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
            size="large"
            color="primary"
            disabled={isSigningOut}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            size="large"
            color="error"
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Sign Out"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={message.open}
        autoHideDuration={3000}
        onClose={() => setMessage((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={message.severity} sx={{ width: "100%" }}>
          {message.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AuthAppBar;
