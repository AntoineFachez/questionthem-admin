import React from "react";
import { Typography } from "@mui/material";
import { componentRegistry } from "./registries/screen-library";

export default function ComponentRenderer({ config }) {
  console.log("config", config);
  if (!config) return null;

  // Handle plain text children
  if (typeof config === "string") {
    return config;
  }

  // Look up the component in the registry
  const Component = componentRegistry[config.component];

  // Fallback for unknown components
  if (!Component) {
    return (
      <Typography color="error">
        Unknown component: {config.component}
      </Typography>
    );
  }

  // Render the component with its props, and recursively render its children
  return (
    <>
      <Component {...config.props}>
        {config.children &&
          config.children.map((childConfig, index) => (
            <ComponentRenderer key={index} config={childConfig} />
          ))}
      </Component>
    </>
  );
}
