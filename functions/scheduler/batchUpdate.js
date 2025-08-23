const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

exports.batchUpdateStats = onSchedule(
  { schedule: "0 0 * * *", memory: "512MiB", maxInstances: 1 },
  async (event) => {
    const eventsCollection = db.collection("_internal/stat-events");
    const snapshot = await eventsCollection.get();

    if (snapshot.empty) {
      logger.info("No stat events to process.");
      return null;
    }

    // 1. Aggregate all the changes in memory.
    const changes = {}; // e.g., { users: 3, reports: -1 }
    snapshot.forEach((doc) => {
      const { collectionName, change } = doc.data();
      changes[collectionName] = (changes[collectionName] || 0) + change;
    });

    // 2. Update your main stats document in one transaction.
    const statsDocRef = db.doc("_internal/statistics");
    await db.runTransaction(async (transaction) => {
      for (const collectionName in changes) {
        const incrementValue = changes[collectionName];
        const payload = {
          collectionCounts: {
            [collectionName]: {
              docCount: admin.firestore.FieldValue.increment(incrementValue),
              lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            },
          },
        };
        transaction.set(statsDocRef, payload, { merge: true });
      }
    });

    // 3. Delete the processed events.
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    logger.info(`Processed ${snapshot.size} stat events.`);
    return null;
  },
);
