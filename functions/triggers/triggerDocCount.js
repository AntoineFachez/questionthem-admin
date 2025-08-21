// functions/triggers/triggerDocCount.js

const admin = require("firebase-admin");
const { logger } = require("firebase-functions");
const {
  onDocumentCreated,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");

const db = admin.firestore();

// --- Configuration ---
// Centralize the path to make it easy to change later.
const COUNTER_COLLECTION_PATH = "_internal/statistics/collection-counts";

// Helper function to update the counter for a given collection.
const updateCounter = async (collectionName, incrementValue) => {
  // This trigger is configured for top-level collections.
  // We should ignore any collections that are not meant to be counted,
  // especially our internal one.
  if (collectionName === "_internal") {
    logger.info("Skipping counter update for internal collection.");
    return;
  }

  // Construct the reference to the specific counter document in the subcollection.
  const counterRef = db.collection(COUNTER_COLLECTION_PATH).doc(collectionName);

  try {
    // Use a transaction to safely increment the counter.
    await db.runTransaction(async (transaction) => {
      transaction.set(
        counterRef,
        {
          count: admin.firestore.FieldValue.increment(incrementValue),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }, // Use merge to create the doc if it doesn't exist.
      );
    });

    logger.info(
      `Counter for collection '${collectionName}' updated by ${incrementValue}.`,
    );
  } catch (error) {
    logger.error(
      `Error updating counter for collection '${collectionName}':`,
      error,
    );
  }
};

/**
 * Cloud Function that increments a counter when a new document is created
 * in any top-level collection.
 */
exports.incrementCollectionCounter = onDocumentCreated(
  {
    // This wildcard captures any top-level collection.
    document: "{collectionName}/{docId}",
    memory: "512MiB",
  },
  (event) => {
    const { collectionName } = event.params;
    return updateCounter(collectionName, 1);
  },
);

/**
 * Cloud Function that decrements a counter when a document is deleted
 * from any top-level collection.
 */
exports.decrementCollectionCounter = onDocumentDeleted(
  {
    document: "{collectionName}/{docId}",
    memory: "512MiB",
  },
  (event) => {
    const { collectionName } = event.params;
    return updateCounter(collectionName, -1);
  },
);
