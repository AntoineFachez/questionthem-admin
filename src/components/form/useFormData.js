// src/components/dynamicform/useFormData.js
import { useState } from "react";
import mockPersons from "../../lib/data/mockPersons.json";

/**
 * A recursive helper function to build the initial form data structure.
 * It merges the blueprint's structure with existing data.
 */
const getInitialFormState = (blueprint, initialData = mockPersons) => {
  if (!blueprint || !blueprint.sections) {
    return {};
  }
  const initialState = {};

  const initializeFields = (fields, dataToMerge) => {
    const fieldState = {};
    fields.forEach((field) => {
      const fieldName = field.name;
      const initialValue = dataToMerge?.[fieldName];

      if (field.type === "object" && field.properties) {
        fieldState[fieldName] = initialValue
          ? initializeFields(field.properties, initialValue)
          : {};
      } else if (field.type === "array" && field.items) {
        fieldState[fieldName] = initialValue ? [...initialValue] : [];
      } else {
        fieldState[fieldName] = initialValue !== undefined ? initialValue : "";
      }
    });
    return fieldState;
  };

  blueprint.sections.forEach((section) => {
    const sectionData = initializeFields(section.fields, initialData);
    Object.assign(initialState, sectionData);
  });

  return initialState;
};

/**
 * A custom hook to manage the state and logic for a dynamic form.
 *
 * @param {object} blueprint - The JSON blueprint for the form structure.
 * @param {object} initialData - (Optional) The existing data to populate the form with.
 */
export const useFormData = (blueprint, initialData) => {
  const [formData, setFormData] = useState(() =>
    getInitialFormState(blueprint, initialData)
  );

  const setNestedValue = (obj, path, value) => {
    const [head, ...rest] = path.split(".");
    if (!obj) return {};
    return {
      ...obj,
      [head]: rest.length
        ? setNestedValue(obj[head], rest.join("."), value)
        : value,
    };
  };

  const handleChange = (e, fieldPath) => {
    const { value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevData) => setNestedValue(prevData, fieldPath, newValue));
  };

  const handleArrayItemChange = (e, fieldName, arrayIndex, propName) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const newArray = [...(prevData[fieldName] || [])];
      const newItem = {
        ...(newArray[arrayIndex] || {}),
        [propName]: value,
      };
      newArray[arrayIndex] = newItem;
      return {
        ...prevData,
        [fieldName]: newArray,
      };
    });
  };

  const addArrayItem = (fieldName, itemSchema) => {
    setFormData((prevData) => {
      const newItem = {};
      itemSchema.properties.forEach((prop) => {
        newItem[prop.name] = "";
      });
      return {
        ...prevData,
        [fieldName]: [...(prevData[fieldName] || []), newItem],
      };
    });
  };

  const removeArrayItem = (fieldName, index) => {
    setFormData((prevData) => {
      const newArray = prevData[fieldName].filter((_, i) => i !== index);
      return { ...prevData, [fieldName]: newArray };
    });
  };

  return {
    formData,
    handleChange,
    addArrayItem,
    removeArrayItem,
    handleArrayItemChange,
  };
};
