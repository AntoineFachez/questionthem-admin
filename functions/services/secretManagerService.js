// functions/services/secretManagerService.js

const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

/**
 * Fetches and parses a JSON secret from Google Secret Manager.
 * @param {object} options - The options for fetching the secret.
 * @param {object} options.logger - The Firebase Functions logger instance.
 * @param {string} options.projectId - The Google Cloud project ID.
 * @param {string} options.secretName - The name of the secret to fetch.
 * @returns {Promise<object>} The parsed JSON object from the secret payload.
 * @throws {Error} If fetching or parsing fails.
 */
async function getJsonSecret({ logger, projectId, secretName }) {
  const client = new SecretManagerServiceClient();
  try {
    logger.info(`Accessing secret: ${secretName} in project: ${projectId}`);
    const [version] = await client.accessSecretVersion({
      name: client.secretVersionName(projectId, secretName, "latest"),
    });

    const payload = version.payload.data.toString("utf8");
    return JSON.parse(payload);
  } catch (error) {
    logger.error(`Failed to access or parse secret "${secretName}":`, error);
    throw new Error(`Could not retrieve secret: ${error.message}`);
  }
}

module.exports = { getJsonSecret };
