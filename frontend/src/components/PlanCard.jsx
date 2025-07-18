// src/components/PlanCard.jsx
import React, { useContext } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { UserContext } from "../context/UserContext";

function PlanCard({ plan }) {
  const { user } = useContext(UserContext);
  const handleUpgrade = async () => {
    if (!user) {
      alert("Please sign in first.");
      return;
    }
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
            priceId: plan.stripePriceId,
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
    }
  };

  return (
    <Card sx={{ minWidth: 275, maxWidth: 320 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {plan.name}
        </Typography>
        <Typography variant="h4" fontWeight={600}>
          {plan.price}
        </Typography>
        <Typography variant="body2" mt={1}>
          {plan.characters} characters/month
        </Typography>
        <Box mt={3}>
          {plan.name.toLowerCase() !== "free" && (
            <Button variant="contained" fullWidth onClick={handleUpgrade}>
              Buy Now
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default PlanCard;
