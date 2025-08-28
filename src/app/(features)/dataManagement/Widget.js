// app/notificationsAndAlert/Widget.js
import React, { useEffect, useState } from "react";
import { Box, Button, List, ListItem, Typography } from "@mui/material";

import { useUIContext } from "../../../context/UIContext";
import { useDataBase } from "../../../context/DataBaseContext";

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
  const [activeSubStep, setActiveSubStep] = useState({});
  const handleSetSubStep = (item) => {
    setActiveSubStep(item);
  };
  const renderContent = () => {
    switch (activeSubStep.href) {
      case "/datamanagement/table":
        return (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexFlow: "column nowrap",
              // justifyContent: "center",
              // alignItems: "center",
              // gap: 2,
              p: 0,
              m: 0,
            }}
          >
            {" "}
            <Box>
              <Button
                onClick={() => handleSetSubStep({})}
                variant="contained"
                // sx={{ width: "100%" }}
              >
                back
              </Button>{" "}
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexFlow: "column nowrap",
                p: 0,
                m: 0,
              }}
            >
              {/* {uiContext && (
              <DynamicList
                data={data}
                onClick={handleSetUiContext}
                itemInFocus={activeStep}
              />
            )} */}
              <DataBaseOverview data={data} />
            </Box>
          </Box>
        );
      default:
        return (
          <ListScrum
            data={data}
            itemInFocus={activeSubStep}
            handleSetItem={handleSetSubStep}
          />
        );
    }
  };
  useEffect(() => {
    renderContent();
    return () => {};
  }, [data]);

  return <>{renderContent()}</>;
}
