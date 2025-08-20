// app/notificationsAndAlert/page.js
"use client";

import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

import { useWidgetContext } from "./Context";
import Widget from "./Widget";
import Title from "../../../components/title/Title";
import { titleProps } from "../../../theme/muiProps";

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Title props={{ ...titleProps, string: header }} />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexFlow: "row npwrap",
          alignItems: "center",
        }}
      >
        {activeUiContext && activeUiContext !== "steps" ? (
          <>
            <IconButton onClick={() => handleSetUiContext("step")}>
              <ArrowBack />
            </IconButton>

            <Typography variant="body1">{activeUiContext.href}</Typography>
          </>
        ) : (
          <Typography variant="body1">steps</Typography>
        )}
      </Box>
      <Widget />
    </Box>
  );
}
