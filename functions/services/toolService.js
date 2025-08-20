// functions/services/toolService.js

const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore();

/**
 * Executes a predefined tool (like a Firestore query).
 * @param {object} options - The options for tool execution.
 * @param {object} options.logger - The Firebase Functions logger instance.
 * @param {string} options.toolName - The name of the tool to run.
 * @param {object} options.args - The arguments for the tool.
 * @returns {Promise<object>} The result of the tool execution.
 */
async function executeTool({ logger, toolName, args }) {
  logger.info(`Executing tool '${toolName}' with args:`, args);

  switch (toolName) {
    case "findEntities":
      try {
        let query = firestore.collection(args.collection);
        if (args.filters && Array.isArray(args.filters)) {
          args.filters.forEach((filter) => {
            query = query.where(filter.field, filter.operator, filter.value);
          });
        }
        if (args.limit) {
          query = query.limit(args.limit);
        }
        const snapshot = await query.get();
        if (snapshot.empty) return [];
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        logger.error("Firestore query failed:", e);
        return {
          error: `Error executing query for ${args.collection}: ${e.message}`,
        };
      }
    // Add other tool cases here...
    default:
      return { error: `Tool '${toolName}' not found.` };
  }
}

module.exports = { executeTool };
