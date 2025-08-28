// src/lib/registries/data-actions.js
import { getFunctions, httpsCallable } from "firebase/functions";
import { get, post } from "../../app/api/api";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app, db, auth, storage, functions } from "../firebase/firebase-client";

export const callBackendFunction = async (functionName, data) => {
  // Use httpsCallable to create a reference to the backend function
  const callable = httpsCallable(functions, functionName);

  try {
    // Call the function and await the result
    const result = await callable(data);

    // The result.data property contains the data returned from the backend function
    return result;
  } catch (error) {
    // Handle errors from the function call
    console.error("Error calling backend function:", error);
    throw error;
  }
};
/**
 * A registry of actions for interacting with database statistics.
 */
const statsActions = {
  /**
   * Fetches the pre-calculated database overview document from Firestore.
   * This is a fast, single-document read.
   * @returns {Promise<object|null>} The statistics document data or null if it doesn't exist.
   */
  getDbStats: async () => {
    try {
      const docRef = doc(db, "_internal", "dbStatistics");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.warn("Statistics document does not exist yet.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching database overview:", error);
      throw error;
    }
  },

  /**
   * Performs a client-side recalculation of all collection document counts
   * and updates the central statistics document in Firestore.
   * This is a heavy operation and should be used for a "refresh" action.
   * @returns {Promise<Array<{name: string, docCount: number}>>} An array of the newly calculated counts.
   */
  recalculate: async () => {
    try {
      // Call the new backend Cloud Function to trigger the recalculation
      const response = await callBackendFunction("recalculateDatabaseStats");
      console.log("Recalculation successfully triggered.", response);
      return response.data; // Return the new stats if the function returns them
    } catch (error) {
      console.error("Error triggering recalculation:", error);
      throw error;
    }
  },
};

/**
 * A registry of actions for managing entire collections.
 */
const collectionActions = {
  /**
   * Deletes an entire collection via a backend call.
   * @param {string} collectionName - The name of the collection to delete.
   * @returns {Promise<{success: boolean, deletedCollection: string}>}
   */
  delete: async (collectionName) => {
    const response = await post({
      feature: "datamanagement",
      action: "deleteCollection",
      collection: collectionName,
    });

    if (response.error) {
      throw new Error(response.error);
    }
    return { success: true, deletedCollection: collectionName };
  },
};

// Main export, grouping actions by the resource they manage.
export const dbActions = {
  stats: statsActions,
  collections: collectionActions,
};
