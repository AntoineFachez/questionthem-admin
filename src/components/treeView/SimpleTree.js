import React from "react";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";

// Recursive helper function to render all fields
const renderFieldsAsTreeItems = (fields, parentItemId) => {
  if (!fields) return null;

  console.log("fields", fields);
  return fields.map((field, index) => {
    const itemId = `${parentItemId}-field-${index}`;

    // Handle nested objects by rendering their properties recursively
    if (field.type === "object") {
      return (
        <TreeItem
          key={itemId}
          itemId={itemId}
          label={`${
            field.title || field.subTitle || field.label || field.name
          } (${field.type})`}
        >
          {renderFieldsAsTreeItems(
            field.subsections || field.properties,
            itemId
          )}
        </TreeItem>
      );
    }

    // Render all other field types
    return (
      <TreeItem
        key={itemId}
        itemId={itemId}
        label={`${
          field.title || field.subTitle || field.label || field.name
        } (${field.type})`}
      />
    );
  });
};

const FormTreeView = ({ items, handleClickItem }) => {
  if (!items) {
    return null;
  }

  return (
    <>
      <SimpleTreeView sx={{ width: "100%" }}>
        {items.map((section, sectionIndex) => {
          console.log("section", section);
          const sectionItemId = `section-${sectionIndex}`;
          return (
            <>
              <TreeItem
                key={sectionIndex}
                itemId={sectionItemId}
                label={section.sectionTitle}
                onClick={() => handleClickItem(section)}
              >
                {renderFieldsAsTreeItems(
                  section.subsections || section.fields,
                  sectionItemId
                )}
              </TreeItem>
            </>
          );
        })}
      </SimpleTreeView>
    </>
  );
};

export default FormTreeView;
