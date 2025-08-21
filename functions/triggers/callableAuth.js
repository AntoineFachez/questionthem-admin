// functions/triggers/callableAuth.js

const { onUserCreated } = require("firebase-functions/v2/identity");
const admin = require("firebase-admin");
const { logger } = require("firebase-functions");

exports.handleUserCreate = onUserCreated(async (event) => {
  const user = event.data;
  const uid = user.uid;

  const userData = {
    email: user.email || "",
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await admin.firestore().collection("users").doc(uid).set(userData);
    logger.info(
      `Successfully created user profile in Firestore for UID: ${uid}`,
    );
  } catch (error) {
    logger.error(`Failed to create user profile for UID: ${uid}`, error);
  }
});
