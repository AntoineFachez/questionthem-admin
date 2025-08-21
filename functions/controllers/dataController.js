// functions/controllers/dataController.js

const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

/**
 * Fetches all documents from the 'stories' collection.
 */
exports.getPaginatedDocs = (collectionName, orderByField) => {
  return async (req, res) => {
    try {
      // Get query params, with defaults
      const limit = parseInt(req.query.limit) || 10;
      const startAfterId = req.query.startAfter; // This is our cursor

      // Start building the query
      let query = admin
        .firestore()
        .collection(collectionName)
        .orderBy(orderByField, "desc") // **Crucial: You MUST order by a field**
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
// exports.getAllDocs = (collectionName) => {
//   return async (req, res) => {
//     try {
//       // The collectionName is now pre-defined, not from req.params.
//       const snapshot = await admin.firestore().collection(collectionName).get();
//       const docs = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       sendSuccess(res, { docs }); // Changed 'posts' to 'docs' for generic use
//     } catch (error) {
//       logger.error(`Error fetching docs from ${collectionName}:`, error);
//       sendError(
//         res,
//         `Failed to retrieve documents from ${collectionName}`,
//         500,
//       );
//     }
//   };
// };

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

    if (!docId || !/^[a-zA-Z0-9_]+$/.test(docId)) {
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
 * A simple handler that echoes back a message.
 */
exports.echo = async (req, res) => {
  // Renamed for clarity
  const { name, message } = req.body.data;
  const responseMessage = `hey ${name}, thanks for saying "${message}", the echoHandler says hello too!`;
  sendSuccess(res, { result: responseMessage });
};
