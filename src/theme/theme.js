// src/theme/theme.js
import { createTheme } from "@mui/material/styles";
import { sharedComponents } from "./muiProps";

// --- Dark Theme ---
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5c6b73",
      dark: "#0e1929",
      light: "#9ccae9ff",
    }, //["0e1929","c2dfe3","9db4c0","5c6b73","253237"]
    secondary: { main: "#ffd400", dark: "#8F7700", light: "#d2ddab" }, //["ffd400","d2ddab","c2dfe3","95aeb5","0e1929"]
    background: {
      default: "#1f2937", // Dark gray
      paper: "#374151", // Slightly lighter dark gray
    },
    text: {
      primary: "#e5e7eb", // Light text
      secondary: "#9ca3af", // Muted text
    },
  },
  typography: {
    fontFamily: "sans-serif",
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
  },
  components: {
    ...sharedComponents,
  },
});

// --- Bright Theme ---
export const brightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0d9488" }, // A darker teal for contrast
    background: {
      default: "#f9fafb", // Very light gray
      paper: "#ffffff", // White
    },
    text: {
      primary: "#1f2937", // Dark text for readability
      secondary: "#6b7280", // Muted dark text
    },
  },
  typography: {
    fontFamily: "sans-serif",
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "#1f2937",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#1f2937",
    },
  },
  components: {
    ...sharedComponents,
  },
});
