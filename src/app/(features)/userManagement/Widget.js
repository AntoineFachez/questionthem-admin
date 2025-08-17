// app/notificationsAndAlert/Widget.js
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

import DynamicList from "../../../components/list/List";
import { useUIContext } from "../../../context/UIContext";

export default function Widget({
  data,
  activeUiContext,
  setActiveUiContext,
  activeStep,
  handleSetUiContext,
}) {
  const { uiContext, setUiContext } = useUIContext();
  const [activeSubStep, setActiveSubStep] = useState({});
  const handleSetSubStep = (item) => {
    setActiveSubStep(item);
  };
  const renderContent = () => {
    switch (activeStep.href) {
      default:
        return (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexFlow: "row nowrap",
              gap: 2,
            }}
          >
            {uiContext && (
              <DynamicList
                data={data}
                onClick={handleSetUiContext}
                itemInFocus={activeStep}
              />
            )}
            <Typography>{data.header}</Typography>
            {data && (
              <DynamicList
                data={activeStep.substeps}
                onClick={handleSetSubStep}
                itemInFocus={activeSubStep}
              />
            )}
          </Box>
        );
    }
  };

  return <>{renderContent()}</>;
}
