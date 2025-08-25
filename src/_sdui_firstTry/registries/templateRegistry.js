// src/lib/registries/screen-library.js
import React from "react";
import { Box } from "@mui/material";
import ScreenLayout from "../../components/screenLayout/ScreenLayout";

// A registry that maps component names from the server to their React components
export const templateRegistry = {
  ScreenLayout: ScreenLayout,
};
