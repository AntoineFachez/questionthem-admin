// filename: components/Renderer.js

import React from "react";
import { atomicRegistry } from "../lib/registries/atomic-library";
import { widgetRegistry } from "../lib/registries/widget-library";
import { layoutRegistry } from "../lib/registries/layout-library";

// Combine all registries into one for easier lookup.
const masterRegistry = {
  ...atomicRegistry,
  ...widgetRegistry,
  ...layoutRegistry,
};

/**
 * Recursively renders a component blueprint.
 *
 * @param {object} blueprint - The component blueprint object.
 * @param {object} [context] - Contextual data (e.g., user info) for dynamic content.
 * @param {number} [index] - Optional key for React list rendering.
 * @returns {React.Component|null} The rendered React component.
 */
export function renderComponent(blueprint, context = {}, index = 0) {
  if (!blueprint || !blueprint.type) {
    return null;
  }

  const Component = masterRegistry[blueprint.name];

  if (!Component) {
    console.error(`Component type "${blueprint.name}" not found in registry.`);
    return null;
  }

  const { children, props: blueprintProps = {}, slots = {} } = blueprint;

  // Render children components recursively
  const renderedChildren = children?.map((child, i) =>
    renderComponent(child, context, i)
  );

  // Render slot components recursively
  const renderedSlots = {};
  for (const slotName in slots) {
    renderedSlots[slotName] = renderComponent(slots[slotName], context);
  }

  // Handle placeholders like "{user.firstName}" in props
  const renderedProps = {};
  for (const key in blueprintProps) {
    const value = blueprintProps[key];
    if (typeof value === "string") {
      renderedProps[key] = value.replace(
        /{(\w+)\.(\w+)}/g,
        (match, object, property) => {
          return context[object]?.[property] || match; // Replace or return original string
        }
      );
    } else {
      renderedProps[key] = value;
    }
  }

  // Combine rendered children and slots with the component's own props.
  const finalProps = { ...renderedProps, ...renderedSlots };

  return (
    <Component key={index} {...finalProps}>
      {renderedChildren}
    </Component>
  );
}

// Main function to render the entire dashboard blueprint
export function renderDashboard(dashboardBlueprint, context) {
  if (!dashboardBlueprint || !dashboardBlueprint.root) {
    return null;
  }
  return renderComponent(dashboardBlueprint.root, context);
}
