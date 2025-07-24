// src/components/PlanCard.jsx
import React, { useContext, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import { UserContext } from "../context/UserContext";

function PlanCard({ plan }) {
  const { user, usage, setUsage } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      alert("Please sign in first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user.uid,
          },
          body: JSON.stringify({
            uid: user.uid,
            plan: plan.name.toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert("Something went wrong.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isFree = plan.name.toLowerCase() === "free";
  const isPro = plan.name.toLowerCase() === "pro";

  return (
    <Card
      elevation={4}
      sx={{
        minWidth: 275,
        maxWidth: 320,
        borderRadius: 3,
        p: 2,
        background: !isFree
          ? "linear-gradient(135deg, #dcedc8 0%, #ffffff 100%)"
          : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
        border: isPro ? "2px solid #66bb6a" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6" fontWeight={600}>
            {plan.name}
          </Typography>
          {!isFree && plan.name.toLowerCase() === "pro" && (
            <Chip label="Most Popular" color="primary" size="small" />
          )}
        </Box>

        <Typography
          variant="h4"
          fontWeight={700}
          color="primary.main"
          gutterBottom
        >
          {plan.price}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary">
          {isFree
            ? `${plan.characters.toLocaleString()} characters (included)`
            : `+${plan.characters.toLocaleString()} characters`}
        </Typography>
      </CardContent>

      {!isFree ? (
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleUpgrade}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          {loading ? (
            <>
              <CircularProgress color="white" size={18} sx={{ mr: 1 }} />
              Redirecting...
            </>
          ) : (
            "Buy Now"
          )}
        </Button>
      ) : (
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 2, borderRadius: 2 }}
          disabled
        >
          Free
        </Button>
      )}
    </Card>
  );
}

export default PlanCard;
