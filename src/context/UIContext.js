"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { blueprintMap } from "../lib/maps/blueprintMap";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [uiContext, setUiContext] = useState(false);
  const [openDialog, setOpenDialog] = useState(true);
  const [scrollDialog, setScrollDialog] = useState("paper");

  const [openForm, setOpenForm] = useState(true);
  const [activeBlueprint, setActiveBlueprint] = useState(
    blueprintMap["persons"]
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
  const handleOpenForm = (blueprint) => {
    handleOpenDialog("paper")();
    setActiveBlueprint(blueprint);
    setOpenForm(true);
  };

  const contextValue = {
    uiContext,
    setUiContext,
    openDialog,
    setOpenDialog,
    scrollDialog,
    setScrollDialog,
    openForm,
    setOpenForm,
    activeBlueprint,
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
