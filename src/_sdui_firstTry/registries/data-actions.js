// src/lib/registries/data-actions.js
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

const db = getFirestore();

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
      const docRef = doc(db, "_internal", "statistics");
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
    // 1. Get the list of all collection names from our backend API.
    const listResponse = await get("?action=listCollections");
    if (listResponse.error) {
      throw new Error(listResponse.error);
    }
    const { collections } = listResponse;

    // 2. Concurrently fetch the document count for each collection.
    const countPromises = collections.map(async (collectionName) => {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return {
        name: collectionName,
        docCount: querySnapshot.size,
      };
    });

    const results = await Promise.all(countPromises);

    // 3. Build the payload for the single statistics document.
    const collectionStatsPayload = results.reduce((acc, { name, docCount }) => {
      acc[name] = {
        docCount: docCount,
        lastUpdated: serverTimestamp(),
      };
      return acc;
    }, {});

    // 4. Write the updated stats to the central document.
    try {
      const statsDocRef = doc(db, "_internal", "statistics");
      await setDoc(
        statsDocRef,
        { collectionStats: collectionStatsPayload },
        { merge: true }
      );
      console.log("Successfully refreshed the database overview document.");
    } catch (error) {
      console.error("Error updating database overview document:", error);
      throw error; // Re-throw so the UI can know the write failed.
    }

    // 5. Return the fresh data to the UI.
    return results;
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
export const dataActionRegistry = {
  stats: statsActions,
  collections: collectionActions,
};
