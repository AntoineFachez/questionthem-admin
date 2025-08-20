// The runtime renderer
// filename: components/Renderer.js

import React from "react";
import { componentRegistry } from "./ui-library";

// Renders the component based on the blueprint
export function renderComponent(blueprint, index = 0) {
  if (!blueprint || !blueprint.type) {
    return null;
  }

  const Component = componentRegistry[blueprint.type];
  if (!Component) {
    console.error(`Component type "${blueprint.type}" not found in registry.`);
    return null;
  }

  const { children, ...props } = blueprint;
  const renderedChildren = children?.map((child, i) =>
    renderComponent(child, i)
  );

  // The key is crucial for React's reconciliation process
  return (
    <Component key={index} props={props}>
      {renderedChildren}
    </Component>
  );
}
