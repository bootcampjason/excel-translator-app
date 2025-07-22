import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthAppBar from "./components/AuthAppBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import UpgradePage from "./pages/UpgradePage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { UserContext } from "./context/UserContext";

function App() {
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState({ charUsed: 0, charLimit: 10000 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setUsage({
            charUsed: data.charUsed || 0,
            charLimit: data.charLimit || 10000,
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, usage, setUsage }}>
        <AuthAppBar /> {/* Show on every page */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
