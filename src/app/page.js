'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';

// Use the absolute path alias to fix the import errors.
// This assumes your jsconfig.json or tsconfig.json is set up correctly.
import Header from '../components/header/Header';
import AdminLoginForm from '../components/auth/AdminLogIn';

import { useUser } from '../context/UserContext';

export default function Home() {
  // Use the custom hook to access the context values.
  const { user, loading } = useUser();

  const headerProps = {
    string: 'Home',
    variant: 'h1',
    sx: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
  };

  // Display a loading state while authentication is in progress.
  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <Header props={headerProps} />
      {/* Conditionally render content based on the user state */}
      {user ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          Welcome {user.email || 'Admin'}
        </Typography>
      ) : (
        <AdminLoginForm />
      )}
    </Box>
  );
}
