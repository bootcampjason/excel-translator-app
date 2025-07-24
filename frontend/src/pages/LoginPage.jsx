import React, { useState } from "react";
import { Button, Box, Typography, Paper, Fade, Snackbar, Alert } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import EmailAuthForm from "../components/EmailAuthForm";
import GoogleLogo from "../assets/images/google_logo.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { defaultUserSchema } from "../utils/defaultUserSchema.ts";

function LoginPage({ onClose }) {
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // If user logins for the first time
        await setDoc(userDocRef, defaultUserSchema(user.email));
        console.log("[INFO] Created new user document");
        showSnackbar("✅ Account created! You are now signed in.");
      }
      await updateDoc(userDocRef, {
        lastLogonTimestamp: new Date(),
      });
      console.log("[INFO] User logged in");
      showSnackbar("✅ Logged in successfully.");
      setTimeout(() => {
        onClose?.();
        navigate("/");
      }, 1000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box
      sx={{
        mt: 10,
        mx: "auto",
        maxWidth: 400,
        borderRadius: 3,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        background: "linear-gradient(135deg, #ffffff,rgb(233, 240, 247))", // bright modern background
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          textAlign: "center",
          background: "#fcffff",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Sign In to FileSpeak
        </Typography>
        <Button
          variant="contained"
          color="googleLight"
          fullWidth
          onClick={handleGoogleLogin}
          sx={{
            my: 2,
            fontWeight: 500,
            fontSize: "1rem",
          }}
        >
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
            sx={{
              mt: 0,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            Login with Email
          </Button>
        )}

        <Fade in={showEmailForm}>
          <div>{showEmailForm && <EmailAuthForm />}</div>
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
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LoginPage;
