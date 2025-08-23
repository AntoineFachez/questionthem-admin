// src/lib/registries/layout-library.js
import React from "react";
import { Box } from "@mui/material";

// A simple vertical list layout
const ListLayout = ({ children, props }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, ...props?.sx }}>
    {children}
  </Box>
);

// A more complex layout for a dashboard
const DashboardLayout = ({ header, main, sidebar, ...props }) => {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
      {...props}
    >
      <Box component="header" sx={{ p: 2, borderBottom: "1px solid grey" }}>
        {header}
      </Box>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {main}
        </Box>
        <Box
          component="aside"
          sx={{ width: 300, p: 3, borderLeft: "1px solid grey" }}
        >
          {sidebar}
        </Box>
      </Box>
    </Box>
  );
};

export const layoutRegistry = {
  List: ListLayout,
  Dashboard: DashboardLayout,
};
