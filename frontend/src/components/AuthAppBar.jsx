// src/components/AuthAppBar.jsx
import React, { useContext, useEffect, useState } from "react";
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
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import FileSpeakLogoWhite from "../assets/images/FileSpeakLogo_white.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { UserContext } from "../context/UserContext";

function AuthAppBar() {
  const { user, usage, currentPlan, loading } = useContext(UserContext);
  const { charUsed = 0, charLimit = 0 } = usage;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [message, setMessage] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const location = useLocation();

  console.log("[INFO] usage:", usage);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          lastSignoutTimestamp: new Date(),
        });
      }
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

  if (loading) {
    return (
      <AppBar position="sticky" color="primary" elevation={3}>
        <Toolbar>
          <Typography variant="body1">Loading...</Typography>
        </Toolbar>
      </AppBar>
    );
  }

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
                      {charUsed.toLocaleString()} / {charLimit.toLocaleString()}{" "}
                      characters used
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
                  <Typography component="span" variant="body2" color="#d5dbdb">
                    ({charUsed.toLocaleString()} / {charLimit.toLocaleString()})
                  </Typography>
                </Typography>
              </Tooltip>

              <Button
                variant="contained"
                size="small"
                color="secondary"
                onClick={() => navigate("/upgrade")}
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
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
