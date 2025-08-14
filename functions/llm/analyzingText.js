/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable indent */

// NEW: Use specific imports from firebase-functions/v2
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions"); // Use v2 logger for better logging
const { onCall, HttpsError } = require("firebase-functions/v2/https"); // Use v2 HttpsError

// Imports the Google Cloud client library
const language = require("@google-cloud/language");
const cors = require("cors");
const allowedOrigins = require("../cors/allowedOrigins");

// Instantiates a client for Google Cloud Natural Language API
const client = new language.LanguageServiceClient();
const encodingType = "UTF8"; // UTF16 UTF32

// Helper function for sentiment categorization
const categorizeScore = (score) => {
  if (score > 0.25) {
    return "positive";
  } else if (score < -0.25) {
    return "negative";
  }
  return "neutral";
};

// --- Updated Functions using v2 syntax ---

// analyzeSentiment Function
const analyzeSentiment = onRequest(
  {
    // Options passed directly to the function definition
    // Region set globally in index.js, but can be overridden here
    memory: "512MiB", // Example: set memory here if needed
    timeoutSeconds: 3,
  },
  async (req, res) => {
    // CORS handling directly within the function
    const corsHandler = cors({ origin: allowedOrigins });
    corsHandler(req, res, async () => {
      // Handle OPTIONS preflight request
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }

      const data = req.body.data;
      const message = data?.message; // Use optional chaining for safety

      if (!message) {
        logger.error("analyzeSentiment: No message provided in request body.");
        return res
          .status(400)
          .send({ data: { error: "Message is required." } });
      }

      logger.info(`ANALYZING SENTIMENT FOR MESSAGE: "${message}"`);

      try {
        const results = await client.analyzeSentiment({
          document: { content: message, type: "PLAIN_TEXT" },
          encodingType,
        });

        const sentimentScore = results[0].documentSentiment.score;
        const category = categorizeScore(sentimentScore);

        res.status(200).send({ data: { message, category, sentimentScore } });
      } catch (error) {
        logger.error("Error detecting sentiment:", error);
        // Using HttpsError is generally for callable functions, but if you want
        // a structured error, you can still construct it and send its details.
        res.status(500).send({
          data: {
            error: "Failed to analyze sentiment.",
            details: error.message,
          },
        });
      }
    });
  },
);

// analyzingSyntax Function
const analyzingSyntax = onRequest(
  {
    // Options passed directly to the function definition
    memory: "512MiB", // Example: set memory here if needed
    timeoutSeconds: 3,
  },
  async (req, res) => {
    const corsHandler = cors({ origin: allowedOrigins });
    corsHandler(req, res, async () => {
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }

      const data = req.body.data;
      const message = data?.message;

      if (!message) {
        logger.error("analyzingSyntax: No message provided in request body.");
        return res
          .status(400)
          .send({ data: { error: "Message is required." } });
      }

      logger.info(`ANALYZING SYNTAX FOR MESSAGE: "${message}"`);

      try {
        const [response] = await client.analyzeSyntax({
          document: { content: message, type: "PLAIN_TEXT" },
          encodingType,
        });

        // The original code was logging tokens, now sending the whole response
        res.status(200).send({ data: { message, syntaxResponse: response } });
      } catch (error) {
        logger.error("Error analyzing syntax:", error);
        res.status(500).send({
          data: {
            error: "Failed to analyze syntax.",
            details: error.message,
          },
        });
      }
    });
  },
);

// extractEntities Function
const extractEntities = onCall(
  {
    // memory: "1GB", // Keep increased memory
    memory: "512MiB", // Keep increased memory
    timeoutSeconds: 180, // Keep increased timeout
  },
  async (data, context) => {
    // --- THE CRITICAL FIX: ACCESSING THE NESTED 'data.data.message' ---
    const payload = data.data; // The actual payload is nested under 'data' property
    const message = payload?.message; // Access 'message' from this payload

    if (!message) {
      logger.error(
        "extractEntities: No message provided in callable function data.",
      );
      throw new HttpsError(
        "invalid-argument",
        "The function must be called with a 'message' argument.",
      );
    }

    logger.info(
      `EXTRACTING ENTITIES FROM MESSAGE: "${message.substring(0, 100)}..."`,
    ); // Log shorter message

    try {
      const [response] = await client.analyzeEntities({
        document: { content: message, type: "PLAIN_TEXT" },
        encodingType,
      });

      // Return data directly from onCall function
      return { message, entitiesResponse: response };
    } catch (error) {
      logger.error("Error extracting entities:", error);
      throw new HttpsError(
        "internal",
        `Failed to extract entities: ${error.message}`,
        { originalError: error.message },
      );
    }
  },
);
// standIn1 Function (adjusted to fit the v2 HTTP function pattern)
// This function was generic, I've kept its original logic.
const standIn1 = onRequest(
  {
    // Options passed directly to the function definition
    memory: "512MiB", // Example: set memory here if needed
    timeoutSeconds: 3,
  },
  async (req, res) => {
    // Note: The original `cors("*")(req, res, async () => { ... })` is simplified here
    // to just `cors({ origin: '*' })` for direct use.
    const corsHandler = cors({ origin: "*" });
    corsHandler(req, res, async () => {
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }

      const data = req.body.data;
      logger.info(`STANDIN1 RECEIVED DATA: "${JSON.stringify(data)}"`);

      // Ensure data is available before accessing its properties
      const name = data?.name || "there";
      const message = data?.message || "nothing";

      res.status(200).send({
        data: {
          message: `hey ${name}, thanks for saying "${message}", standIn1 says hello too!`,
          receivedData: data,
        },
      });
    });
  },
);

// Exports all the functions
module.exports = {
  analyzeSentiment,
  analyzingSyntax,
  extractEntities,
  standIn1,
};
