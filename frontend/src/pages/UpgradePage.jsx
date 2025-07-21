// src/pages/UpgradePage.jsx
import React, { useContext } from "react";
import PlanCard from "../components/PlanCard";
import { Box, Typography, Container, Divider } from "@mui/material";
import { PLANS } from "../constants/plans";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";

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
    stripePriceId: process.env.REACT_APP_STRIPE_STRIPE_STARTER_PRICE_ID,
  },
  {
    name: pro.name,
    price: `$${pro.monthlyPrice}`,
    characters: pro.maxCharacters,
    stripePriceId: process.env.REACT_APP_STRIPE_STRIPE_PRO_PRICE_ID,
  },
];

function UpgradePage() {
  const { user } = useContext(UserContext);
  const currentPlan = user?.plan?.toLowerCase?.() || "free";
  
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f9fafc", py: 8, px: 2 }}>
      <Container maxWidth="md">
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Upgrade Your Plan
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Choose a plan to increase your monthly character limit
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              <PlanCard plan={plan} isActive={plan.name.toLowerCase() === currentPlan} />
            </motion.div>
          ))}
        </Box>

        <Divider sx={{ mt: 8, mb: 4 }} />

        <Typography variant="body2" align="center" color="text.secondary">
          💡 Upgraded plans unlock more translation characters. You can upgrade
          anytime.
        </Typography>
      </Container>
    </Box>
  );
}

export default UpgradePage;
