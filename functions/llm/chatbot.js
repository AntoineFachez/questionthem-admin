// functions/llm/chatbot.js

const { logger } = require("firebase-functions");
const { sendSuccess, sendError } = require("../utils/responseFormatter");
const { generateChatResponse } = require("../services/geminiService");

/**
 * An Express route handler for the chatbot functionality.
 */
const chatbotHandler = async (req, res) => {
  // The `validateMessage` middleware has already ensured `message` exists.
  const userMessage = req.body.data.message;

  try {
    const aiResponse = await generateChatResponse({
      logger: logger,
      prompt: userMessage,
    });
    sendSuccess(res, { aiResponse });
  } catch (error) {
    sendError(
      res,
      "An error occurred while processing the chat request.",
      500,
      error.message,
    );
  }
};

module.exports = {
  chatbotHandler,
};
