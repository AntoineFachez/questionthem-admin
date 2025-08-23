// "use server"; // This can be a server component since it just renders

import React from "react";
import { atomicRegistry } from "./registries/atomic-library";
import { moleculeRegistry } from "./registries/molecule-library";
import { layoutRegistry } from "./registries/layout-library";
import { screenRegistry } from "./registries/screen-library";
import { widgetRegistry } from "./registries/widget-library";

// Combine all registries into one for easier lookup.

const masterRegistry = {
  ...atomicRegistry,
  ...moleculeRegistry,
  ...layoutRegistry,
  ...screenRegistry,
  ...widgetRegistry,
};

export default function Renderer({ blueprint }) {
  if (!blueprint) {
    return null;
  }

  // Look up the component function from the registry using the string key
  const Component = masterRegistry[blueprint.component];

  // Handle cases where the component is not found
  if (!Component) {
    console.error(`Component not found in registry: ${blueprint.component}`);
    // You could render a placeholder or an error message
    return (
      <div style={{ color: "red" }}>
        Component {blueprint.component} not found.
      </div>
    );
  }

  // Recursively render children, if any
  const children = blueprint.children?.map((childBlueprint, index) => {
    return <Renderer key={index} blueprint={childBlueprint} />;
  });

  // Create the element with its props and children
  return <Component {...blueprint.props}>{children}</Component>;
}
