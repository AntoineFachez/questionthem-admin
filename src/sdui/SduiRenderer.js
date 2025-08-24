// src/sdui/SduiRenderer.jsx
import React from "react";
import { componentRegistry } from "./ComponentRegistry";
import { actionRegistry } from "./actionRegistry";
const SduiRenderer = ({ blueprint }) => {
  if (!blueprint || !blueprint.type) {
    return null;
  }

  const Component = componentRegistry[blueprint.type];

  if (!Component) {
    console.error(`Component type "${blueprint.type}" not found in registry.`);
    return <div>Error: Unknown Component {blueprint.type}</div>;
  }

  // Destructure all parts of the blueprint
  const { props, action, children: childBlueprints } = blueprint;

  // Separate the label (props.children) from other props
  const { children: propChildren, ...restOfProps } = props || {};
  const finalProps = { ...props };

  // If an action object exists, create an onClick handler for it
  if (action && action.type) {
    const actionHandler = actionRegistry[action.type];
    if (actionHandler) {
      finalProps.onClick = (e) => actionHandler(action.payload);
    } else {
      console.warn(`Action type "${action.type}" not found in registry.`);
    }
  }
  // 1. Recursively render all children defined in the blueprint.
  //    This will return an array of React elements (e.g., [<Typography />, <TextField />, ...]).
  let renderedContent = null;
  if (childBlueprints && Array.isArray(childBlueprints)) {
    // If there's a 'children' array in the blueprint, render those components
    renderedContent = childBlueprints.map((child, index) => (
      <SduiRenderer key={index} blueprint={child} />
    ));
  } else if (propChildren) {
    // Otherwise, use the 'children' from the props (i.e., the label)
    renderedContent = propChildren;
  }

  // 2. Spread the blueprint's props onto the component and pass the
  //    `renderedChildren` array into the standard `children` prop.

  return <Component {...finalProps}>{renderedContent}</Component>;
};

export default SduiRenderer;
