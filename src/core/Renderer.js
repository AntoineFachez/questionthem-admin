// "use server"; // This can be a server component since it just renders

import React from "react";
import { atomicRegistry } from "../sdui/_firstTry/registries/atomic-library";
import { moleculeRegistry } from "../sdui/_firstTry/registries/molecule-library";
import { layoutRegistry } from "../sdui/_firstTry/registries/layout-library";
import { screenRegistry } from "../sdui/_firstTry/registries/templateRegistry";
import { widgetRegistry } from "../sdui/_firstTry/registries/organisms-library";

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
