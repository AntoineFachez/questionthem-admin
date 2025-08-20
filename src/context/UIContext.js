"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { blueprintMap } from "../lib/maps/blueprintMap";
import { mockDataMap } from "../lib/maps/mockDataMap";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [uiContext, setUiContext] = useState(false);

  const [activeWidget, setActiveWidget] = useState({
    key: "dynamicForm",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [scrollDialog, setScrollDialog] = useState("paper");
  const [dialogTitle, setDialogTitle] = useState("");

  const [openForm, setOpenForm] = useState(true);
  const [formDataContext, setFormDataContext] = useState("persons");
  const [activeBlueprint, setActiveBlueprint] = useState({});
  const [initialFormValues, setInitialFormValues] = useState(
    mockDataMap[formDataContext]?.[0]
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleOpenDialog = (scrollType) => () => {
    setOpenDialog(true);
    setScrollDialog(scrollType);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenForm = (collectionName) => {
    const blueprint = blueprintMap[collectionName];
    handleOpenDialog("paper")();

    setFormDataContext(collectionName);
    setActiveBlueprint(blueprint);
    setOpenForm(true);
  };
  useEffect(() => {
    setDialogTitle(activeBlueprint?.title);
    setInitialFormValues(mockDataMap[formDataContext]?.[0]);
    return () => {};
  }, [activeBlueprint, formDataContext]);

  const contextValue = {
    uiContext,
    setUiContext,

    openDialog,
    setOpenDialog,
    scrollDialog,
    setScrollDialog,
    dialogTitle,
    setDialogTitle,

    openForm,
    setOpenForm,
    formDataContext,
    setFormDataContext,
    activeBlueprint,
    initialFormValues,
    setInitialFormValues,

    activeWidget,
    setActiveWidget,

    handleOpenDialog,
    handleCloseDialog,
    handleOpenForm,

    loading,
    error,
  };

  return (
    <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>
  );
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (context === null) {
    throw new Error("useUI must be used within a UIProvider.");
  }
  return context;
}
