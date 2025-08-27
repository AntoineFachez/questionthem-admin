// app/notificationsAndAlert/Widget.js
import React, { useState } from "react";
import { Box, List, ListItem, Typography } from "@mui/material";

import { useUIContext } from "../../../context/UIContext";

import DynamicList from "../../../components/list/DynamicList";
import DynamicForm from "../form/DynamicForm";
import DataBaseOverview from "../dataBase/DataBaseOverview";
import ListScrum from "../../ListScrum";

export default function Widget({
  data,
  activeUiContext,
  setActiveUiContext,
  activeStep,
  handleSetUiContext,
}) {
  const {
    uiContext,
    setUiContext,
    openNewItem,
    setOpenNewItem,
    activeBlueprint,
  } = useUIContext();
  const [activeSubStep, setActiveSubStep] = useState({});
  const handleSetSubStep = (item) => {
    setActiveSubStep(item);
  };
  const renderContent = () => {
    switch (activeStep.href) {
      case "/datamanagement/table":
        return (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexFlow: "row nowrap",
              // justifyContent: "center",
              // alignItems: "center",
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
            <DataBaseOverview data={data} />
          </Box>
        );
      default:
        return <ListScrum data={data} />;
    }
  };

  return <>{renderContent()}</>;
}
