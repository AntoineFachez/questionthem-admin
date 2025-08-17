// functions/firestore/documentCountUpdater.js

const admin = require("firebase-admin");
const {
  onDocumentCreated,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");

const db = admin.firestore();

// A helper function to update the counter for a given collection.
const updateCounter = async (collectionName, incrementValue) => {
  const counterRef = db.collection("_meta_counters").doc(collectionName);
  const batch = db.batch();

  batch.set(
    counterRef,
    {
      count: admin.firestore.FieldValue.increment(incrementValue),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  try {
    await batch.commit();
    console.log(
      `v2 Counter for collection '${collectionName}' updated successfully with value ${incrementValue}.`,
    );
  } catch (error) {
    console.error(
      `v2 Error updating counter for collection '${collectionName}':`,
      error,
    );
  }
};

/**
 * Cloud Function that increments a counter when a new document is created.
 * We'll set the memory to 512 MiB to resolve the crash.
 */
const incrementCollectionCounter = onDocumentCreated(
  {
    document: "{collectionName}/{docId}",
    memory: "512MiB", // <--- Add this line to increase memory
  },
  async (event) => {
    const collectionName = event.params.collectionName;
    await updateCounter(collectionName, 1);
  },
);

/**
 * Cloud Function that decrements a counter when a document is deleted.
 * We'll also increase memory here for consistency.
 */
const decrementCollectionCounter = onDocumentDeleted(
  {
    document: "{collectionName}/{docId}",
    memory: "512MiB", // <--- Add this line to increase memory
  },
  async (event) => {
    const collectionName = event.params.collectionName;
    await updateCounter(collectionName, -1);
  },
);

module.exports = { incrementCollectionCounter, decrementCollectionCounter };
