// functions/services/embeddingService.js

const admin = require("firebase-admin");
const { v1 } = require("@google-cloud/aiplatform");

const db = admin.firestore();
const { PredictionServiceClient } = v1;
const projectId = process.env.PROJECT_ID;
const location = process.env.VERTEX_AI_LOCATION;
const endpoint = `projects/${projectId}/locations/${location}/publishers/google/models/textembedding-gecko@001`;
const clientOptions = { apiEndpoint: `${location}-aiplatform.googleapis.com` };
const client = new PredictionServiceClient(clientOptions);

/**
 * Generates and stores vector embeddings for all documents in a collection.
 * @param {object} options - The options for the backfill process.
 * @param {object} options.logger - The Firebase Functions logger instance.
 * @param {string} options.collectionPath - Path to the Firestore collection.
 * @param {string[]} options.fieldNames - Fields to use for generating embeddings.
 * @returns {Promise<object>} A summary of the operation results.
 */
async function backfillEmbeddingsForCollection({
  logger,
  collectionPath,
  fieldNames,
}) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    logger.info(`No documents found in collection '${collectionPath}'.`);
    return { success: true, message: "No documents to process." };
  }
  logger.info(
    `Found ${snapshot.docs.length} documents to process in '${collectionPath}'.`,
  );

  const results = [];
  // Process documents sequentially to prevent timeouts and hitting API rate limits.
  for (const doc of snapshot.docs) {
    const docData = doc.data();
    const combinedText = fieldNames
      .map((field) =>
        docData[field] && typeof docData[field] === "string"
          ? docData[field]
          : "",
      )
      .join(" ")
      .trim();

    if (combinedText === "") {
      logger.warn(
        `Document ${doc.id} has no text in specified fields. Skipping.`,
      );
      results.push({ id: doc.id, status: "skipped" });
      continue;
    }

    try {
      const instance = { content: combinedText };
      const request = { endpoint, instances: [instance] };

      const [response] = await client.predict(request);
      const embedding = response.predictions[0].embeddings.values;
      const embeddingVector = admin.firestore.FieldValue.vector(embedding);

      await doc.ref.update({ embedding_field: embeddingVector });
      logger.info(`Successfully generated embedding for document: ${doc.id}`);
      results.push({ id: doc.id, status: "success" });
    } catch (error) {
      logger.error(`Error processing document ${doc.id}:`, error);
      results.push({ id: doc.id, status: "error", message: error.message });
    }
  }

  const successCount = results.filter((r) => r.status === "success").length;
  logger.info(
    `Embedding generation complete. ${successCount} documents updated.`,
  );
  return {
    success: true,
    message: `Processed ${snapshot.docs.length} documents. Successfully updated ${successCount}.`,
    results,
  };
}

module.exports = { backfillEmbeddingsForCollection };
