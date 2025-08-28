// src/lib/iconMap.js

import {
  AccountTree,
  Add,
  Analytics,
  Apps,
  ArrowForward,
  Chat,
  CheckCircleOutline,
  ContentCopy,
  Delete,
  DensityLarge,
  DensityMedium,
  Edit,
  Favorite,
  Forward,
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
  DensitySmall,
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
  DensityLarge: DensityLarge,
  DensityMedium: DensityMedium,
  DensitySmall: DensitySmall,
  Edit: Edit,
  Favorite: Favorite,
  Forward: ArrowForward,
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
export const getIconComponent = (iconName, onClick, sx = {}) => {
  const IconComponent = iconName ? iconMap[iconName] : null;
  return IconComponent ? (
    <IconButton onClick={onClick} sx={sx}>
      <IconComponent />
    </IconButton>
  ) : null;
};
