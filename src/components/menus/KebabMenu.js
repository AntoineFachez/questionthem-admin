// src/components/organisms/KebabMenu.jsx

import React, { useState } from "react";
import { IconButton, Menu } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SduiRenderer from "../../sdui/SduiRenderer"; // Adjust path

/**
 * A self-contained Kebab Menu. It manages its own open/close state
 * and renders its content from a blueprint passed via props.
 */
export default function KebabMenu({ menuItems }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    // Stop the click from propagating to the parent card
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label="settings" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* Render each menu item using the SduiRenderer */}
        {menuItems?.map((itemBlueprint, index) => (
          <SduiRenderer key={index} blueprint={itemBlueprint} />
        ))}
      </Menu>
    </>
  );
}
