import React, { createContext, useContext, useState, useEffect } from "react";
import { transformer } from "../sdui/core/transformer";
import { initActions } from "../sdui/registries/actionRegistry";
import { buttonConfigurations, viewConfigurations } from "../sdui/config";

// Assume these are now fetched or handled by a more dynamic lookup.
// For this example, we'll keep them to show how they're used post-fetching.
import mockUiTemplates from "../sdui/definitions/templates/templates.json";
import statsDataMap from "../sdui/definitions/dataMapping/stats.map.json";
import usersDataMap from "../sdui/definitions/dataMapping/users.map.json";
import { mockRawData } from "../sdui/mockData.json";

const SduiContext = createContext();

export function SduiProvider({ children, viewConfig }) {
  const avialableTemplates = mockUiTemplates;
  const widgetProps = { buttonConfigurations };
  // --- State Management ---
  const [uiTemplate, setUiTemplate] = useState(
    avialableTemplates.filter((item) => item.type === "template.table")[0]
  );
  const [currentViewKey, setCurrentViewKey] = useState("statsGrid");
  const [uiBlueprint, setUiBlueprint] = useState(null);

  // All client-side state remains managed here
  const [itemInFocus, setItemInFocus] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [menuAnchor, setMenuAnchor] = useState(null);

  // State for fetched and cached definitions
  const [templates, setTemplates] = useState({});
  const [dataMaps, setDataMaps] = useState({});
  const [dataSources, setDataSources] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- API and Fetching Logic (from Script B) ---
  const partUrl = {
    baseUrl: "https://europe-west1-questionthem-90ccf.cloudfunctions.net",
  };

  // Generic fetcher for any definition type (templates, maps, data)
  const fetchDefinition = async (type, id) => {
    // In a real app, the URL would change based on type
    // e.g., /api/sdui/templates/${id}, /api/sdui/maps/${id}
    const res = await fetch(`${partUrl.baseUrl}/api/sdui/ui/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${type} for ID: ${id}`);
    }
    const result = await res.json();
    return result.data;
  };

  // Initialize the action registry with state setters
  useEffect(() => {
    initActions({ setItemInFocus, setExpandedItems, setMenuAnchor });
  }, []);
  useEffect(() => {
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
  // --- Core Blueprint Generation Effect ---
  const options = {
    uiTemplate: uiTemplate,
    rawData: activeConfig.data,
    dataMap: activeConfig.dataMap,
    itemInFocus: itemInFocus,
    expandedItems: expandedItems,
    menuAnchor: menuAnchor,
    widgetProps: widgetProps,
  };

  const contextValue = {
    avialableTemplates,
    uiTemplate,
    setUiTemplate,
    currentViewKey,
    setCurrentViewKey,
    options,
    activeConfig,
    uiBlueprint,
    setUiBlueprint,

    itemInFocus,
    setItemInFocus,

    expandedItems,
    setExpandedItems,
    menuAnchor,
    setMenuAnchor,

    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return (
    <SduiContext.Provider value={contextValue}>{children}</SduiContext.Provider>
  );
}

// Custom hook to consume the context
export function useSdui() {
  const context = useContext(SduiContext);
  if (context === undefined) {
    throw new Error("useSdui must be used within an SduiProvider");
  }
  return context;
}
