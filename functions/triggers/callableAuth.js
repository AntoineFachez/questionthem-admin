// functions/users/onCreate.js

const { onCreate } = require("firebase-functions/v2/auth"); // ✅ Corrected to onCreate
const { logger } = require("firebase-functions");
const { createUserProfile } = require("../services/userService");
const { sendWelcomeEmail } = require("../services/emailService");

/**
 * Background Function triggered when a new Firebase Auth user is created.
 * It creates a user profile and sends a welcome email.
 */
exports.handleUserCreate = onCreate(
  {
    memory: "128MiB",
  },
  async (event) => {
    const user = event.data;
    logger.info(`New user signup: ${user.uid} (email: ${user.email || "N/A"})`);

    try {
      // We can run these tasks in parallel
      await Promise.all([
        createUserProfile({ logger, user }),
        sendWelcomeEmail({ logger, user }),
      ]);
      logger.info(`Successfully processed new user ${user.uid}.`);
    } catch (error) {
      // The services will log the specifics, this is a top-level catch
      logger.error(`Failed to process new user ${user.uid}:`, error.message);
    }
  },
);
