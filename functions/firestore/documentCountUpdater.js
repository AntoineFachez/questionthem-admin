// functions/firestore/documentCountUpdater.js

const admin = require("firebase-admin");
const {
  onDocumentCreated,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");

// The Admin SDK is now initialized in index.js, so we can just get the firestore instance.
const db = admin.firestore();

/**
 * Cloud Function that increments a counter when a new document is created.
 * This uses the v2 syntax with a Firestore event handler.
 */
const incrementCollectionCounter = onDocumentCreated(
  {
    document: "{collectionName}/{docId}",
  },
  async (event) => {
    // The collection name is now available in the event.params object.
    const collectionName = event.params.collectionName;

    // Get a reference to the counter document.
    const counterRef = db.collection("_meta_counters").doc(collectionName);
    const batch = db.batch();

    // Increment the 'count' field by 1.
    batch.set(
      counterRef,
      {
        count: admin.firestore.FieldValue.increment(1),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    try {
      await batch.commit();
      console.log(
        `v2 Counter for collection '${collectionName}' incremented successfully.`,
      );
    } catch (error) {
      console.error(
        `v2 Error incrementing counter for collection '${collectionName}':`,
        error,
      );
    }
  },
);

/**
 * Cloud Function that decrements a counter when a document is deleted.
 * This also uses the v2 syntax with a Firestore event handler.
 */
const decrementCollectionCounter = onDocumentDeleted(
  {
    document: "{collectionName}/{docId}",
  },
  async (event) => {
    const collectionName = event.params.collectionName;
    const counterRef = db.collection("_meta_counters").doc(collectionName);
    const batch = db.batch();

    // Decrement the 'count' field by 1.
    batch.set(
      counterRef,
      {
        count: admin.firestore.FieldValue.increment(-1),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    try {
      await batch.commit();
      console.log(
        `v2 Counter for collection '${collectionName}' decremented successfully.`,
      );
    } catch (error) {
      console.error(
        `v2 Error decrementing counter for collection '${collectionName}':`,
        error,
      );
    }
  },
);

module.exports = { incrementCollectionCounter, decrementCollectionCounter };
