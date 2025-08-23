"use client";

import React from "react";
import { Box, CircularProgress } from "@mui/material";
// import { renderComponent } from "../../core/Renderer";
import { useSduiBlueprint } from "../../context/SduiContext";

export default function Widget({
  uiBlueprintId,
  context,
  data,
  activeStep,
  handleSetUiContext,
}) {
  const { uiBlueprint, loading, error } = useSduiBlueprint(uiBlueprintId);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  if (!uiBlueprintId) {
    return <Box>Please provide a Blueprint ID</Box>;
  }
  if (!uiBlueprint) {
    return <Box>Blueprint not found for ID: {uiBlueprintId}</Box>;
  }

  // return renderComponent(uiBlueprint, context);
}
