// functions/triggers/callable.js

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const {
  backfillEmbeddingsForCollection,
} = require("../services/embeddingService");

/**
 * Callable Function to trigger a backfill of vector embeddings for a collection.
 * Expects: { "collectionPath": "articles", "fieldNames": ["title", "content"] }
 */
exports.backfillEmbeddings = onCall(
  { memory: "512MiB", timeoutSeconds: 540 },
  async (request) => {
    const { collectionPath, fieldNames } = request.data;
    logger.info("Backfill embeddings called for:", {
      collectionPath,
      fieldNames,
    });

    // 1. Validate Input
    if (
      !collectionPath ||
      !Array.isArray(fieldNames) ||
      fieldNames.length === 0
    ) {
      throw new HttpsError(
        "invalid-argument",
        "The function requires 'collectionPath' (string) and 'fieldNames' (array).",
      );
    }

    // 2. Call the Service
    try {
      const results = await backfillEmbeddingsForCollection({
        logger,
        collectionPath,
        fieldNames,
      });
      return results;
    } catch (error) {
      logger.error("The embedding backfill process failed:", error);
      throw new HttpsError(
        "internal",
        "An unexpected error occurred during the backfill.",
        error.message,
      );
    }
  },
);
