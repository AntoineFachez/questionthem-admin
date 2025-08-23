// src/components/dynamicform/DynamicForm.js
import React, { useMemo, useCallback, useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { Masonry } from "@mui/lab";

import { useUIContext } from "../../../context/UIContext";
import { useFormData } from "./useFormData";

import Accordion from "../../../components/accordion/DynamicAccordion";
import SimpleTree from "../../../components/treeView/SimpleTree";

import { renderFields } from "./renderFields";

const DynamicForm = ({ onSubmit }) => {
  const { activeBlueprint, initialFormValues } = useUIContext();
  const {
    formData,
    handleChange,
    addArrayItem,
    removeArrayItem,
    handleArrayItemChange,
  } = useFormData(activeBlueprint, initialFormValues);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(formData);
    },
    [onSubmit, formData]
  );

  const handlers = useMemo(
    () => ({
      handleChange,
      addArrayItem,
      removeArrayItem,
      handleArrayItemChange,
    }),
    [handleChange, addArrayItem, removeArrayItem, handleArrayItemChange]
  );

  const renderSummary = useCallback(
    (section) => (
      <Typography variant="body1">{section?.description}</Typography>
    ),
    []
  );

  const renderDetail = useCallback(
    (section) => (
      <Box
        sx={{
          display: "flex",
          flexFlow: "row wrap",
          gap: 0,
        }}
      >
        {renderFields({ fields: section?.fields, formData, handlers })}
      </Box>
    ),
    [formData, handlers]
  );
  const handleClickItem = (section) => {
    console.log("section", section);

    setSectionInFocus(section);
  };
  const [sectionInFocus, setSectionInFocus] = useState({});
  if (!activeBlueprint) return null;
  return (
    <Box
      sx={{
        // width: "100%",
        // height: "100%",
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "30%",
          // height: "100%",
          display: "flex",
          flexFlow: "row nowrap",
          justifyContent: "flex-start",
        }}
      >
        <SimpleTree
          items={activeBlueprint.sections}
          handleClickItem={handleClickItem}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          // height: "100%",
          display: "flex",
          flexFlow: "column nowrap",
          justifyContent: "center",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            // height: "100%",
            // display: "flex",
            // flexFlow: "column nowrap",
            justifyContent: "center",
          }}
        >
          {activeBlueprint?.sections?.map((section, index) => (
            <Box
              key={index}
              sx={{
                mb: 0,
                display: "flex",
                flexFlow: "column nowrap",
                justifyContent: "center",
              }}
            >
              {section === sectionInFocus && (
                <>
                  {renderSummary(section)}
                  {renderDetail(section)}
                </>
              )}
            </Box>
          ))}
        </Box>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default DynamicForm;
