import React from "react";
import { IconButton } from "@mui/material";
import { iconMap } from "../../lib/maps/iconMap";

export default function CustomIconButton(props) {
  // Get the component type from the map (e.g., the MoreVertIcon function)
  // It's conventional to name component variables with a capital letter.
  const { icon, ...restOfProps } = props;

  const IconComponent = iconMap[props.icon];

  // If the icon doesn't exist in the map, don't render anything to avoid errors.
  if (!IconComponent) {
    return null;
  }

  // Now, render it as a JSX element
  return (
    <IconButton {...restOfProps}>
      <IconComponent />
    </IconButton>
  );
}
