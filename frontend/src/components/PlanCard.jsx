// src/components/PlanCard.jsx
import React, { useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import { UserContext } from "../context/UserContext";

function PlanCard({ plan, isActive }) {
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
            plan: plan.name,
          }),
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isFree = plan.name.toLowerCase() === "free";

  return (
    <Card
      elevation={isActive ? 6 : 4}
      sx={{
        minWidth: 275,
        maxWidth: 320,
        borderRadius: 3,
        p: 2,
        background: isActive
          ? "linear-gradient(135deg, #dcedc8 0%, #ffffff 100%)"
          : isFree
          ? "linear-gradient(135deg, #f1f8e9 0%, #ffffff 100%)"
          : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
        border: isActive ? "2px solid #66bb6a" : "none",
        transform: isActive ? "scale(1.02)" : "none",
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
            ? `${plan.characters.toLocaleString()} characters/month`
            : `Includes ${plan.characters.toLocaleString()} character tokens`}
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
          Buy Now
        </Button>
      ) : (
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleUpgrade}
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
