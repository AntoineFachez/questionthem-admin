// functions/auth/secureAi.js

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { getJsonSecret } = require("../services/secretManagerService");

/**
 * Callable function demonstrating fetching a secret.
 * In a real app, you would use the secret to initialize a client.
 */
exports.secureDataExtractor = onCall({ memory: "512MiB" }, async (request) => {
  const projectId = process.env.PROJECT_ID;
  const secretName = "aiPlatForm"; // The secret to fetch

  try {
    const secretValue = await getJsonSecret({ logger, projectId, secretName });
    // Now you would use `secretValue` to initialize a client or perform an action
    logger.info(`Successfully retrieved secret "${secretName}".`);
    return {
      success: true,
      message: `Secret retrieved. Keys found: ${Object.keys(secretValue).join(
        ", ",
      )}`,
    };
  } catch (error) {
    throw new HttpsError(
      "internal",
      `Failed to process secure request: ${error.message}`,
    );
  }
});
