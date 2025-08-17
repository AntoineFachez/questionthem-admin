// app/notificationsAndAlert/page.js
"use client";

import React from "react";
import { Box, IconButton, Typography } from "@mui/material";

import { useWidgetContext } from "./Context"; // Only import the hook
import Header from "../../../components/header/Header";
import { headerProps } from "../../../configs/pageProps";
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
    header,
  } = useWidgetContext();

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
      <Header props={{ ...headerProps, string: header }} />
      <WidgetMenu activeUiContext={activeUiContext} />
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
