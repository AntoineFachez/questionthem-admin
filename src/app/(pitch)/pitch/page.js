// app/pitch/page.js
"use client";
import React from "react";

import Title from "../../../components/title/Title";
import { titleProps } from "../../../theme/muiProps";

import { useWidgetContext } from "./Context";
import Widget from "./Widget";
import { Box } from "@mui/material";

export default function Page() {
  const { title } = useWidgetContext();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Title props={{ ...titleProps, string: title }} />
      <Widget />
    </Box>
  );
}
