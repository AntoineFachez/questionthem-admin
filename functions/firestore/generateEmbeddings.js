/**
 * @fileoverview This file contains a callable Firebase Cloud Function that
 * generates and stores vector embeddings for documents in a Firestore collection.
 * It's designed to be triggered manually for a backfill process.
 */

// Import necessary Firebase and Google Cloud libraries.
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { v1 } = require("@google-cloud/aiplatform");

// Initialize the Firebase Admin SDK.
// This allows the function to interact with Firestore and other Firebase services.
admin.initializeApp();
const db = admin.firestore();

// Initialize the Vertex AI PredictionServiceClient.
// This is what we will use to call the embedding model.
const { PredictionServiceClient } = v1;
const projectId = process.env.PROJECT_ID;
const location = process.env.VERTEX_AI_LOCATION;

const endpoint = `projects/${projectId}/locations/${location}/publishers/google/models/textembedding-gecko@001`;
const clientOptions = { apiEndpoint: `${location}-aiplatform.googleapis.com` };
const client = new PredictionServiceClient(clientOptions);

/**
 * A callable Cloud Function to generate and store vector embeddings.
 * It takes the collection path and an array of field names as arguments.
 * It then iterates through all documents in that collection, generates an embedding
 * from the combined text of the specified fields, and saves it back to the document.
 *
 * @param {object} data The request data from the client.
 * @param {string} data.collectionPath The path to the Firestore collection (e.g., 'articles').
 * @param {string[]} data.fieldNames An array of field names to use for generating the embedding (e.g., ['title', 'content']).
 * @returns {Promise<object>} A promise that resolves with a success or error message.
 */
const generateEmbeddings = functions.https.onCall(async (data) => {
  // Ensure the function is called by an authenticated user if needed.
  // if (!context.auth) {
  //   throw new functions.https.HttpsError(
  //     'unauthenticated',
  //     'The function must be called by an authenticated user.'
  //   );
  // }

  // Validate the input data.
  if (
    !data.collectionPath ||
    !data.fieldNames ||
    !Array.isArray(data.fieldNames)
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function requires 'collectionPath' and a 'fieldNames' array.",
    );
  }

  const { collectionPath, fieldNames } = data;
  console.log(
    `Starting embedding generation for collection: ${collectionPath}`,
  );
  console.log(`Using fields: ${fieldNames.join(", ")}`);

  try {
    // Get a reference to the collection.
    const collectionRef = db.collection(collectionPath);
    // Get a snapshot of all documents in the collection.
    const snapshot = await collectionRef.get();

    // Check if the collection is empty.
    if (snapshot.empty) {
      console.log("No documents found in the collection.");
      return { success: true, message: "No documents to process." };
    }

    // Process each document sequentially to avoid rate-limiting issues with the API.
    const promises = snapshot.docs.map(async (doc) => {
      const docData = doc.data();
      let combinedText = "";

      // Loop through the specified fields and concatenate their values.
      for (const field of fieldNames) {
        if (docData[field] && typeof docData[field] === "string") {
          combinedText += ` ${docData[field]}`;
        }
      }

      // Check if there is any text to embed.
      if (combinedText.trim() === "") {
        console.warn(
          `Document ${doc.id} has no text in the specified fields. Skipping.`,
        );
        return { id: doc.id, status: "skipped" };
      }

      try {
        // Prepare the request to the embedding model.
        const instance = { content: combinedText.trim() };
        const request = {
          endpoint,
          instances: [instance],
        };

        // Call the Vertex AI embedding model to get the vector.
        const [response] = await client.predict(request);
        const embedding = response.predictions[0].embeddings.values;

        // Use Firestore's FieldValue.vector to store the embedding correctly.
        const embeddingVector = admin.firestore.FieldValue.vector(embedding);

        // Update the document with the new embedding.
        await doc.ref.update({ embedding_field: embeddingVector });
        console.log(`Successfully updated document: ${doc.id}`);
        return { id: doc.id, status: "success" };
      } catch (error) {
        console.error(`Error processing document ${doc.id}:`, error);
        return { id: doc.id, status: "error", message: error.message };
      }
    });

    const results = await Promise.all(promises);

    console.log("Embedding generation complete.");
    return {
      success: true,
      message: `Successfully processed ${
        results.filter((r) => r.status === "success").length
      } documents.`,
      results: results,
    };
  } catch (error) {
    console.error("An error occurred during the main process:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An unexpected error occurred.",
      error.message,
    );
  }
});

// Export the callable function as the default export of this module.
exports.default = generateEmbeddings;
