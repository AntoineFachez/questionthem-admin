import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MemoizedFormField from "./MemoizedFormField";
import DynamicAccordion from "../accordion/DynamicAccordion";
import { iconMap } from "../../lib/maps/iconMap";

// Helper function to dynamically get and render the icon
const getIconComponent = (iconName) => {
  const IconComponent = iconName ? iconMap[iconName] : null;
  return IconComponent ? <IconComponent sx={{ mr: 1 }} /> : null;
};

export const renderFields = ({
  fields,
  formData,
  handlers,
  parentPath = "",
}) => {
  const { handleChange, addArrayItem, removeArrayItem, handleArrayItemChange } =
    handlers;

  if (!fields) return null;

  return fields.map((field, index) => {
    const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;

    // Recursive rendering for objects
    if (field.type === "object") {
      const Icon = getIconComponent(field.icon); // Get icon for the object field
      return (
        <Box
          key={field.name}
          sx={{
            ml: 2,
            p: 2,
            border: "1px dashed grey",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <IconComponent sx={{ mr: 1 }} />
            {Icon}
            {field.label}
          </Typography>
          {renderFields({
            fields: field.properties,
            formData,
            handlers,
            parentPath: fieldPath,
          })}
        </Box>
      );
    }

    // Recursive rendering for arrays
    if (field.type === "array") {
      const itemSchema = field.items;
      const arrayData = formData[field.name] || [];
      return (
        <Box
          key={field.name}
          sx={{ ml: 2, p: 2, border: "1px dashed grey", borderRadius: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1">{field.label}</Typography>
            <IconButton
              onClick={() => addArrayItem(field.name, itemSchema)}
              size="small"
            >
              <AddIcon />
            </IconButton>
          </Box>

          {arrayData?.map((item, arrayIndex) => {
            // Get the icon component from the map based on the platformId
            const IconComponent = iconMap[item.platformId];

            // Define the summary content for the accordion
            const summaryContent = (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <IconComponent sx={{ mr: 1 }} />
                  {item.name || `Item ${arrayIndex + 1}`}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents accordion from expanding
                    removeArrayItem(field.name, arrayIndex);
                  }}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            );

            // Define the detail content for the accordion
            const detailContent = renderFields({
              fields: itemSchema.properties,
              formData: item,
              handlers: {
                ...handlers,
                handleChange: (e, propName) =>
                  handleArrayItemChange(e, field.name, arrayIndex, propName),
              },
            });

            return (
              <Box key={arrayIndex} sx={{ my: 1 }}>
                <DynamicAccordion
                  summary={summaryContent}
                  detail={detailContent}
                />
              </Box>
            );
          })}
        </Box>
      );
    }

    // Render simple fields
    return (
      <MemoizedFormField
        key={field.name}
        field={field}
        value={formData[field.name]}
        onChange={handleChange}
        path={fieldPath}
      />
    );
  });
};
