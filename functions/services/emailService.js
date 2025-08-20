// functions/services/emailService.js

// This is a placeholder for your actual email sending library
const emailSender = require("email-sender");

/**
 * Sends a welcome email to a new user.
 * @param {object} options - The options for sending the email.
 * @param {object} options.logger - The Firebase Functions logger instance.
 * @param {object} options.user - The Firebase Auth user record.
 * @returns {Promise<void>}
 * @throws {Error} If the user has no email or if sending fails.
 */
async function sendWelcomeEmail({ logger, user }) {
  if (!user.email) {
    logger.warn(
      `User ${user.uid} does not have an email. Skipping welcome email.`,
    );
    return;
  }

  const emailContent = {
    to: user.email,
    from: "noreply@yourdomain.com", // Replace with your verified sender
    subject: "Welcome to the App!",
    template: "welcome_email",
    data: {
      name: user.displayName || user.email,
    },
  };

  try {
    logger.info(`Attempting to send welcome email to ${user.email}.`);
    await emailSender.send(emailContent);
    logger.info(`Successfully sent welcome email to ${user.email}.`);
  } catch (error) {
    // Log the error and re-throw it to be handled by the trigger
    logger.error(`Failed to send welcome email to ${user.email}:`, error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

module.exports = { sendWelcomeEmail };
