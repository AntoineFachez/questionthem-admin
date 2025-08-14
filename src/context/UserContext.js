'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  signOut, // <-- New import
} from 'firebase/auth';

// Your public Firebase config variables from Next.js environment.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// Initialize Firebase only once outside of the component to prevent re-initialization.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create the context with an initial state.
const UserContext = createContext(null);

/**
 * The UserProvider component manages the user's authentication state and provides it to the app.
 * It handles login and keeps the user state up to date in real-time.
 * @param {object} children - The components that will have access to the user context.
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Logs in a user using a custom authentication token from the backend.
   * This is designed for an admin dashboard where the backend generates the token.
   * @param {string} customToken - The secure token received from the backend API.
   */
  const loginWithToken = async (customToken) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithCustomToken(auth, customToken);
    } catch (e) {
      console.error('Error signing in with custom token:', e);
      setError(e.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs out the currently authenticated user.
   * This function signs the user out of the Firebase session.
   */
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Error signing out:', e);
      setError(e.message || 'An error occurred during sign out.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set up the authentication state listener. This listens for user sign-in/sign-out events.
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts.
    return () => unsubscribe();
  }, []);

  // The value object to be provided to components using the context.
  const contextValue = {
    user,
    loading,
    error,
    loginWithToken,
    logout, // <-- New function added to the context value
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

/**
 * A custom hook to easily consume the UserContext.
 * Throws an error if used outside of a UserProvider.
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider.');
  }
  return context;
}
