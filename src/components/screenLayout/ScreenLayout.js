import React from "react";
import { Box, Container } from "@mui/material";

/**
 * A basic screen layout component with slots for a header and main content.
 * It provides a consistent page structure.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.header - The component to render in the header slot.
 * @param {React.ReactNode} props.main - The component to render in the main content area.
 * @returns {React.Component} The rendered layout.
 */
export function ScreenLayout({ header, main }) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        // backgroundColor: "secondary.dark",
      }}
    >
      {/* Header Slot */}
      <Box component="header" sx={{ width: "100%", zIndex: 1 }}>
        {header}
      </Box>

      {/* Main Content Slot */}
      <Box
        component="main"
        sx={{
          width: "100%",
          height: "100%",
          flexGrow: 1,
          py: 4, // Add some vertical padding
          overflow: "auto",
        }}
      >
        <Container maxWidth="lg">{main}</Container>
      </Box>
    </Box>
  );
}

export default ScreenLayout;
