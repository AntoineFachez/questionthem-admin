// src/components/auth/AdminLogin.js
"use client";

import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { useUser } from "../../context/UserContext";

// A complete React component for a secure admin login form.
export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use the custom hook to get the login function from the context.
  const { app } = useUser();

  /**
   * Handles the form submission by sending user credentials to a backend API route.
   * @param {Event} e The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Authenticate with Firebase on the client
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Step 2: Get the ID token for server-side verification
      const idToken = await user.getIdToken();

      // Step 3: Send the token to your API route using fetch
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // If response is not 2xx, handle it as an error
        throw new Error(responseData.message || "Authorization failed.");
      }

      // If successful, the onAuthStateChanged listener in UserProvider
      // has already updated the global user state.
      // You can now redirect the user or update the UI.
      console.log("Admin authorization successful!");
      // Example: router.push('/admin/dashboard');
    } catch (e) {
      console.error("Error during login:", e);
      // Sign out the user if the server-side admin check fails
      const auth = getAuth(app);
      if (auth.currentUser) {
        await auth.signOut();
      }

      // Handle specific Firebase auth errors
      if (e.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        // Handle custom errors from your API or other exceptions
        setError(
          e.message || "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 font-sans p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-teal-400 mb-8">
          Admin Dashboard Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              required
            />
          </div>
          {error && (
            <div className="mb-4 text-red-400 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            This is a backend-only login. No user registration is available.
          </p>
        </div>
      </div>
    </div>
  );
}
