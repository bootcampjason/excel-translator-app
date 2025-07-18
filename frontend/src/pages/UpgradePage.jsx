import React from "react";
import PlanCard from "../components/PlanCard";
import { Box, Typography } from "@mui/material";
import { PLANS } from "../constants/plans";

const { free, starter, pro } = PLANS;

const plans = [
  {
    name: free.name,
    price: `$${free.monthlyPrice}`,
    characters: free.maxCharacters,
    stripePriceId: null,
  },
  {
    name: starter.name,
    price: `$${starter.monthlyPrice}`,
    characters: starter.maxCharacters,
    stripePriceId: process.env.REACT_APP_STRIPE_STARTER_PRICE_ID,
  },
  {
    name: pro.name,
    price: `$${pro.monthlyPrice}`,
    characters: pro.maxCharacters,
    stripePriceId: process.env.REACT_APP_STRIPE_PRO_PRICE_ID,
  },
];

function UpgradePage() {
  return (
    <Box sx={{ mt: 6, px: 2, maxWidth: 900, margin: "0 auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Upgrade Your Plan
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        mb={4}
      >
        Choose a plan to increase your monthly character limit
      </Typography>
      <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </Box>
    </Box>
  );
}

export default UpgradePage;
