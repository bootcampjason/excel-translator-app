import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { defaultUserSchema } from "../utils/defaultUserSchema.ts";

function EmailAuthForm({ onClose }) {
  const [mode, setMode] = useState("login"); // 'login', 'signup', 'reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const showSnackbar = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const errorMsg = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address format.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/email-already-in-use":
        return "This email is already registered.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/missing-password":
        return "Password is required.";
      default:
        return "Incorrect email or password. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnack({ open: false, message: "", severity: "success" });

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(trimmedEmail)) {
      showSnackbar("Please enter a valid email address.", "error");
      return;
    }

    if (mode === "reset") {
      try {
        await sendPasswordResetEmail(auth, trimmedEmail);
        showSnackbar("Password reset email sent.");
        setMode("login");
      } catch (err) {
        showSnackbar(errorMsg(err.code), "error");
      }
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      showSnackbar(
        "Password must be at least 8 characters long and include uppercase, lowercase, and a special character.",
        "error"
      );
      return;
    }

    try {
      let result;
      if (mode === "login") {
        result = await signInWithEmailAndPassword(auth, trimmedEmail, password);

        if (!result.user.emailVerified) {
          await auth.signOut();
          showSnackbar(
            "Please verify your email first. Check your spam inbox",
            "error"
          );
          setShowResend(true);
          return;
        }

        console.log("[INFO] User logged in");
        showSnackbar("✅ Logged in successfully.");

        setTimeout(() => {
          onClose?.();
          navigate("/");
        }, 1000);
      } else {
        const result = await createUserWithEmailAndPassword(
          auth,
          trimmedEmail,
          password
        );
        await sendEmailVerification(result.user);
        await auth.signOut();
        console.log("[INFO] Created new user document");
        showSnackbar("✅ Account created! Please check your email to verify.");

        return;
      }

      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        // First time sign-up → create full doc
        await setDoc(userDocRef, defaultUserSchema(user.email));
        console.log("[INFO] Created new user document for", user.email);
      } else {
        // Returning user → update lastLogonTimestamp only
        await updateDoc(userDocRef, {
          lastLogonTimestamp: new Date(),
        });
      }
    } catch (err) {
      showSnackbar(errorMsg(err.code), "error");
    }
  };

  return (
    <>
      <Divider>Or</Divider>
      <Box component="form" onSubmit={handleSubmit} mt={3}>
        {mode === "reset" && (
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            Reset your password
          </Typography>
        )}

        {mode === "login" && (
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            Login with your email
          </Typography>
        )}

        {mode === "signup" && (
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            gutterBottom
          >
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

        {mode !== "reset" && (
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
          {mode === "login"
            ? "Log In"
            : mode === "signup"
            ? "Sign Up"
            : "Send Reset Link"}
        </Button>

        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          {mode !== "reset" ? (
            <>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() =>
                  setMode((prev) => (prev === "login" ? "signup" : "login"))
                }
              >
                {mode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account?"}
              </Link>

              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => setMode("reset")}
              >
                Forgot Password?
              </Link>
            </>
          ) : (
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => setMode("login")}
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default EmailAuthForm;
