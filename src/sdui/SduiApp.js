import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import SduiRenderer from "./core/Renderer";

import ScreenLayout from "../components/screenLayout/ScreenLayout";
import SideBar from "../components/sideBar/SideBar";

import Menu from "./Menu";
import { useSdui } from "../context/SduiContext";
import { useUIContext } from "../context/UIContext";

const SduiApp = () => {
  const {
    avialableTemplates,
    uiTemplate,
    setUiTemplate,
    currentViewKey,
    setCurrentViewKey,
    activeConfig,
    uiBlueprint,

    isLoading,
    error,
  } = useSdui();
  const {} = useUIContext();

  const mainContent = (
    <>
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
  const menu = (
    <Menu
      buttons={[
        {
          props: {
            label: "Stats Grid",
            action: () => setCurrentViewKey("statsGrid"),
            variant: currentViewKey === "statsGrid" ? "contained" : "outlined",
          },
        },
        {
          props: {
            label: "Users Grid",
            action: () => setCurrentViewKey("usersGrid"),
            variant: currentViewKey === "usersGrid" ? "contained" : "outlined",
          },
        },
      ]}
    />
  );
  return (
    <ScreenLayout
      header={
        `${activeConfig?.title + " as " + uiTemplate.type}` || "Dashboard"
      }
      sideBar={<SideBar elements={avialableTemplates} setter={setUiTemplate} />}
      menu={menu}
      main={mainContent}
    />
  );
};
export default SduiApp;
