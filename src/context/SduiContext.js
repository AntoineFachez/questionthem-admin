"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const SduiContext = createContext();

export function SduiProvider({ children, uiBlueprintIds, readBlueprintIds }) {
  const [uiBlueprints, setUiBlueprints] = useState({});
  const [readBlueprints, setReadBlueprints] = useState({});
  const [writeBlueprints, setWriteBlueprints] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const partUrl = {
    baseUrl: "https://europe-west1-questionthem-90ccf.cloudfunctions.net",
  };

  const fetchBlueprints = async (ids) => {
    try {
      const promises = ids.map((id) =>
        fetch(`${partUrl.baseUrl}/api/sdui/ui/${id}`).then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch blueprint for ID: ${id}`);
          }
          return res.json();
        })
      );
      const results = await Promise.all(promises);
      const newBlueprints = results.reduce((acc, curr, index) => {
        acc[ids[index]] = curr.data;
        return acc;
      }, {});
      return newBlueprints;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const loadBlueprints = async (blueprintType, ids, setter) => {
      if (!ids || ids.length === 0) {
        setLoading(false);
        return;
      }

      const cachedBlueprints = localStorage.getItem(blueprintType);
      if (cachedBlueprints) {
        setter(JSON.parse(cachedBlueprints));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const fetchedBlueprints = await fetchBlueprints(ids);

        setter(fetchedBlueprints);

        localStorage.setItem(blueprintType, JSON.stringify(fetchedBlueprints));
      } catch (error) {
        console.error("Failed to fetch blueprints:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBlueprints("uiBlueprints", uiBlueprintIds, setUiBlueprints);
  }, [uiBlueprintIds, readBlueprintIds]);

  const contextValue = { uiBlueprints, readBlueprints, loading, error };
  return (
    <SduiContext.Provider value={contextValue}>{children}</SduiContext.Provider>
  );
}

export function useSduiBlueprint(id) {
  const context = useContext(SduiContext);
  if (context === undefined) {
    throw new Error("useSduiBlueprint must be used within an SduiProvider");
  }
  return {
    uiBlueprint: context.uiBlueprints[id],
    readBlueprint: context.readBlueprints[id],
    loading: context.loading,
    error: context.error,
  };
}
