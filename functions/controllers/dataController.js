// functions/controllers/dataController.js

const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

/**
 * Fetches all documents from the 'stories' collection.
 */
exports.getPaginatedDocs = (collectionName) => {
  return async (req, res) => {
    try {
      // Get query params, with defaults
      const limit = parseInt(req.query.limit) || 10;
      const startAfterId = req.query.startAfter; // This is our cursor

      const orderByField = req.query.orderBy || "createdAt";
      const direction = req.query.sortDirection || "desc"; // Default to 'desc'

      let query = admin
        .firestore()
        .collection(collectionName)
        .orderBy(orderByField, direction) // Use the dynamic direction
        .limit(limit);

      // If a cursor is provided, start the query after that document
      if (startAfterId) {
        const cursorDoc = await admin
          .firestore()
          .collection(collectionName)
          .doc(startAfterId)
          .get();
        if (cursorDoc.exists) {
          query = query.startAfter(cursorDoc);
        }
      }

      const snapshot = await query.get();

      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Get the ID of the very last document in this batch
      const lastVisibleId =
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1].id
          : null;

      // Return the documents for this page AND the cursor for the next page
      sendSuccess(res, { docs, lastVisibleId });
    } catch (error) {
      logger.error(
        `Error fetching paginated docs from ${collectionName}:`,
        error,
      );
      sendError(res, "Failed to retrieve documents", 500);
    }
  };
};
exports.getAllDocs = (collectionName) => {
  return async (req, res) => {
    try {
      // The collectionName is now pre-defined, not from req.params.
      const snapshot = await admin.firestore().collection(collectionName).get();
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      sendSuccess(res, { docs }); // Changed 'posts' to 'docs' for generic use
    } catch (error) {
      logger.error(`Error fetching docs from ${collectionName}:`, error);
      sendError(
        res,
        `Failed to retrieve documents from ${collectionName}`,
        500,
      );
    }
  };
};

/**
 * A factory that creates a handler to fetch a document from a SPECIFIC collection.
 * This makes our routes cleaner and more secure than using a dynamic collection from the URL.
 * @param {string} collectionName The Firestore collection to target.
 * @returns An Express route handler.
 */
exports.getDocFromCollection = (collectionName) => {
  return async (req, res) => {
    // const idToken = req.headers.authorization?.split("Bearer ")[1];

    // if (!idToken) {
    //   return sendError(res, "Authentication required.", 401);
    // }

    // We get the document ID from the URL params.
    const { docId } = req.params;

    if (!docId || !/^[a-zA-Z0-9_-]+$/.test(docId)) {
      return sendError(res, "Invalid document ID format.", 400);
    }

    try {
      // const decodedToken = await admin.auth().verifyIdToken(idToken);
      // const uid = decodedToken.uid;

      const docRef = admin.firestore().collection(collectionName).doc(docId);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return sendError(
          res,
          `Document '${docId}' not found in '${collectionName}'.`,
          404,
        );
      }

      sendSuccess(res, docSnap.data());
    } catch (error) {
      logger.error(
        `Error fetching document '${docId}' from '${collectionName}':`,
        error,
      );
      sendError(res, "Internal Server Error", 500);
    }
  };
};
/**
 * Searches the 'story_script_event_links' collection across multiple fields.
 * Looks for a matching ID in 'storyId', 'scriptId', and 'eventId'.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 */
exports.searchStoryScriptEventLinks = async (req, res) => {
  try {
    // Get the search ID from the URL query parameter (e.g., ?q=some-id)
    const { q } = req.query;

    if (!q) {
      return sendError(res, "Missing required query parameter: 'q'", 400);
    }

    const linksRef = admin.firestore().collection("story_script_event_links");

    // Create three separate query promises to run in parallel.
    // This is the standard way to perform an "OR" query on different fields in Firestore.
    const storyQuery = linksRef.where("storyId", "==", q).get();
    const scriptQuery = linksRef.where("scriptId", "==", q).get();
    const eventQuery = linksRef.where("eventId", "==", q).get();

    // Await all queries to complete concurrently
    const [storySnapshot, scriptSnapshot, eventSnapshot] = await Promise.all([
      storyQuery,
      scriptQuery,
      eventQuery,
    ]);

    // Use a Map to store unique results by their document ID.
    // This efficiently prevents duplicate documents in the final array.
    const uniqueResults = new Map();

    storySnapshot.forEach((doc) =>
      uniqueResults.set(doc.id, { id: doc.id, ...doc.data() }),
    );
    scriptSnapshot.forEach((doc) =>
      uniqueResults.set(doc.id, { id: doc.id, ...doc.data() }),
    );
    eventSnapshot.forEach((doc) =>
      uniqueResults.set(doc.id, { id: doc.id, ...doc.data() }),
    );

    // Convert the Map values back into an array
    const foundItems = Array.from(uniqueResults.values());

    sendSuccess(res, { foundItems });
  } catch (error) {
    logger.error("Error searching links:", error);
    sendError(res, "Failed to perform search", 500);
  }
};
/**
 * A simple handler that echoes back a message.
 */
exports.echo = async (req, res) => {
  // Renamed for clarity
  const { name, message } = req.body.data;
  const responseMessage = `hey ${name}, thanks for saying "${message}", the echoHandler says hello too!`;
  sendSuccess(res, { result: responseMessage });
};
