// src/lib/registries/screen-library.js
import React from "react";
import ScreenLayout from "../../components/screenLayout/ScreenLayout";
import { Box } from "@mui/material";

// A registry that maps component names from the server to their React components
export const screenRegistry = {
  container: ({ children, props }) => <Box {...props}>{children}</Box>,
  ScreenLayout: ScreenLayout,
};
