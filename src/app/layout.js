'use client';
import React from 'react';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import { UserProvider } from '../context/UserContext';
import { FirestoreDataProvider } from '../context/FirestoreDataContext';
import Navbar from '../components/navbar/Navbar';

// This is a static theme for a dark color palette.
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4fd1c5' }, // teal.400
    background: {
      default: '#1f2937', // gray-900
      paper: '#374151', // gray-700
    },
    text: {
      primary: '#e5e7eb', // gray-200
      secondary: '#9ca3af', // gray-400
    },
  },
  typography: {
    fontFamily: 'sans-serif',
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeProvider theme={darkTheme}>
        <Box
          component="body"
          sx={{
            height: '100%',
            bgcolor: 'background.default',
            m: 0,
            p: 0,
            boxSizing: 'border-box',
            color: 'text.primary',
            fontFamily: 'sans-serif',
          }}
        >
          <UserProvider>
            <FirestoreDataProvider>
              <Navbar />
              <Box
                component="main"
                // sx={{ maxWidth: 'lg', height: '100%', mx: 'auto', p: 4 }}
              >
                {children}
              </Box>
            </FirestoreDataProvider>
          </UserProvider>
        </Box>
      </ThemeProvider>
    </html>
  );
}
