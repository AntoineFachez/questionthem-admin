// app/notificationsAndAlert/page.js
"use client";

import React from "react";
import { Box, IconButton, Typography } from "@mui/material";

import Widget from "./Widget";
import { useWidgetContext } from "./Context"; // Only import the hook
import Header from "../../components/header/Header";
import { headerProps } from "../../configs/pageProps";

export default function Page() {
  const {
    widgetData,

    activeStep,
    setActiveStep,
    updateWidgetData,
    header,
  } = useWidgetContext();
  const handleSetUiContext = (item) => {
    setActiveStep(item);
  };
  console.log("widgetData", widgetData);

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

      <Widget
        data={widgetData}
        activeStep={activeStep}
        handleSetUiContext={handleSetUiContext}
      />
    </Box>
  );
}
