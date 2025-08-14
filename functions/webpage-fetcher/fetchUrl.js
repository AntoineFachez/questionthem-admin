// functions/webpage-fetcher/fetchUrl.js

// NEW: Use specific imports from firebase-functions/v2
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions"); // Use v2 logger for consistent logging

const cors = require("cors");
const allowedOrigins = require("../cors/allowedOrigins"); // Ensure this path is correct

/**
 * HTTP Function to fetch webpage content and return as JSONP.
 *
 * It expects GET requests with query parameters:
 * - `url`: The URL of the webpage to fetch.
 * - `callback`: The name of the JavaScript callback function for JSONP.
 */
const fetchPage = onRequest(
  {
    // Options passed directly to the function definition.
    // The region will be picked up from setGlobalOptions in index.js,
    // but you can override it here if needed: region: 'europe-west1',
    memory: "128MiB", // A reasonable default for fetching content
    timeoutSeconds: 30, // Adjust timeout as needed for web requests
  },
  async (req, res) => {
    // CORS handling: Use the imported `cors` middleware
    const corsHandler = cors({ origin: allowedOrigins });
    corsHandler(req, res, async () => {
      // Handle OPTIONS preflight request (crucial for CORS)
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }

      // Ensure it's a GET request for fetching content
      if (req.method !== "GET") {
        logger.warn(
          `fetchPage: Method Not Allowed - ${req.method}. Only GET requests are accepted.`,
        );
        return res
          .status(405)
          .send("Method Not Allowed. Only GET requests are accepted.");
      }

      // Extract callback function name from query parameter
      const callbackName = req.query.callback;

      // Validate callback name (optional but recommended for JSONP)
      if (!callbackName || !/^[a-zA-Z0-9_.]+$/.test(callbackName)) {
        logger.error(
          `fetchPage: Invalid callback name provided: "${callbackName}"`,
        );
        return res.status(400).send("Invalid callback name.");
      }

      // URL to fetch
      const targetUrl = req.query.url;

      // Ensure URL is provided
      if (!targetUrl) {
        logger.error("fetchPage: Missing 'url' parameter.");
        return res.status(400).send("Missing URL parameter.");
      }

      // Basic URL validation (you might want more robust validation)
      if (
        !targetUrl.startsWith("http://") &&
        !targetUrl.startsWith("https://")
      ) {
        logger.error(`fetchPage: Invalid URL format: "${targetUrl}"`);
        return res
          .status(400)
          .send("The provided URL must start with http:// or https://.");
      }

      logger.info(
        `fetchPage: Attempting to fetch content from: "${targetUrl}" with callback: "${callbackName}"`,
      );

      try {
        // Fetch webpage content
        const response = await fetch(targetUrl);

        // Check for successful HTTP response
        if (!response.ok) {
          logger.error(
            `fetchPage: Error fetching ${targetUrl}: HTTP status ${response.status} - ${response.statusText}`,
          );
          return res
            .status(500)
            .send(`Error fetching content: ${response.statusText}`);
        }

        const content = await response.text(); // Get the content as text
        logger.info(
          `fetchPage: Successfully fetched content from ${targetUrl}. Content length: ${content.length}`,
        );

        // Wrap content in callback function call for JSONP
        const responseBody = `${callbackName}(${JSON.stringify(content)})`;

        // Set CORS headers and Content-Type for JSONP
        res.set({
          "Access-Control-Allow-Origin": "*", // Or restrict to specific origins in production
          "Content-Type": "application/javascript", // Essential for JSONP
        });

        // Send JSONP response
        res.send(responseBody);
      } catch (error) {
        logger.error(
          `fetchPage: Error during fetch operation for ${targetUrl}:`,
          error,
        );
        res.status(500).send(`Error fetching content: ${error.message}`);
      }
    });
  },
);

module.exports = {
  fetchPage,
};
