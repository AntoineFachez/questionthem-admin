import { Box } from "@mui/material";
import SduiRenderer from "./SduiRenderer";
import { iconMap } from "../lib/maps/iconMap";

// Define different button configurations based on context
const buttonConfigurations = {
  listView: [
    {
      label: "Sort by Name",
      action: { type: "SORT_DATA", payload: { sortBy: "name" } },
    },
    {
      label: "Sort by Date",
      action: { type: "SORT_DATA", payload: { sortBy: "date" } },
    },
  ],
  detailView: [
    {
      label: "Edit",
      action: { type: "EDIT_ITEM", payload: { mode: "edit" } },
    },
    {
      label: "Delete",
      action: { type: "DELETE_ITEM", payload: {} },
    },
  ],
  card: [
    {
      label: "Share",
      action: { type: "SHARE_ITEM", payload: {} },
      icon: iconMap[""],
    },
  ],
  default: [
    {
      label: "Default Action",
      action: { type: "DEFAULT", payload: {} },
    },
  ],
};

const Controls = (props) => {
  const { context } = props;
  const buttons = buttonConfigurations[context] || buttonConfigurations.default;

  return (
    <Box sx={{ display: "flex", gap: 0, padding: 0 }}>
      {buttons.map((buttonInfo, index) => (
        <SduiRenderer
          key={index}
          blueprint={{
            type: "atom.button",
            props: {
              variant: "outlined",
              sx: { textTransform: "capitalize", ...buttonInfo.sx },
              children: buttonInfo.label,
            },
            action: buttonInfo.action,
          }}
        />
      ))}
    </Box>
  );
};

export default Controls;
