"use client";

import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// A mapping object for the icons, so the KebabMenu component doesn't need to import them all.
const iconMap = {
  Add: AddIcon,
  Delete: DeleteIcon,
  Edit: EditIcon,
  Copy: ContentCopyIcon,
};

/**
 * A reusable three-dot menu component for row actions.
 * It manages its own open/close state and renders menu items from a prop.
 *
 * @param {object} props - The component props.
 * @param {array} props.actions - An array of action objects. Each object should have a `name`, `icon`, and `onClick` handler.
 */
export default function KebabMenu({ actions }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        aria-label="more"
        aria-controls={open ? "kebab-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="kebab-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
      >
        {actions.map((action, index) => {
          const IconComponent = iconMap[action.icon];
          return (
            <MenuItem
              key={index}
              onClick={(e) => {
                action.onClick(e);
                handleClose();
              }}
            >
              {IconComponent && (
                <ListItemIcon>
                  <IconComponent fontSize="small" />
                </ListItemIcon>
              )}
              <ListItemText>{action.name}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
