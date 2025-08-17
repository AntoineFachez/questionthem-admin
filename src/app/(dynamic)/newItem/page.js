// app/notificationsAndAlert/page.js
"use client";

import React from "react";
import { Box, IconButton, Typography } from "@mui/material";

import { useWidgetContext } from "./Context"; // Only import the hook
import Widget from "./Widget";

export default function Page() {
  const { widgetData } = useWidgetContext();

  const handleSetUiContext = (item) => {
    setActiveUiContext(item.href);
    setActiveStep(item);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Widget
        data={widgetData.steps}
        activeUiContext={activeUiContext}
        setActiveUiContext={setActiveUiContext}
        activeStep={activeStep}
        handleSetUiContext={handleSetUiContext}
      />
    </Box>
  );
}
