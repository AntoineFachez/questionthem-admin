// app/pitch/Widget.js
"use client";
import React from "react";
import { Box, Paper } from "@mui/material";

import DynamicList from "../../../components/list/DynamicList";
import SimpleTree from "../../../components/treeView/SimpleTree";

import { containerProps } from "../../../theme/muiProps";

import { widgetSpex } from "./widgetSpex.json";
import { useWidgetContext } from "./Context";

export default function Widget({}) {
  const { widgetData, activeStep, setActiveStep } = useWidgetContext();

  const handleSetItemInFocus = (item) => {
    setActiveStep(item);
  };

  return (
    <>
      <Paper sx={{ overflow: "auto" }}>
        <Box
          sx={{
            width: "30%",
            // height: "100%",
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "flex-start",
          }}
        >
          <SimpleTree
            items={widgetData.sections}
            handleClickItem={handleSetItemInFocus}
          />
        </Box>{" "}
        {/* <DynamicList
          data={widgetData.sections}
          itemInFocus={activeStep}
          blueprint={widgetSpex.pitchDeckBlueprint}
          onClick={handleSetItemInFocus}
        /> */}
      </Paper>
    </>
  );
}
