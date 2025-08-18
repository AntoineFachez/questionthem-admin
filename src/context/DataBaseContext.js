"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useUser } from "./UserContext";
import { get, post } from "../app/api/api";

const DataBaseContext = createContext(null);

export function DataBaseProvider({ children }) {
  const { user, loading: userLoading } = useUser();
  const [dbOverview, setDbOverview] = useState([]);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDeleteCollection = async (collectionName) => {
    try {
      const response = await post(
        {
          feature: "datamanagement",
          action: "deleteCollection",
          collection: collectionName,
        },
        ""
      ); // Pass data first, then an empty string for the endpoint

      if (response.error) {
        throw new Error(response.error);
      }

      setDbOverview((prev) =>
        prev.filter((item) => item.name !== collectionName)
      );
      // Update local storage after deletion
      localStorage.setItem(
        "dbOverviewCache",
        JSON.stringify(
          dbOverview.filter((item) => item.name !== collectionName)
        )
      );
      console.log(`Collection ${collectionName} deleted successfully.`);
    } catch (e) {
      console.error("Error deleting collection: ", e);
      setError(e.message);
    }
  };

  useEffect(() => {
    if (!userLoading && user) {
      const CACHE_KEY = "dbOverviewCache";

      const fetchDatabaseOverview = async () => {
        setLoading(true);
        setError(null);
        try {
          const listResponse = await get("?action=listCollections");
          if (listResponse.error) {
            throw new Error(listResponse.error);
          }
          const { collections } = listResponse;
          const db = getFirestore();
          const results = [];

          for (const collectionName of collections) {
            const querySnapshot = await getDocs(collection(db, collectionName));
            results.push({
              name: collectionName,
              docCount: querySnapshot.size,
            });
          }

          setDbOverview(results);
          // 💡 Successfully fetched data, so save it to localStorage
          localStorage.setItem(CACHE_KEY, JSON.stringify(results));
        } catch (e) {
          console.error("Error fetching database overview: ", e);
          setError(e.message);
          // Set a trigger to try refetching on the next effect cycle
          setRefetchTrigger((prev) => prev + 1);
        } finally {
          setLoading(false);
        }
      };

      try {
        // 💡 Check if data exists in localStorage
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setDbOverview(parsedData);
          setLoading(false); // Data is ready, so stop loading
          console.log("Using cached data from localStorage.");
        } else {
          // 💡 No cached data, so fetch it
          console.log("No cache found. Fetching data...");
          fetchDatabaseOverview();
        }
      } catch (e) {
        // Handle potential parsing errors if localStorage data is corrupted
        console.error("Error parsing localStorage data:", e);
        // Force a fresh fetch if the cached data is invalid
        localStorage.removeItem(CACHE_KEY);
        fetchDatabaseOverview();
      }
    }
  }, [user, userLoading, refetchTrigger]); // `refetchTrigger` is now used to force a new fetch

  const contextValue = {
    dbOverview,
    loading,
    error,
    setError,
    handleDeleteCollection,
    setRefetchTrigger,
  };
  return (
    <DataBaseContext.Provider value={contextValue}>
      {children}
    </DataBaseContext.Provider>
  );
}

export function useFirestoreData() {
  const context = useContext(DataBaseContext);
  if (context === null) {
    throw new Error(
      "useFirestoreData must be used within a FirestoreDataProvider."
    );
  }
  return context;
}
