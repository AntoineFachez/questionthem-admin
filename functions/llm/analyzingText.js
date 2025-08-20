// functions/llm/analyzingText.js

const { logger } = require("firebase-functions");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const language = require("@google-cloud/language");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

// Instantiates a client for Google Cloud Natural Language API
const client = new language.LanguageServiceClient();
const encodingType = "UTF8";

// Helper function
const categorizeScore = (score) => {
  if (score > 0.25) return "positive";
  if (score < -0.25) return "negative";
  return "neutral";
};

// --- Refactored Express Route Handlers ---

const analyzeSentimentHandler = async (req, res) => {
  const message = req.body.data.message;
  logger.info(`ANALYZING SENTIMENT FOR MESSAGE: "${message}"`);

  try {
    const [results] = await client.analyzeSentiment({
      document: { content: message, type: "PLAIN_TEXT" },
      encodingType,
    });

    const sentimentScore = results.documentSentiment.score;
    const category = categorizeScore(sentimentScore);

    sendSuccess(res, { message, category, sentimentScore });
  } catch (error) {
    logger.error("Error detecting sentiment:", error);
    sendError(res, "Failed to analyze sentiment.", 500, error.message);
  }
};

const analyzingSyntaxHandler = async (req, res) => {
  const message = req.body.data.message;
  logger.info(`ANALYZING SYNTAX FOR MESSAGE: "${message}"`);

  try {
    const [response] = await client.analyzeSyntax({
      document: { content: message, type: "PLAIN_TEXT" },
      encodingType,
    });
    sendSuccess(res, { message, syntaxResponse: response });
  } catch (error) {
    logger.error("Error analyzing syntax:", error);
    sendError(res, "Failed to analyze syntax.", 500, error.message);
  }
};

// --- Callable Function (Unchanged, as it's not an HTTP endpoint) ---

const extractEntities = onCall(
  { memory: "512MiB", timeoutSeconds: 180 },
  async (request) => {
    const message = request.data?.message;
    if (!message) {
      logger.error("extractEntities: No message provided.");
      throw new HttpsError(
        "invalid-argument",
        "A 'message' property is required.",
      );
    }

    logger.info(
      `EXTRACTING ENTITIES FROM MESSAGE: "${message.substring(0, 100)}..."`,
    );
    try {
      const [response] = await client.analyzeEntities({
        document: { content: message, type: "PLAIN_TEXT" },
        encodingType,
      });
      return { message, entitiesResponse: response };
    } catch (error) {
      logger.error("Error extracting entities:", error);
      throw new HttpsError(
        "internal",
        `Failed to extract entities: ${error.message}`,
      );
    }
  },
);

module.exports = {
  analyzeSentimentHandler,
  analyzingSyntaxHandler,
  extractEntities, // Export the callable function
};
