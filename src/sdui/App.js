import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import SduiRenderer from "./SimpleRenderer";

import ScreenLayout from "./ScreenLayout";
import { generateBlueprint } from "./transformer";

import mockUiTemplate from "./uiTemplates.json";
import { mockRawData } from "./mockData.json";
import usersDataMap from "./maps/users.map.json";
import statsDataMap from "./maps/stats.map.json";

const viewConfigurations = {
  statsGrid: {
    title: "Stats Dashboard",
    data: mockRawData.stats,
    dataMap: statsDataMap,
  },
  usersGrid: {
    title: "User Management",
    data: mockRawData.users,
    dataMap: usersDataMap,
  },
};
export default function App() {
  const [currentViewKey, setCurrentViewKey] = useState("statsGrid");

  const [uiTemplate, setUiTemplate] = useState(mockUiTemplate[1]);
  const [uiBlueprint, setUiBlueprint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const activeConfig = viewConfigurations[currentViewKey];

    // Simulate a fetch; this makes the loading state feel real
    const timer = setTimeout(() => {
      try {
        const finalBlueprint = generateBlueprint(
          uiTemplate,
          mockRawData,
          activeConfig.dataMap
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
  }, [mockRawData, currentViewKey]);

  const activeConfig = viewConfigurations[currentViewKey];

  const mainContent = (
    <>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          gap: 2,
          borderBottom: 1,
          borderColor: "divider",
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
      header={activeConfig?.title || "Dashboard"}
      main={mainContent}
    />
  );
}
