import { iconMap } from "../lib/maps/iconMap";

export const buttonConfigurations = {
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
