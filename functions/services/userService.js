// functions/services/userService.js

const admin = require("firebase-admin");

/**
 * Creates a user profile document in Firestore if one doesn't already exist.
 * @param {object} options - The options for creating the profile.
 * @param {object} options.logger - The Firebase Functions logger instance.
 * @param {object} options.user - The Firebase Auth user record.
 * @returns {Promise<void>}
 */
async function createUserProfile({ logger, user }) {
  const userRef = admin.firestore().doc(`users/${user.uid}`);

  try {
    const doc = await userRef.get();
    if (doc.exists) {
      logger.info(
        `Firestore document for user ${user.uid} already exists. No action taken.`,
      );
      return;
    }

    logger.info(`Creating Firestore document for new user: ${user.uid}`);
    await userRef.set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    logger.error(`Failed to create user profile for ${user.uid}:`, error);
    // Re-throw to let the trigger function know something went wrong
    throw new Error(`Firestore operation failed: ${error.message}`);
  }
}

module.exports = { createUserProfile };
