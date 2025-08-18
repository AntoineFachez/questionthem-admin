// src/components/dynamicform/useFormData.js
import { useState } from "react";

/**
 * A recursive helper function to build the initial form data structure.
 * It merges the blueprint's structure with existing data, ensuring that
 * nested objects and arrays are correctly initialized.
 */
const initializeData = (schemaFields, existingData = {}) => {
  const data = {};
  schemaFields?.forEach((field) => {
    const value = existingData[field.name];

    if (field.type === "object" && field.properties) {
      data[field.name] = value
        ? initializeData(field.properties, value)
        : initializeData(field.properties);
    } else if (field.type === "array" && field.items) {
      // Correctly handle initial data for arrays, or initialize as an empty array.
      if (Array.isArray(value)) {
        data[field.name] = value.map((item) =>
          initializeData(field.items.properties, item)
        );
      } else {
        data[field.name] = [];
      }
    } else {
      data[field.name] = value !== undefined ? value : "";
    }
  });
  return data;
};

/**
 * A custom hook to manage the state and logic for a dynamic form.
 *
 * @param {object} blueprint - The JSON blueprint for the form structure.
 * @param {object} initialData - (Optional) The existing data to populate the form with.
 */
export const useFormData = (blueprint, initialData) => {
  const [formData, setFormData] = useState(() =>
    blueprint?.sections
      ? initializeData(
          blueprint.sections.flatMap((section) => section.fields),
          initialData || []
        )
      : {}
  );

  /**
   * A generic utility function to set a value in a deeply nested object using a dot-separated path.
   * This version is array-aware and avoids converting arrays to objects.
   */
  const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    const lastKey = keys.pop();

    // A non-recursive, immutable approach using reduce for clarity
    const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

    const targetParent = keys.reduce((acc, key) => {
      // If a key is numeric, we're likely in an array path
      const isArrayIndex = !isNaN(parseInt(key, 10));
      const next = acc[key];

      // Create a copy of the nested structure to avoid mutation
      acc[key] = next
        ? Array.isArray(next)
          ? [...next]
          : { ...next }
        : isArrayIndex
        ? []
        : {};

      return acc[key];
    }, newObj);

    targetParent[lastKey] = value;

    return newObj;
  };

  /**
   * General handler for simple field changes.
   */
  const handleChange = (e, fieldPath) => {
    const { value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevData) => setNestedValue(prevData, fieldPath, newValue));
  };

  /**
   * Adds a new item to an array at a specified path.
   */
  const addArrayItem = (fieldPath, itemSchema) => {
    setFormData((prevData) => {
      // Create a new, empty item based on the schema's properties.
      const newItem = initializeData(itemSchema.properties);

      // Get the current array at the given path.
      const pathParts = fieldPath.split(".");
      const parentData = pathParts
        .slice(0, -1)
        .reduce((obj, key) => obj?.[key], prevData);
      const arrayName = pathParts[pathParts.length - 1];
      const currentArray = parentData?.[arrayName] || [];

      // Create a new array with the appended item.
      const newArray = [...currentArray, newItem];

      // Use the setNestedValue helper to update the state at the correct path.
      return setNestedValue(prevData, fieldPath, newArray);
    });
  };

  /**
   * Removes an item from an array at a specified index.
   */
  const removeArrayItem = (fieldPath, index) => {
    setFormData((prevData) => {
      // Retrieve the array from the nested path
      const pathParts = fieldPath.split(".");
      const currentArray = pathParts.reduce((obj, key) => obj?.[key], prevData);

      if (!Array.isArray(currentArray)) {
        console.error("Path does not lead to an array:", fieldPath);
        return prevData;
      }

      const newArray = currentArray.filter((_, i) => i !== index);
      return setNestedValue(prevData, fieldPath, newArray);
    });
  };

  return {
    formData,
    handleChange,
    addArrayItem,
    removeArrayItem,
  };
};
