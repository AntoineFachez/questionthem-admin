// functions/triggers/triggerDocCount.js

const admin = require("firebase-admin");
const { logger } = require("firebase-functions");
const {
  onDocumentCreated,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");
const { onCall } = require("firebase-functions/v2/https");

const db = admin.firestore();

// --- Configuration ---
const STATS_DOCUMENT_PATH = "_internal/dbStatistics";

const updateDataBaseStats = async (collectionName, incrementValue) => {
  if (collectionName === "_internal") {
    logger.info("Skipping counter update for internal collection.");
    return;
  }

  const statsDocRef = db.doc(STATS_DOCUMENT_PATH);

  try {
    await db.runTransaction(async (transaction) => {
      // READ the document first within the transaction
      const statsDoc = await transaction.get(statsDocRef);

      // Create a payload that only increments the counter for the specific collection
      const newPayload = {
        [collectionName]: {
          docCount: admin.firestore.FieldValue.increment(incrementValue),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
      };

      // Use a nested update to ensure atomicity and a clean merge
      transaction.set(
        statsDocRef,
        { collectionStats: newPayload },
        { merge: true },
      );
    });

    logger.info(
      `Counter for '${collectionName}' updated by ${incrementValue}.`,
    );
  } catch (error) {
    logger.error(`Error updating '${collectionName}' counter:`, error);
  }
};
exports.recalculateDatabaseStats = onCall(async (request) => {
  try {
    const collections = await getCollectionNames();

    const countPromises = collections.map(async (collectionName) => {
      const querySnapshot = await db.collection(collectionName).count().get();
      return {
        name: collectionName,
        docCount: querySnapshot.data().count,
      };
    });

    const results = await Promise.all(countPromises);

    const collectionStatsPayload = results.reduce((acc, { name, docCount }) => {
      acc[name] = {
        docCount: docCount,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      };
      return acc;
    }, {});

    const statsDocRef = db.doc("_internal/dbStatistics");
    await statsDocRef.set(
      { collectionStats: collectionStatsPayload },
      { merge: false },
    );

    // Return a success object instead of sending a response
    return { status: "success", message: "Recalculation successful." };
  } catch (error) {
    logger.error("Error during recalculation:", error);
    // Throw an error to be handled by the client
    throw new Error("Recalculation failed.");
  }
});
const getCollectionNames = async () => {
  try {
    const collections = await db.listCollections();
    const collectionNames = collections.map((collection) => collection.id);
    return collectionNames;
  } catch (error) {
    console.error("Error listing collections:", error);
    return [];
  }
};
/**
 * Cloud Function that increments a counter when a new document is created
 * in any top-level collection.
 */
exports.handleDocumentCreation = onDocumentCreated(
  {
    // This wildcard still captures any top-level collection.
    document: "{collectionName}/{docId}",
    memory: "512MiB",
  },
  async (event) => {
    try {
      // --- Task 1: Increment the Collection Counter ---
      const { collectionName } = event.params;
      const counterPromise = updateDataBaseStats(collectionName, 1);
      logger.info(`Incrementing counter for ${collectionName}.`);

      // --- Task 2: Add the 'createdAt' Timestamp ---
      // Get the document reference and its data from the event object.
      const docRef = event.data.ref;
      const data = event.data.data();

      let timestampPromise;

      // SAFETY CHECK: Only add the timestamp if it doesn't already exist.
      // This makes the function idempotent and prevents accidental overwrites
      // if the client ever starts sending its own `createdAt` field.
      if (!data.createdAt) {
        logger.info(`Adding 'createdAt' timestamp to ${event.params.docId}.`);
        timestampPromise = docRef.update({
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // If the field exists, do nothing. Resolve an empty promise.
        logger.info(
          `'createdAt' already exists on ${event.params.docId}. Skipping.`,
        );
        timestampPromise = Promise.resolve();
      }

      // --- Execute Both Tasks in Parallel ---
      // Promise.all waits for both the counter and the timestamp update to complete.
      // If either fails, it will throw an error and be caught by the catch block.
      await Promise.all([counterPromise, timestampPromise]);

      logger.info("Successfully handled document creation tasks.");
      return null; // A successful function should return null or a resolved promise.
    } catch (error) {
      logger.error("Error in handleDocumentCreation trigger:", error);
      // Depending on your needs, you might want to re-throw the error
      // to signal a failure to the Cloud Functions environment.
      throw error;
    }
  },
);

/**
 * Cloud Function that decrements a counter when a document is deleted
 * from any top-level collection.
 */
exports.handleDocumentDeletion = onDocumentDeleted(
  {
    document: "{collectionName}/{docId}",
    memory: "512MiB",
  },
  (event) => {
    const { collectionName } = event.params;
    return updateDataBaseStats(collectionName, -1);
  },
);

// const updateStatsDocument = async (statsDocRef, statsObject, merge) => {
//   try {
//     await statsDocRef.set({ collectionStats: statsObject }, { merge: merge });
//     logger.info(`Database stats document updated. Merge mode: ${merge}`);
//   } catch (error) {
//     logger.error("Error updating stats document:", error);
//     throw error;
//   }
// }; // Refactored function for incremental updates

// const logStatEvent = (collectionName, incrementValue) => {
//   // Don't await this, just fire and forget.
//   return db.collection("_internal/stat-events").add({
//     collectionName: collectionName,
//     change: incrementValue, // Will be +1 or -1
//     timestamp: admin.firestore.FieldValue.serverTimestamp(),
//   });
// };
// // Centralize the path to make it easy to change later.
// const COUNTER_COLLECTION_PATH = "_internal/statistics/collection-counts";

// // Helper function to update the counter for a given collection.
// const updateCollectionStats = async (collectionName, incrementValue) => {
//   // This trigger is configured for top-level collections.
//   // We should ignore any collections that are not meant to be counted,
//   // especially our internal one.
//   if (collectionName === "_internal") {
//     logger.info("Skipping counter update for internal collection.");
//     return;
//   }

//   // Construct the reference to the specific counter document in the subcollection.
//   const counterRef = db.collection(COUNTER_COLLECTION_PATH).doc(collectionName);

//   try {
//     // Use a transaction to safely increment the counter.
//     await db.runTransaction(async (transaction) => {
//       transaction.set(
//         counterRef,
//         {
//           count: admin.firestore.FieldValue.increment(incrementValue),
//           lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
//           mostReadCollection: [],
//         },
//         { merge: true }, // Use merge to create the doc if it doesn't exist.
//       );
//     });

//     logger.info(
//       `Counter for collection '${collectionName}' updated by ${incrementValue}.`,
//     );
//     // updateDataBaseStats(collectionName, incrementValue);
//   } catch (error) {
//     logger.error(
//       `Error updating counter for collection '${collectionName}':`,
//       error,
//     );
//   }
// };
