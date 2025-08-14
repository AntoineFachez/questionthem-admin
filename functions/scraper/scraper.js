// functions/scraper/scraper.js

// NEW: Use specific imports from firebase-functions/v2
const { onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions"); // Use v2 logger for better logging
const { HttpsError } = require("firebase-functions/v2/https"); // For structured errors

// No need for cors or allowedOrigins here, as Firebase handles CORS for callable functions.
// const cors = require("cors");
// const allowedOrigins = require("../cors/allowedOrigins"); // Not needed for callable functions

/**
 * Callable Cloud Function to fetch content from a given URL.
 *
 * It expects data to be passed via a callable function request, e.g.:
 * `{ "url": "https://example.com" }`
 *
 * @param {object} data - The data passed to the callable function.
 * @param {string} data.url - The URL of the content to fetch.
 * @param {object} context - The context of the callable function call (contains auth, etc.).
 * @returns {Promise<string>} The fetched content as a string.
 * @throws {HttpsError} If the URL is missing, invalid, or fetching fails.
 */
const fetchContent = onCall(
  {
    memory: "512MiB",
    timeoutSeconds: 30, // Keep timeout for external calls
  },
  async (data, context) => {
    // --- Aggressive Diagnostics (Simplified for final version) ---
    // You can keep these console.logs if you like, but remember they are for debugging only
    // console.log(`>>> RAW DATA RECEIVED (via console.log):`, data);
    // console.log(`>>> TYPE OF DATA (via console.log): ${typeof data}`);
    // console.log(`>>> CONTEXT OBJECT (via console.log):`, context); // Don't stringify context

    // Use logger.info for standard Cloud Logging (simplified)
    logger.info("BACKEND_START: Raw data received:", data);
    logger.info("BACKEND_START: Type of data: ", typeof data);
    // Don't log context in production logs if it's too verbose/circular
    // logger.info(`BACKEND_START: Context object received:`, context);

    // --- THE CRITICAL FIX: ACCESSING THE NESTED 'data.url' ---
    const payload = data.data; // The actual payload is nested under 'data' property
    const url = payload?.url; // Access 'url' from this payload

    // --- AGGRESSIVE VALIDATION OF THE 'payload' OBJECT ---
    if (
      !payload || // Check if payload itself is null/undefined
      typeof payload !== "object" || // Check if payload is an object
      !("url" in payload) || // Check if 'url' property exists in payload
      typeof url !== "string" // Check if 'url' is a string
    ) {
      logger.error(
        "CRITICAL_VALIDATION_FAILURE: Data payload is malformed or missing 'url' string property.",
      );
      // Log received 'data' and 'context' directly for debugging.
      logger.error("Received full 'data' object:", data);
      logger.error("Received 'context' object:", context);

      throw new HttpsError(
        "invalid-argument",
        "CRITICAL: The request data payload is malformed or missing the 'url' parameter as a string at the root level.",
      );
    }

    // Original URL validation (now correct because 'url' is correctly extracted)
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      logger.error(`fetchContent: Invalid URL format: "${url}"`);
      throw new HttpsError(
        "invalid-argument",
        "The provided URL must start with http:// or https://.",
      );
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        logger.error(
          `Error fetching content from ${url}: HTTP status ${response.status} - ${response.statusText}`,
        );
        throw new HttpsError(
          "internal",
          `Failed to fetch content from ${url}: ${response.statusText}`,
        );
      }

      const content = await response.text();

      logger.info(
        `Successfully fetched content from ${url}. Content length: ${content.length}`,
      );
      return content;
    } catch (err) {
      logger.error(`Error fetching content from ${url}:`, err);
      throw new HttpsError(
        "unavailable",
        `Could not retrieve content from ${url}. Reason: ${err.message}`,
      );
    }
  },
);

module.exports = {
  fetchContent,
};
