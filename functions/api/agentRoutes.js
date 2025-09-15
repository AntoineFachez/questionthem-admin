// functions/agenticEngine/orchestrator.js

const express = require("express");
const { logger } = require("firebase-functions");
const { runAgentQuery } = require("../services/agentService");
const { sendSuccess, sendError } = require("../utils/responseFormatter");
const { writeLog, writeErrorLog } = require("../utils/cloudLog");

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
    const metadata = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "agentHandler" },
      },
      labels: { user_id: req.user.id },
    };

    const logEntryData = {
      message: "Gemini API agent call initiated",
      prompt: query,
      originatingEndpoint: "/api/agent",
    };

    // Log the successful call before the API request
    writeLog("agent_query_success", metadata, logEntryData);

    //FIX: uncomment for Agent
    // const answer = await runAgentQuery({ logger, userQuery: query });
    // sendSuccess(res, { answer });
  } catch (error) {
    // Define and use error-specific metadata for detailed tracing
    const errorMetadata = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "agentHandler" },
      },
      labels: { user_id: req.user.id, originatingEndpoint: "/api/agent" },
    };

    // Log the error with specific details
    writeErrorLog("agent_query_errors", errorMetadata, error);

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

module.exports = app;
