const {
  Typography,
  LinearProgress,
  IconButton,
  Box,
} = require("@mui/material");

import { containerProps } from "../../theme/muiProps";
import { iconMap } from "../../lib/maps/iconMap";
import { handleCopyToClipboard } from "../../lib/utils/clipboard";
export const getComponent = (
  item,
  itemInFocus,
  field,
  i,
  onClick,
  DynamicList
) => {
  const data = item[field.key];
  switch (field.type) {
    case "text":
      return (
        <Typography key={i} variant={field.variant || "body1"} sx={field.sx}>
          {data}
        </Typography>
      );
    case "icon":
      const IconComponent = iconMap[field.iconName];
      return <IconComponent key={i} sx={field.sx} />;
    case "progress":
      return (
        <LinearProgress
          key={i}
          variant="determinate"
          value={data * 100}
          sx={{ height: 10, borderRadius: 5, ...field.sx }}
        />
      );
    case "action":
      const ActionIcon = iconMap[field.iconName];
      const actionHandler =
        field.action === "copy" ? () => handleCopyToClipboard(data) : () => {};
      return (
        <IconButton
          key={i}
          size="small"
          onClick={actionHandler}
          aria-label={field.label}
        >
          <ActionIcon fontSize="small" />
        </IconButton>
      );
    case "sublist":
      if (Array.isArray(data) && data.length > 0) {
        return (
          <Box
            {...containerProps}
            sx={{ maxWidth: "60ch" }}
            className="dynamic-list-sublist-container"
          >
            <DynamicList
              key={i}
              data={data} // The nested data is the value of the field
              blueprint={field.blueprint} // The sublist needs its own blueprint
              onClick={onClick}
              itemInFocus={itemInFocus}
            />
          </Box>
        );
      }
      return null;
    default:
      return null;
  }
};
