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
export function ScreenLayout({ header, sideBar, menu, main }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        // backgroundColor: "secondary.dark",
      }}
    >
      {/* Header Slot */}
      <Box component="header" sx={{ width: "100%", zIndex: 1 }}>
        {header}
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexFlow: "row nowrap",
          // backgroundColor: "secondary.dark",
        }}
      >
        {/* Sidebar Content Slot */}
        <Box component="" sx={{ width: "fit-content", zIndex: 1 }}>
          {sideBar}
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
          <Box
            component=""
            sx={{
              width: "100%",
              height: "fit-content",
              padding: 2,
              display: "flex",
              gap: 2,
              borderBottom: 1,
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            {menu}
          </Box>
          <Container maxWidth="lg">{main}</Container>
        </Box>
      </Box>
    </Box>
  );
}

export default ScreenLayout;
