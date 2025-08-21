// functions/controllers/aiController.js

const { logger } = require("firebase-functions");
const language = require("@google-cloud/language");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

// --- Service Imports ---
const { generateChatResponse } = require("../services/geminiService");
const { generateImage } = require("../services/imagenService");
const { generateText } = require("../services/textBisonService");

// --- Cloud AI Client ---
const client = new language.LanguageServiceClient();
const encodingType = "UTF8";

// --- Helper Function ---
const categorizeScore = (score) => {
  if (score > 0.25) return "positive";
  if (score < -0.25) return "negative";
  return "neutral";
};

// --- Route Handlers ---

exports.analyzeSentimentHandler = async (req, res) => {
  const message = req.body.data.message;
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

exports.analyzingSyntaxHandler = async (req, res) => {
  const message = req.body.data.message;
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

exports.chatbotHandler = async (req, res) => {
  const userMessage = req.body.data.message;
  try {
    const aiResponse = await generateChatResponse({
      logger,
      prompt: userMessage,
    });
    sendSuccess(res, { aiResponse });
  } catch (error) {
    sendError(res, "Chat processing error.", 500, error.message);
  }
};

exports.generateImageHandler = async (req, res) => {
  const { prompt } = req.body.data;
  try {
    const base64Image = await generateImage({ logger, prompt });
    sendSuccess(res, { image: base64Image, format: "png" });
  } catch (error) {
    sendError(res, "Image generation error.", 500, error.message);
  }
};

exports.textGenerationHandler = async (req, res) => {
  const { prompt } = req.body.data;
  try {
    const generatedText = await generateText({ logger, prompt });
    sendSuccess(res, { prompt, generatedText });
  } catch (error) {
    sendError(res, "Text generation error.", 500, error.message);
  }
};
