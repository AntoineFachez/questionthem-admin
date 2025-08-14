'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';

import { useUser } from '../../context/UserContext';
import Header from '../../components/header/Header';
import AdminLoginForm from '../../components/auth/AdminLogIn';

export default function Dashboard() {
  const { user, loading } = useUser();
  const headerProps = {
    string: 'User',
    variant: 'h1',
    sx: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
  };
  return (
    <Box
      sx={{
        width: '100%',
        // height: '100%',
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <Header props={headerProps} />
    </Box>
  );
}
