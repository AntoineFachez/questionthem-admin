// functions/agenticEngine/orchestrator.js

const express = require("express");
const { logger } = require("firebase-functions");
const { runAgentQuery } = require("../services/agentService");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

const app = express();
app.use(express.json());

/**
 * An Express route handler for the agentic query engine.
 */
const agentHandler = async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return sendError(
      res,
      "A 'query' property is required in the request body.",
      400,
    );
  }

  try {
    const answer = await runAgentQuery({ logger, userQuery: query });
    sendSuccess(res, { answer });
  } catch (error) {
    logger.error("The agentic query failed:", error);
    sendError(
      res,
      "The agent failed to process your request.",
      500,
      error.message,
    );
  }
};

app.post("/query", agentHandler);

// We no longer need to export the whole app.
// Instead, we integrate this router into our main `app.js`.
module.exports = app;
