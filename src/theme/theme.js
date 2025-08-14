// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

// --- Dark Theme ---
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4fd1c5' }, // Teal
    background: {
      default: '#1f2937', // Dark gray
      paper: '#374151', // Slightly lighter dark gray
    },
    text: {
      primary: '#e5e7eb', // Light text
      secondary: '#9ca3af', // Muted text
    },
  },
  typography: {
    fontFamily: 'sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
  },
  components: {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#4b5563', // gray-700
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '1rem 1.5rem',
          color: '#e5e7eb',
          borderBottom: '1px solid #4b5563',
        },
        head: {
          fontSize: '0.75rem',
          fontWeight: 'medium',
          color: '#d1d5db',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#4b5563',
          },
          transition: 'background-color 0.2s',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#374151',
          borderRadius: '16px',
        },
      },
    },
  },
});

// --- Bright Theme ---
export const brightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0d9488' }, // A darker teal for contrast
    background: {
      default: '#f9fafb', // Very light gray
      paper: '#ffffff', // White
    },
    text: {
      primary: '#1f2937', // Dark text for readability
      secondary: '#6b7280', // Muted dark text
    },
  },
  typography: {
    fontFamily: 'sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
  },
});
