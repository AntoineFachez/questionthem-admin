// src/sdui/SduiRenderer.jsx
import React from "react";
import { componentRegistry } from "./ComponentRegistry";

const SduiRenderer = ({ blueprint }) => {
  if (!blueprint || !blueprint.type) {
    return null;
  }

  const Component = componentRegistry[blueprint.type];

  if (!Component) {
    console.error(`Component type "${blueprint.type}" not found in registry.`);
    return <div>Error: Unknown Component {blueprint.type}</div>;
  }

  // 1. Recursively render all children defined in the blueprint.
  //    This will return an array of React elements (e.g., [<Typography />, <TextField />, ...]).
  const renderedChildren = blueprint.children?.map((childBlueprint, index) => (
    <SduiRenderer key={index} blueprint={childBlueprint} />
  ));

  // 2. Spread the blueprint's props onto the component and pass the
  //    `renderedChildren` array into the standard `children` prop.
  return <Component {...blueprint.props}>{renderedChildren}</Component>;
};

export default SduiRenderer;
