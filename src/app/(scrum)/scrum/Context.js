// app/analyticsAndReporting/Context.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { widgetSpex } from "./widgetSpex.json";
import scrumStepsCQRS from "../../../lib/pitchScrumData/scrumStepsKnowledgGraph.json";

const Context = createContext(null);

/**
 * The WidgetContext component manages the state for the Widget.
 * @param {object} children - The child components that will have access to this context.
 */
export function WidgetContext({ children }) {
  const [widgetData, setWidgetData] = useState(pitchData);
  const [activeUiContext, setActiveUiContext] = useState("steps");
  const [activeStep, setActiveStep] = useState({});
  const header = scrumStepsCQRS.pitchDeckTitle;

  const updateWidgetData = (newData) => {
    setWidgetData(newData);
  };

  const contextValue = {
    widgetData,
    activeUiContext,
    setActiveUiContext,
    activeStep,
    setActiveStep,
    updateWidgetData,
    header,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

/**
 * A custom hook to easily consume the Context.
 */
export function useWidgetContext() {
  const context = useContext(Context);
  if (context === null) {
    throw new Error("useWidgetContext must be used within a WidgetContext.");
  }
  return context;
}
