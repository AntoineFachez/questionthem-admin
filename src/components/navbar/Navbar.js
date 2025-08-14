import React from 'react';
import { Box, Typography } from '@mui/material';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';

import { useUser } from '../../context/UserContext';

export default function Navbar() {
  const { user, loading } = useUser();
  return (
    <Box
      component="nav"
      sx={{ bgcolor: 'grey.800', color: 'white', p: 2, boxShadow: 3 }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 'lg',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          <MuiLink
            component={Link}
            href="/"
            color="inherit"
            underline="none"
            sx={{
              transition: 'color 0.3s ease-in-out',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            Admin Dashboard
          </MuiLink>
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', gap: 4 }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              color="inherit"
              underline="none"
              sx={{
                transition: 'color 0.3s ease-in-out',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Dashboard
            </MuiLink>
            <MuiLink
              component={Link}
              href="/user"
              color="inherit"
              underline="none"
              sx={{
                transition: 'color 0.3s ease-in-out',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Users
            </MuiLink>
            <MuiLink
              component={Link}
              href="/settings"
              color="inherit"
              underline="none"
              sx={{
                transition: 'color 0.3s ease-in-out',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Settings
            </MuiLink>
          </Box>
        )}
      </Box>
    </Box>
  );
}
