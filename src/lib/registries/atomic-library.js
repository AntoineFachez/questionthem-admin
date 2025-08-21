// filename: components/atomic-library.js
import React from "react";
import { Box, Typography } from "@mui/material";
import Title from "../../components/title/Title";
// This registry holds only the most basic, universal components.
export const atomicRegistry = {
  Box: ({ children, props }) => <Box {...props}>{children}</Box>,
  Typography: ({ children, props }) => (
    <Typography {...props}>{children}</Typography>
  ),
  Header: Title,
};
