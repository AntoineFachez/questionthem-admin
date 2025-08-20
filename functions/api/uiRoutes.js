// functions/api/uiRoutes.js

const admin = require("firebase-admin");
const { logger } = require("firebase-functions");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

const db = admin.firestore();

/**
 * A factory function that creates an Express handler for fetching a document
 * from a specified blueprint collection.
 * @param {string} collectionName The name of the Firestore collection to query (e.g., 'ui_blueprints').
 * @returns {Function} An async Express route handler.
 */
const createBlueprintHandler = (collectionName) => {
  return async (req, res) => {
    const { blueprintId } = req.params;

    if (!blueprintId || !/^[a-zA-Z0-9_]+$/.test(blueprintId)) {
      return sendError(res, "Invalid blueprint ID format.", 400);
    }

    try {
      const docRef = db.collection(collectionName).doc(blueprintId);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return sendError(
          res,
          `Blueprint '${blueprintId}' not found in '${collectionName}'.`,
          404,
        );
      }

      sendSuccess(res, docSnap.data());
    } catch (error) {
      logger.error(
        `Error fetching blueprint '${blueprintId}' from '${collectionName}':`,
        error,
      );
      sendError(res, "Internal Server Error", 500);
    }
  };
};

module.exports = {
  createBlueprintHandler,
};
