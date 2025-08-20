// functions/llm/textgen.js

const { logger } = require("firebase-functions");
const { sendSuccess, sendError } = require("../utils/responseFormatter");
const { generateText } = require("../services/textBisonService");

/**
 * An Express route handler for generating text from a prompt.
 */
const textGenerationHandler = async (req, res) => {
  const { prompt } = req.body;
  const projectId = process.env.PROJECT_ID;

  try {
    const generatedText = await generateText({ logger, projectId, prompt });
    sendSuccess(res, { prompt, generatedText });
  } catch (error) {
    sendError(
      res,
      "Failed to get AI text generation response.",
      500,
      error.message,
    );
  }
};

module.exports = { textGenerationHandler };
