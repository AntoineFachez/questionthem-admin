// src/lib/registries/molecule-library.js
import React from "react";
import { Box, Link as MuiLink, Table } from "@mui/material";
import Title from "../../../components/title/Title";
// A registry that maps component names from the server to their React components
export const moleculeRegistry = {
  container: ({ children, props }) => <Box {...props}>{children}</Box>,

  Header: Title,
  Table: Table,
};
