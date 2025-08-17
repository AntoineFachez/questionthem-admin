// src/components/dynamicform/DynamicForm.js
import React, { useMemo, useCallback, useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { Masonry } from "@mui/lab";

import { useFormData } from "./useFormData";
import { renderFields } from "./renderFields";
import Accordion from "../../components/accordion/DynamicAccordion";
import mockData from "../../lib/data/mockPersons.json";
import SimpleTree from "../treeView/SimpleTree";
import FormTreeView from "../treeView/SimpleTree";

const DynamicForm = ({ blueprint, onSubmit }) => {
  const {
    formData,
    handleChange,
    addArrayItem,
    removeArrayItem,
    handleArrayItemChange,
  } = useFormData(blueprint, mockData[0]);

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
          flexDirection: "column",
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
  if (!blueprint) return null;
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
        <FormTreeView
          items={blueprint.sections}
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
        <Box component="form" onSubmit={handleSubmit}>
          {blueprint.sections.map((section, index) => (
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
