// src/components/organisms/KebabMenu.jsx

import React, { useState } from "react";
import { IconButton, ListItemText, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { actionRegistry } from "../../sdui/registries/actionRegistry";
import { getIconComponent } from "../../lib/maps/iconMap";

/**
 * A self-contained Kebab Menu. It manages its own open/close state
 * and renders its content from a blueprint passed via props.
 */
export default function KebabMenu({ id, options }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="settings"
        onClick={handleClick}
        sx={{
          width: "2rem",
          height: "2rem",
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        // sx={{ display: "flex", gap: 2, p: 1 }}
      >
        {options?.map((option, i) => {
          const actionHandler = option.action;
          const onClickHandler = (e) => {
            e.stopPropagation();

            actionHandler(e, { id });
            handleClose(e);
          };
          return getIconComponent(option.icon, onClickHandler, {
            width: "2rem",
            height: "2rem",
          });
        })}
      </Menu>
    </>
  );
}
