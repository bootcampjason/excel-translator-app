// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // User object from Firebase Auth
  const [userDoc, setUserDoc] = useState(null); // User document from Firestore
  const [usage, setUsage] = useState({});
  const [currentPlan, setCurrentPlan] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) { // User is signed in
        setUser(firebaseUser)
        const userDocRef = doc(db, 'users', firebaseUser.uid);

        // Add listener for realtime updates on changes in the user document
        const unsubscribeSnapshot = onSnapshot(userDocRef, (userSnap) => {

          if (userSnap.exists()) {
            const data = userSnap.data();

            setUserDoc(data);
            setCurrentPlan(data.currentPlan || "free");
            setUsage({
              charUsed: data.charUsed || 0,
              charLimit: data.charLimit || 0,
            });
          }
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else { // User is signed out
        setUser(null);
        setUserDoc(null);
        setUsage({});
        setCurrentPlan("free");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, userDoc, usage, setUsage, currentPlan, loading }}>
      {children}
    </UserContext.Provider>
  );
}
