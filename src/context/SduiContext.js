"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const SduiContext = createContext();

export function SduiProvider({ children, widgetIds }) {
  const [blueprints, setBlueprints] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(widgetIds);

  useEffect(() => {
    async function fetchBlueprints() {
      try {
        const promises = widgetIds.map((id) =>
          fetch(
            // `https://europe-west1-questionthem-90ccf.cloudfunctions.net/api/sdui/widgets/${id}`
            // `https://europe-west1-questionthem-90ccf.cloudfunctions.net/api/sdui/widgets/${"userDashboard"}`
            `https://europe-west1-questionthem-90ccf.cloudfunctions.net/api/sdui/widgets/userDashboard`
          ).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch blueprint for ID: ${id}`);
            }
            return res.json();
          })
        );
        const results = await Promise.all(promises);
        const newBlueprints = results.reduce((acc, curr, index) => {
          acc[widgetIds[index]] = curr.data;
          return acc;
        }, {});
        setBlueprints(newBlueprints);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (widgetIds && widgetIds.length > 0) {
      fetchBlueprints();
    } else {
      setLoading(false);
    }
  }, [widgetIds]);

  return (
    <SduiContext.Provider value={{ blueprints, loading, error }}>
      {children}
    </SduiContext.Provider>
  );
}

export function useSduiBlueprint(id) {
  const context = useContext(SduiContext);
  if (context === undefined) {
    throw new Error("useSduiBlueprint must be used within an SduiProvider");
  }
  return {
    blueprint: context.blueprints[id],
    loading: context.loading,
    error: context.error,
  };
}
