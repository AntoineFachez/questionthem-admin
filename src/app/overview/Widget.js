"use client";

import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { renderComponent } from "../../core/Renderer";
import { useSduiBlueprint } from "../../context/SduiContext";

export default function Widget({
  blueprintId,
  context,
  data,
  activeStep,
  handleSetUiContext,
}) {
  const { blueprint, loading, error } = useSduiBlueprint(blueprintId);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  if (!blueprintId) {
    return <Box>Please provide a Blueprint ID</Box>;
  }
  if (!blueprint) {
    return <Box>Blueprint not found for ID: {blueprintId}</Box>;
  }

  return renderComponent(blueprint, context);
}
