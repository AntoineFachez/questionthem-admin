import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import SduiRenderer from "../../sdui/SduiRenderer";

import ScreenLayout from "../../components/screenLayout/ScreenLayout";
import { generateBlueprint } from "./transformer";

import mockUiTemplate from "./uiTemplates.json";
import { mockRawData } from "./mockData.json";
import usersDataMap from "./maps/users.map.json";
import statsDataMap from "./maps/stats.map.json";
import { initActions } from "./actionRegistry";
import { buttonConfigurations } from "./controlsConfiguration";
const viewConfigurations = {
  statsGrid: {
    title: "Stats",
    data: mockRawData.stats,
    dataMap: statsDataMap,
  },
  usersGrid: {
    title: "Users",
    data: mockRawData.users,
    dataMap: usersDataMap,
  },
};
const GridCards = () => {
  const [uiTemplate, setUiTemplate] = useState(mockUiTemplate[1]);
  const [currentViewKey, setCurrentViewKey] = useState("statsGrid");

  const [itemInFocus, setItemInFocus] = useState(null);
  const [uiBlueprint, setUiBlueprint] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const widgetProps = { buttonConfigurations };

  useEffect(() => {
    initActions({ setItemInFocus, setExpandedItems, setMenuAnchor });
  }, []);
  useEffect(() => {
    const activeConfig = viewConfigurations[currentViewKey];

    // Simulate a fetch; this makes the loading state feel real
    const timer = setTimeout(() => {
      try {
        const finalBlueprint = generateBlueprint(
          uiTemplate,
          activeConfig.data,
          activeConfig.dataMap,
          itemInFocus,
          expandedItems,
          menuAnchor,
          widgetProps
        );
        setUiBlueprint(finalBlueprint);
      } catch (err) {
        console.error("Failed to generate blueprint:", err);
        setError("Could not generate the UI layout.");
      } finally {
        setIsLoading(false);
      }
    }, 500);
    // Cleanup function for the timer
    return () => clearTimeout(timer);
  }, [
    mockRawData,
    currentViewKey,
    mockUiTemplate,
    itemInFocus,
    expandedItems,
    menuAnchor,
  ]);

  const activeConfig = viewConfigurations[currentViewKey];

  const mainContent = (
    <>
      <Box
        sx={{
          height: "100%",
          padding: 2,
          display: "flex",
          gap: 2,
          borderBottom: 1,
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Button
          variant={currentViewKey === "statsGrid" ? "contained" : "outlined"}
          onClick={() => setCurrentViewKey("statsGrid")}
        >
          Stats Grid
        </Button>
        <Button
          variant={currentViewKey === "usersGrid" ? "contained" : "outlined"}
          onClick={() => setCurrentViewKey("usersGrid")}
        >
          Users Grid
        </Button>
      </Box>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ padding: 4 }}>
          {error}
        </Typography>
      ) : (
        <SduiRenderer blueprint={uiBlueprint} />
      )}
    </>
  );

  return (
    <ScreenLayout
      header={
        `${activeConfig?.title + " as " + uiTemplate.type}` || "Dashboard"
      }
      main={mainContent}
    />
  );
};
export default GridCards;
