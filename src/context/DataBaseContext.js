"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useUser } from "./UserContext";
import { dataActionRegistry } from "../core/registries/data-actions";

const DataBaseContext = createContext(null);

export function DataBaseProvider({ children }) {
  const { user, loading: userLoading } = useUser();

  // State is now the single stats object, not an array.
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the fetch function.
  const fetchStats = useCallback(async () => {
    if (userLoading || !user) return;

    setLoading(true);
    setError(null);
    try {
      // Use the new, fast 'get' action.
      const results = await dataActionRegistry.stats.getDbStats();

      setStats(results);
    } catch (e) {
      console.error("Error fetching database stats: ", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user, userLoading]);

  // Initial fetch when the user is available.
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handler for the heavy "recalculate" action.
  const handleRecalculateStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call the new 'recalculate' action.
      await dataActionRegistry.stats.recalculate();
      // After recalculating, fetch the fresh stats to update the UI.
      await fetchStats();
    } catch (e) {
      console.error("Error recalculating stats: ", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler for deleting a collection.
  const handleDeleteCollection = async (collectionName) => {
    try {
      // Use the new, cleaner 'delete' action.
      await dataActionRegistry.collections.delete(collectionName);
      // After a successful delete, the counts are stale, so we must recalculate.
      await handleRecalculateStats();
    } catch (e) {
      console.error("Error deleting collection: ", e);
      setError(e.message);
    }
  };

  const contextValue = {
    stats, // The main stats object.
    loading,
    error,
    setError,
    handleDeleteCollection,
    handleRecalculateStats, // Provide the new handler to the UI.
  };

  return (
    <DataBaseContext.Provider value={contextValue}>
      {children}
    </DataBaseContext.Provider>
  );
}

export function useDataBase() {
  const context = useContext(DataBaseContext);
  if (context === null) {
    throw new Error("useDataBase must be used within a DataBaseProvider.");
  }
  return context;
}
