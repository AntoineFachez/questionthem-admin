'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useUser } from './UserContext'; // Corrected the path to be a relative path

// Create the context with an initial empty state.
const FirestoreDataContext = createContext(null);

/**
 * The FirestoreDataProvider component manages the state for Firestore data fetching.
 * @param {object} children - The child components that will have access to this context.
 */
export function FirestoreDataProvider({ children }) {
  const { user, loading: userLoading } = useUser();
  const [dbOverview, setDbOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // A hardcoded list of collections to query.
  const collectionsToQuery = [
    '_meta_dataBlueprint',
    '_meta_schemas',
    '_meta_uiConfig',
    'administrations',
    'agencies',
    'companies',
    'events',
    'legislative_bodies',
    'locations',
    'organizations',
    'persons',
    'relationships',
    'scripts',
    'stories',
    'trumpcryptoworld',
    'videos',
  ];

  useEffect(() => {
    // Only run this effect if the user is authenticated and not loading.
    if (!userLoading && user) {
      const fetchDatabaseOverview = async () => {
        try {
          setLoading(true);
          setError(null);

          const db = getFirestore();
          const results = [];

          for (const collectionName of collectionsToQuery) {
            const querySnapshot = await getDocs(collection(db, collectionName));
            results.push({
              name: collectionName,
              docCount: querySnapshot.size,
            });
          }

          setDbOverview(results);
        } catch (e) {
          console.error('Error fetching database overview: ', e);
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDatabaseOverview();
    }
  }, [user, userLoading]);

  const contextValue = {
    dbOverview,
    loading,
    error,
  };

  return (
    <FirestoreDataContext.Provider value={contextValue}>
      {children}
    </FirestoreDataContext.Provider>
  );
}

/**
 * A custom hook to easily consume the FirestoreDataContext.
 */
export function useFirestoreData() {
  const context = useContext(FirestoreDataContext);
  if (context === null) {
    throw new Error(
      'useFirestoreData must be used within a FirestoreDataProvider.'
    );
  }
  return context;
}
