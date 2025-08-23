// app/notificationsAndAlert/Widget.js
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import DynamicForm from "../../(features)/form/DynamicForm";
import { useUIContext } from "../../../context/UIContext";

export default function Widget({}) {
  const { openNewItem, activeBlueprint, setOpenNewItem } = useUIContext();

  const renderContent = () => {
    switch ("") {
      case "":
        return;
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
            {" "}
            {openNewItem && activeBlueprint && (
              <DynamicForm
                blueprint={activeBlueprint}
                onClose={() => setOpenNewItem(false)}
              />
            )}
          </Box>
        );
    }
  };

  return <>{renderContent()}</>;
}
