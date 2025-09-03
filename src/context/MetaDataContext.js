"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useUser } from "./UserContext";
import { dbActions } from "../lib/registries/dbActions";
import {
  app,
  db,
  auth,
  storage,
  functions,
  model,
} from "../lib/firebase/firebase-client";
import { doc, onSnapshot } from "firebase/firestore";
const MetaDataContext = createContext(null);

export function MetaDataProvider({ children }) {
  const { user, loading: userLoading } = useUser();

  // State is now the single stats object, not an array.
  const [dbStats, setDbStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log("stats", stats);

  // Use useCallback to memoize the fetch function.
  const fetchStats = useCallback(async () => {
    if (userLoading || !user) return;

    setLoading(true);
    setError(null);
    try {
      // Use the new, fast 'get' action.
      const results = await dbActions.stats.getDbStats();

      setDbStats(results);
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
      await dbActions.stats.recalculate();
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
      await dbActions.collections.delete(collectionName);
      // After a successful delete, the counts are stale, so we must recalculate.
      await handleRecalculateStats();
    } catch (e) {
      console.error("Error deleting collection: ", e);
      setError(e.message);
    }
  };
  useEffect(() => {
    const statsDocRef = doc(db, "_internal", "dbStatistics");

    // Set up the real-time listener
    const unsubscribe = onSnapshot(
      statsDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          // Document exists, update state with its data
          setDbStats(docSnapshot.data());
          setLoading(false);
          setError(null);
        } else {
          // Document does not exist
          setDbStats({});
          setLoading(false);
          setError("Document does not exist.");
        }
      },
      (err) => {
        // Handle any errors with the listener
        console.error("Error fetching db stats:", err);
        setError("Failed to load data.");
        setLoading(false);
      }
    );

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this runs only once

  const contextValue = {
    dbStats, // The main stats object.
    loading,
    error,
    setError,
    handleDeleteCollection,
    handleRecalculateStats, // Provide the new handler to the UI.
  };

  return (
    <MetaDataContext.Provider value={contextValue}>
      {children}
    </MetaDataContext.Provider>
  );
}

export function useMetaData() {
  const context = useContext(MetaDataContext);
  if (context === null) {
    throw new Error("useMetaData must be used within a MetaDataProvider.");
  }
  return context;
}
