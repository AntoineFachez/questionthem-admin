import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MemoizedFormField from "./MemoizedFormField";
import DynamicAccordion from "../../../components/accordion/DynamicAccordion";
import { iconMap } from "../../../lib/maps/iconMap";

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
    if (field.render === false) return null;
    const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;

    // Recursive rendering for objects
    if (field.type === "object") {
      const nestedData = formData[field.name] || {};

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
            {getIconComponent(field.icon)}
            {field.label}
          </Typography>
          {renderFields({
            fields: field.properties,
            formData: nestedData,
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
            <Typography
              variant="subtitle1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {getIconComponent(field.icon)}
              {field.label}
            </Typography>
            <IconButton
              onClick={() => addArrayItem(field.name, itemSchema)}
              size="small"
            >
              {getIconComponent("Add")}
            </IconButton>
          </Box>
          {arrayData?.map((item, arrayIndex) => {
            const nestedPath = `${fieldPath}.${arrayIndex}`;
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
                  {getIconComponent(itemSchema.icon)}{" "}
                  {getIconComponent(item.platformId)}
                  {item.name || `${field.label} ${arrayIndex + 1}`}
                </Typography>
              </Box>
            );

            // Define the detail content for the accordion
            const detailContent = renderFields({
              fields: itemSchema.properties,
              formData: item,
              handlers: {
                ...handlers, // Pass original handlers through. handleChange will work correctly.
                // Re-wire addArrayItem for deeply nested arrays
                addArrayItem: (nestedArrayName, nestedItemSchema) =>
                  addArrayItem(
                    `${nestedPath}.${nestedArrayName}`,
                    nestedItemSchema
                  ),
                // You should also re-wire removeArrayItem for completeness
                removeArrayItem: (nestedArrayName, nestedIndex) =>
                  handlers.removeArrayItem(
                    `${nestedPath}.${nestedArrayName}`,
                    nestedIndex
                  ),
              },
              // Pass the nested path down so child fields can build their full paths
              parentPath: nestedPath,
            });

            return (
              <Box
                key={arrayIndex}
                sx={{
                  my: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1, // Add some space between the accordion and the button
                }}
              >
                <DynamicAccordion
                  summary={summaryContent}
                  detail={detailContent}
                />
                <IconButton
                  onClick={() => removeArrayItem(field.name, arrayIndex)}
                  size="small"
                  sx={{ ml: "auto" }} // Pushes the button to the end
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      );
    }
    const getNestedValue = (obj, path) => {
      // Your logic to traverse the object using the path string
      // For example:
      return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    };
    const value = getNestedValue(formData, field.name); // Get the value based on the field name within the current `formData` context.

    // Render simple fields
    return (
      <>
        <MemoizedFormField
          key={field.name}
          field={field}
          value={value}
          onChange={handleChange}
          path={fieldPath}
        />
      </>
    );
  });
};
