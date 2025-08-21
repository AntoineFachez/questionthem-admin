// src/components/ui-library.js

import React from "react";
import { Box, Button, Typography, Link as MuiLink } from "@mui/material";
import NextLink from "next/link";

// A registry that maps component names from the server to their React components
export const componentRegistry = {
  container: ({ children, props }) => <Box {...props}>{children}</Box>,
  typography: ({ children, props }) => (
    <Typography {...props}>{children}</Typography>
  ),
  linkButton: ({ props: { title, navigateTo } }) => (
    <MuiLink
      component={NextLink}
      href={navigateTo}
      color="primary.main"
      underline="none"
      sx={{
        width: "10rem",
        height: "10rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          color: "white",
          backgroundColor: "primary.main",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
        },
        backgroundColor: "white",
        borderRadius: "8px",
        border: "2px solid",
        borderColor: "primary.main",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Typography variant="h5">{title}</Typography>
    </MuiLink>
  ),
};
