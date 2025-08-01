import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthAppBar from "./components/AuthAppBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import UpgradePage from "./pages/UpgradePage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

function App() {
  return (
    <>
        <AuthAppBar /> {/* Show on every page */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </>
  );
}

export default App;
