/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable indent */

// NEW: Use specific imports from firebase-functions/v2
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions"); // Use v2 logger for consistent logging

const cors = require("cors");
const allowedOrigins = require("../cors/allowedOrigins"); // Ensure this path is correct

// --- Updated Functions using v2 syntax ---

// wizardFuncRequest Function
const wizardFuncRequest = onRequest(
  {
    // Options passed directly to the function definition.
    // Region set globally in index.js via setGlobalOptions, but can be overridden here.
    // memory: "128MiB", // Set memory if needed, e.g., "128MiB"
    timeoutSeconds: 3, // Set timeout
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

      // Ensure it's a POST request if you expect `req.body.data`
      if (req.method !== "POST") {
        logger.warn(`wizardFuncRequest: Method Not Allowed - ${req.method}`);
        return res.status(405).json({
          error: "Method Not Allowed. Only POST requests are accepted.",
        });
      }

      const data = req.body.data; // Access data from the request body

      if (!data || !data.name || !data.message) {
        logger.error(
          "wizardFuncRequest: Missing 'name' or 'message' in request body data.",
        );
        return res
          .status(400)
          .json({ error: "Missing required fields (name, message) in data." });
      }

      logger.info(
        `wizardFuncRequest received data from ${data.name}: "${data.message}"`,
      );

      res.status(200).json({
        result: `hey ${data.name}, thanks for saying "${data.message}", wizardFuncRequest says hello too!`,
      });
    });
  },
);

// sayHelloAgain Function
const sayHelloAgain = onRequest(
  {
    // Options passed directly to the function definition.
    // region will be inherited from setGlobalOptions in index.js.
    // memory: "128MiB",
    timeoutSeconds: 3,
  },
  async (req, res) => {
    // CORS handling: Use the imported `cors` middleware
    const corsHandler = cors({ origin: allowedOrigins });
    corsHandler(req, res, async () => {
      // Handle OPTIONS preflight request
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }

      if (req.method !== "POST") {
        logger.warn(`sayHelloAgain: Method Not Allowed - ${req.method}`);
        return res.status(405).json({
          error: "Method Not Allowed. Only POST requests are accepted.",
        });
      }

      const data = req.body.data; // Access data from the request body

      if (!data || !data.name || !data.message) {
        logger.error(
          "sayHelloAgain: Missing 'name' or 'message' in request body data.",
        );
        return res
          .status(400)
          .json({ error: "Missing required fields (name, message) in data." });
      }

      logger.info(
        `sayHelloAgain received data from ${data.name}: "${data.message}"`,
      );

      res.status(200).send({
        // Changed to 200 for consistency, 201 is "Created"
        data: {
          message: `hey ${data.name}, thanks for saying "${data.message}", sayHelloAgain says hello too!`,
          receivedData: data, // Clarified `data` as `receivedData`
        },
      });
    });
  },
);

module.exports = { wizardFuncRequest, sayHelloAgain };
