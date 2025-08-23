// filename: components/Renderer.js (Corrected Version)

import React from "react";
import { atomicRegistry } from "../registries/atomic-library";
import { moleculeRegistry } from "../registries/molecule-library";
import { layoutRegistry } from "../registries/layout-library";
import { screenRegistry } from "../registries/screen-library";
import { widgetRegistry } from "../registries/widget-library";

// Combine all registries into one for easier lookup.

const masterRegistry = {
  ...atomicRegistry,
  ...moleculeRegistry,
  ...layoutRegistry,
  ...screenRegistry,
  ...widgetRegistry,
};
/**
 * Resolves a dot-notation path string against an object.
 * @param {string} path - The path to resolve (e.g., "user.address.city").
 * @param {object} obj - The object to resolve the path against.
 * @returns {*} The resolved value or undefined if not found.
 */
function resolvePath(path, obj) {
  return path.split(".").reduce((prev, curr) => prev?.[curr], obj);
}
function renderComponent(blueprint, context = {}, index = 0) {
  // Handle primitive children (no changes here)

  if (typeof blueprint !== "object" || blueprint === null) {
    return blueprint;
  }

  // --- NEW: Handle the 'map' directive for list rendering ---
  if (blueprint.map) {
    const { data: dataPath, template } = blueprint.map;
    // Remove the curly braces {} to get the clean path
    const cleanDataPath = dataPath.slice(1, -1);
    const dataArray = resolvePath(cleanDataPath, context);

    if (!Array.isArray(dataArray)) {
      console.error(`Data for 'map' at path "${dataPath}" is not an array.`);
      return null;
    }

    // Render the template for each item in the array
    return dataArray.map((item, i) => {
      // Create a new context for this item, adding the 'item' scope
      const itemContext = { ...context, item };

      return renderComponent(template, itemContext, i);
    });
  }
  // --- END of 'map' handling ---

  const componentName = blueprint.component;
  if (!componentName) return null;

  const Component = masterRegistry[componentName];

  if (!Component) {
    console.error(`Component "${componentName}" not found in registry.`);
    return null;
  }

  const { children, props: blueprintProps = {}, slots = {} } = blueprint;

  // Render children and slots (no changes needed here)
  const renderedChildren = Array.isArray(children)
    ? children.map((child, i) => renderComponent(child, context, i))
    : null;

  const renderedSlots = {};
  for (const slotName in slots) {
    renderedSlots[slotName] = renderComponent(slots[slotName], context);
  }

  // --- ADJUSTED: Process props with the new data-binding helper ---
  const processedProps = {};
  for (const key in blueprintProps) {
    const value = blueprintProps[key];
    // Check if the value is a string in the binding format "{...}"
    if (
      typeof value === "string" &&
      value.startsWith("{") &&
      value.endsWith("}")
    ) {
      const cleanPath = value.slice(1, -1);
      processedProps[key] = resolvePath(cleanPath, context);
    } else {
      processedProps[key] = value;
    }
  }

  const finalProps = { ...processedProps, ...renderedSlots };

  return (
    <Component key={index} {...finalProps}>
      {renderedChildren}
    </Component>
  );
}

// Main entry point for rendering a full screen blueprint
export function renderDashboard(dashboardBlueprint, context) {
  if (!dashboardBlueprint || !dashboardBlueprint.root) {
    console.error("Invalid dashboard blueprint: 'root' node is missing.");
    return null;
  }
  // Start the recursive rendering process from the 'root' node
  return renderComponent(dashboardBlueprint.root, context);
}
// --- ADJUSTED: Update the main entry point ---
export function renderScreen(screenBlueprint, context) {
  // The entry point is now 'layout' instead of 'root'
  if (!screenBlueprint || !screenBlueprint.layout) {
    console.error("Invalid screen blueprint: 'layout' node is missing.");
    return null;
  }
  return renderComponent(screenBlueprint.layout, context);
}
