// // src/sdui/SduiProvider.js

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { transformer } from "./core/transformer";
// import { initActions } from "./registries/actionRegistry";

// // Import all your definitions
// import mockUiTemplates from "./definitions/templates/templates.json";
// import statsDataMap from "./definitions/dataMapping/stats.map.json";
// import usersDataMap from "./definitions/dataMapping/users.map.json";
// import { mockRawData } from "./mockData.json";
// import { buttonConfigurations } from "./config";

// // A simple lookup for our mock definitions
// const templateLookup = {
//   grid: mockUiTemplates.find((t) => t.type === "organism.grid"),
//   table: mockUiTemplates.find((t) => t.type === "template.table"),
// };
// const dataMapLookup = { stats: statsDataMap, users: usersDataMap };
// const dataSourceLookup = { stats: mockRawData.stats, users: mockRawData.users };

// const SduiContext = createContext();

// export function SduiProvider({ children, viewConfig }) {
//   const [uiBlueprint, setUiBlueprint] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [viewTemplate, setViewTemplate] = useState("statsAsGrid");
//   const availableViews = templateLookup;

//   // All shared client-side state is now managed here
//   const [itemInFocus, setItemInFocus] = useState(null);
//   const [expandedItems, setExpandedItems] = useState({});
//   const [menuAnchor, setMenuAnchor] = useState(null);

//   // Initialize the action registry with the state setters
//   useEffect(() => {
//     initActions({ setItemInFocus, setExpandedItems, setMenuAnchor });
//   }, []);

//   // This effect regenerates the blueprint when the view or state changes
//   useEffect(() => {
//     if (!viewConfig) return;

//     setIsLoading(true);
//     const timer = setTimeout(() => {
//       try {
//         // Fetch definitions based on the view config IDs
//         const template = templateLookup[viewConfig.templateId];
//         const dataMap = dataMapLookup[viewConfig.dataMapId];
//         const rawData = dataSourceLookup[viewConfig.dataSourceId];

//         const options = {
//           uiTemplate: template,
//           rawData: rawData,
//           dataMap: dataMap,
//           itemInFocus,
//           expandedItems,
//           menuAnchor,
//           widgetProps: { buttonConfigurations },
//         };

//         const finalBlueprint = transformer(options);
//         setUiBlueprint(finalBlueprint);
//       } catch (err) {
//         console.error("Failed to generate blueprint:", err);
//         setError("Could not generate the UI layout.");
//       } finally {
//         setIsLoading(false);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [viewConfig, itemInFocus, expandedItems, menuAnchor]);

//   const contextValue = {
//     availableViews,
//     viewTemplate,
//     setViewTemplate,
//     uiBlueprint,
//     isLoading,
//     error,
//   };

//   return (
//     <SduiContext.Provider value={contextValue}>{children}</SduiContext.Provider>
//   );
// }

// // A custom hook to easily consume the context
// export function useSdui() {
//   const context = useContext(SduiContext);
//   if (context === undefined) {
//     throw new Error("useSdui must be used within an SduiProvider");
//   }
//   return context;
// }
