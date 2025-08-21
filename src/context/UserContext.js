"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
} from "firebase/auth";

// Your public Firebase config variables from Next.js environment.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once, and only if the API key is provided.
// This prevents the build from crashing during prerendering.
const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;

// Create the context with an initial state.
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loginWithToken = async (customToken) => {
    setLoading(true);
    setError(null);
    try {
      if (auth) {
        await signInWithCustomToken(auth, customToken);
      } else {
        throw new Error("Firebase Auth not initialized.");
      }
    } catch (e) {
      console.error("Error signing in with custom token:", e);
      setError(e.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.error("Error signing out:", e);
      setError(e.message || "An error occurred during sign out.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        setUser(authUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const contextValue = { app, user, loading, error, loginWithToken, logout };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider.");
  }
  return context;
}
