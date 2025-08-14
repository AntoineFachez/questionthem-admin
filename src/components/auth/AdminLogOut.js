'use client';

import React from 'react';
import { useUser } from '../../context/UserContext'; // Corrected the path to use the alias

// A component for a secure admin logout button.
export default function AdminLogOut() {
  // Use the custom hook to get the logout function and loading state from the context.
  const { logout, loading } = useUser();

  /**
   * Handles the logout process by calling the logout function from the context.
   */
  const handleLogout = async () => {
    // The logout function from the context handles the Firebase signOut process.
    await logout();
  };

  return (
    <div className="p-4">
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full sm:w-auto bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        {loading ? 'Logging out...' : 'Log Out'}
      </button>
    </div>
  );
}
