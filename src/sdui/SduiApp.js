import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import SduiRenderer from "./core/Renderer";

import ScreenLayout from "../components/screenLayout/ScreenLayout";
import SideBar from "../components/sideBar/SideBar";

import mockUiTemplates from "./definitions/templates/templates.json";

import { initActions } from "./registries/actionRegistry";
import { transformer } from "./core/transformer";
import { buttonConfigurations, viewConfigurations } from "./config";
import Menu from "./Menu";

const SduiApp = () => {
  const [uiTemplate, setUiTemplate] = useState(
    mockUiTemplates.filter((item) => item.type === "template.table")[0]
  );
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
    const options = {
      uiTemplate: uiTemplate,
      rawData: activeConfig.data,
      dataMap: activeConfig.dataMap,
      itemInFocus: itemInFocus,
      expandedItems: expandedItems,
      menuAnchor: menuAnchor,
      widgetProps: widgetProps,
    };
    // Simulate a fetch; this makes the loading state feel real
    const timer = setTimeout(() => {
      try {
        const finalBlueprint = transformer(options);
        setUiBlueprint(finalBlueprint);
      } catch (err) {
        console.error("Failed to generate blueprint:", err);
        setError("Could not generate the UI layout.");
      } finally {
        setIsLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [
    buttonConfigurations,
    viewConfigurations,
    currentViewKey,
    uiTemplate,
    itemInFocus,
    expandedItems,
    menuAnchor,
  ]);

  const activeConfig = viewConfigurations[currentViewKey];

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
      sideBar={<SideBar elements={mockUiTemplates} setter={setUiTemplate} />}
      menu={menu}
      main={mainContent}
    />
  );
};
export default SduiApp;
