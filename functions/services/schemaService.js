// functions/services/schemaService.js

const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore();

let schemaContext = null; // In-memory cache

/**
 * Loads schemas from Firestore and builds the context prompt.
 * Caches the result in memory after the first successful load.
 * @param {object} logger - The Firebase Functions logger instance.
 * @returns {Promise<string>} The fully constructed schema context prompt.
 */
async function getSchemaContext(logger) {
  if (schemaContext) {
    logger.info("Returning cached schema context.");
    return schemaContext;
  }

  try {
    logger.info("Loading schemas from Firestore for the first time...");
    const snapshot = await firestore.collection("_meta_schemas").get();
    if (snapshot.empty) {
      throw new Error("No schemas found in the '_meta_schemas' collection.");
    }
    const schemas = snapshot.docs.map((doc) => doc.data());
    const schemaString = JSON.stringify(schemas, null, 2);

    // Store the fully constructed prompt in the cache
    schemaContext = `You are an expert research assistant...
<schemas>
${schemaString}
</schemas>
---
**Primary Directive: Grounding Rule**
...`; // (The rest of your detailed prompt)

    logger.info("Schemas loaded and cached successfully.");
    return schemaContext;
  } catch (error) {
    logger.error("FATAL: Failed to load schemas.", error);
    // Re-throw to ensure the agent fails if it can't get its instructions.
    throw new Error(`Failed to load schemas: ${error.message}`);
  }
}

module.exports = { getSchemaContext };
