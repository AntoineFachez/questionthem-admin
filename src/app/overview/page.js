// app/notificationsAndAlert/page.js
"use client";

import React from "react";
import { Box, IconButton, Typography } from "@mui/material";

import Widget from "./Widget";
import { useWidgetContext } from "./Context"; // Only import the hook
import Title from "../../components/title/Title";
import { titleProps } from "../../theme/muiProps";

export default function Page() {
  const {
    widgetData,

    activeStep,
    setActiveStep,
    updateWidgetData,
    title,
  } = useWidgetContext();
  const handleSetUiContext = (item) => {
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
      <Title props={{ ...titleProps, string: "header" }} />

      {/* <Widget
        blueprintId="userDashboard"
        context={{
          user: {
            firstName: "Alex",
            lastName: "Johnson",
            email: "alex.j@example.com",
            role: "admin",
          },
        }}
        data={widgetData}
        activeStep={activeStep}
        handleSetUiContext={handleSetUiContext}
      /> */}
    </Box>
  );
}
