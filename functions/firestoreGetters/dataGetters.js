// functions/firestore/firestore.js

const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

/**
 * A simple handler that echoes back a message.
 * Note: This function's name 'getAllDocs' is misleading; renamed to 'echoHandler'.
 */
const echoHandler = async (req, res) => {
  const { name, message } = req.body.data;
  const responseMessage = `hey ${name}, thanks for saying "${message}", the echoHandler says hello too!`;
  sendSuccess(res, { result: responseMessage });
};

/**
 * Fetches all documents from the 'stories' collection.
 */
const getAllStoriesHandler = async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("stories").get();
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    sendSuccess(res, { posts });
  } catch (error) {
    logger.error("Error fetching stories:", error);
    sendError(res, "Failed to retrieve stories", 500, error.message);
  }
};
/**
 * An Express route handler that dynamically fetches a document from Firestore
 * based on the blueprint ID provided in the URL.
 */
const getDocByIdHandler = async (req, res) => {
  const { collection, docId } = req.params;

  // A simple security check to ensure the ID is valid.
  if (!docId || !/^[a-zA-Z0-9_]+$/.test(docId)) {
    return sendError(res, "Invalid blueprint ID format.", 400);
  }

  try {
    const docRef = admin.firestore().collection(collection).doc(docId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return sendError(res, `document with the id '${docId}' not found.`, 404);
    }

    sendSuccess(res, docSnap.data());
  } catch (error) {
    logger.error(`Error fetching document '${docId}':`, error);
    sendError(res, "Internal Server Error", 500);
  }
};
module.exports = {
  echoHandler,
  getAllStoriesHandler,
  getDocByIdHandler,
};
