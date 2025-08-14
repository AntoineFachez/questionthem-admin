// functions/users/onCreate.js

// NEW: Use specific imports from firebase-functions/v2
const { onAll } = require("firebase-functions/v2/auth"); // For user creation/deletion events
const { logger } = require("firebase-functions"); // Use v2 logger for consistent logging

const admin = require("firebase-admin"); // Assumes admin is initialized in index.js

// Ensure admin is initialized if it's not done in index.js globally.
// This block makes sure `admin` is ready if this file is imported standalone.
if (!admin.apps.length) {
  admin.initializeApp();
}

// Assuming 'email-sender' is a module you've created or a third-party library
const emailSender = require("email-sender");

/**
 * Background Function triggered when a new Firebase Auth user is created.
 *
 * @param {object} event - The Cloud Functions event.
 * @param {object} event.data - The user record object from Firebase Auth.
 * @param {string} event.data.uid - The user's unique ID.
 * @param {string} event.data.email - The user's email address.
 * @param {object} event.data.metadata - User metadata, including creation time.
 * @param {string} event.data.metadata.createdAt - ISO string of creation time.
 * @param {object} context - The context of the event.
 */
const helloAuth = onAll(
  {
    // Options passed directly to the function definition.
    // Region set globally in index.js via setGlobalOptions, but can be overridden here.
    memory: "128MiB", // A reasonable default for a background function
    timeoutSeconds: 30, // Default timeout for background functions
  },
  async (event) => {
    // 'event' contains the user data directly
    const user = event.data; // The user record is now directly in event.data

    if (!user || !user.uid) {
      logger.error("helloAuth: User data or UID is missing from the event.");
      return; // Exit if no user data
    }

    logger.info(
      `Auth trigger for user: ${user.uid} (email: ${user.email || "N/A"})`,
    );
    logger.info(`User created at: ${user.metadata?.createdAt}`);

    if (!user.email) {
      logger.warn(
        `User ${user.uid} does not have an email address. Skipping email sending.`,
      );
      return; // Cannot send welcome email without an email address
    }

    const emailContent = {
      to: user.email,
      from: "your-noreply-email@yourdomain.com", // **IMPORTANT: Replace with your actual verified sender email**
      subject: "Welcome to our app!",
      template: "welcome_email", // Ensure this template exists in your email-sender setup
      data: {
        name: user.displayName || user.email, // Use display name if available, otherwise email
      },
    };

    const userRef = admin.firestore().doc(`users/${user.uid}`); // Use user.uid for consistency

    try {
      // Check if the user document exists and retrieve existing data if needed
      const docSnapshot = await userRef.get();
      if (docSnapshot.exists) {
        const userDataFromFirestore = docSnapshot.data();
        logger.info(
          `Firestore document for user ${user.uid} found. Email in Firestore: ${userDataFromFirestore?.userMail}`,
        );
        // You might compare user.email with userDataFromFirestore.userMail here
      } else {
        logger.info(
          `Firestore document for user ${user.uid} does not exist. Creating basic document.`,
        );
        // Optionally create a basic user document if it doesn't exist
        await userRef.set(
          {
            uid: user.uid,
            email: user.email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            // Add other initial user data as needed
          },
          { merge: true },
        ); // Use merge: true to avoid overwriting existing fields
      }

      logger.info(`Attempting to send welcome email to ${user.email}.`);
      await emailSender.send(emailContent);
      logger.info(`Successfully sent welcome email to ${user.email}.`);
    } catch (err) {
      // Use logger.error for errors in background functions
      logger.error(
        `Error processing auth event for user ${user.uid} or sending email:`,
        err,
      );
      // For background functions, don't use res.status or throw HttpsError
      // Logging the error is sufficient.
    }
  },
);

module.exports = { helloAuth, emailSender };
