// src/components/FormTreeView/FormTreeView.js
import React from "react";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";

const FormTreeView = ({ items, handleClickItem }) => {
  if (!items || !items) {
    return null;
  }

  // Check if there are any array fields in the entire items
  const hasArrayFields = items.some((section) =>
    section.fields.some((field) => field.type === "array")
  );

  // If no array fields exist, render a fallback message
  if (!hasArrayFields) {
    return (
      <SimpleTreeView>
        <TreeItem
          itemId="no-data"
          label="No array data available to display in a tree view."
        />
      </SimpleTreeView>
    );
  }

  return (
    <SimpleTreeView sx={{ width: "100%" }}>
      {items.map((section, sectionIndex) => {
        // Only render the parent TreeItem if it contains at least one array field
        const hasArrayChild = section.fields.some(
          (field) => field.type === "array"
        );

        if (hasArrayChild) {
          return (
            <TreeItem
              key={sectionIndex}
              itemId={`section-${sectionIndex}`}
              label={section.sectionTitle}
              onClick={() => handleClickItem(section)}
            >
              {section.fields.map((field, fieldIndex) => {
                // Check if the field is an array to create a nested TreeItem
                if (field.type === "array") {
                  return (
                    <TreeItem
                      key={fieldIndex}
                      // Use a combination of sectionIndex and fieldIndex for a globally unique ID
                      itemId={`section-${sectionIndex}-field-${fieldIndex}`}
                      label={field.label}
                    />
                  );
                }
                return null; // Skip non-array fields
              })}
            </TreeItem>
          );
        }
        return null;
      })}
    </SimpleTreeView>
  );
};

export default FormTreeView;
