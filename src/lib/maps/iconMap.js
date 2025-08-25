// src/lib/iconMap.js

import {
  AccountTree,
  Add,
  Analytics,
  Apps,
  Chat,
  CheckCircleOutline,
  ContentCopy,
  Delete,
  Edit,
  Favorite,
  Gavel,
  Group,
  Notifications,
  Remove,
  Settings,
  Storage,
  Warning,
  Facebook,
  Twitter,
  YouTube,
  Instagram,
  Public,
  Share,
  MoreVert,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

// A single mapping object for all icons
export const iconMap = {
  AccountTree: AccountTree,
  Add: Add,
  Analytics: Analytics,
  Apps: Apps,
  Chat: Chat,
  CheckCircleOutline: CheckCircleOutline,
  ContentCopy: ContentCopy,
  Database: Storage,
  Delete: Delete,
  Edit: Edit,
  Favorite: Favorite,
  Group: Gavel,
  Group: Group,
  MoreVert: MoreVert,
  Notifications: Notifications,
  Remove: Remove,
  Share: Share,
  Settings: Settings,
  Warning: Warning,

  facebook: Facebook,
  x: Twitter,
  instagram: Instagram,
  youtube: YouTube,
  truth_social: Public,
};
export const getIconComponent = (iconName, onClick, sx) => {
  const IconComponent = iconName ? iconMap[iconName] : null;
  return IconComponent ? (
    <IconButton onClick={onClick}>
      <IconComponent sx={sx} />
    </IconButton>
  ) : null;
};
