// app/notificationsAndAlert/page.js
"use client";

import React from "react";
import { Box, IconButton, Typography } from "@mui/material";

import { useWidgetContext } from "./Context"; // Only import the hook
import Title from "../../../components/title/Title";
import { titleProps } from "../../../theme/muiProps";
import WidgetMenu from "../../../components/menus/WidgetMenu";

import Widget from "./Widget";

export default function Page() {
  const {
    widgetData,
    activeUiContext,
    setActiveUiContext,
    activeStep,
    setActiveStep,
    updateWidgetData,
    title,
  } = useWidgetContext();

  const handleSetUiContext = (item) => {
    setActiveUiContext(item.href);
    setActiveStep(item);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Title props={{ ...titleProps, string: title }} />
      {/* <WidgetMenu activeUiContext={activeUiContext} /> */}
      <Widget
        data={widgetData.sections}
        activeUiContext={activeUiContext}
        setActiveUiContext={setActiveUiContext}
        activeStep={activeStep}
        handleSetUiContext={handleSetUiContext}
      />
    </Box>
  );
}
