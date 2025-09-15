// functions/controllers/aiController.js

const { logger } = require("firebase-functions");
const language = require("@google-cloud/language");
const { sendSuccess, sendError } = require("../utils/responseFormatter");
const { writeLog, writeErrorLog } = require("../utils/cloudLog");

// --- Service Imports ---
const { generateChatResponse } = require("../services/conversationalService");
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
    const metadata = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "analyzeSentimentHandler" },
      },
      labels: { user_id: req.user.id },
    };

    const logEntryData = {
      message: "Natural Language Sentiment Analyzer initiated",
      prompt: message,
      originatingEndpoint: "/api/ai/sentiment",
    };

    writeLog("analyzeSentimentHandler", metadata, logEntryData);

    const [results] = await client.analyzeSentiment({
      document: { content: message, type: "PLAIN_TEXT" },
      encodingType,
    });
    const sentimentScore = results.documentSentiment.score;
    const category = categorizeScore(sentimentScore);
    sendSuccess(res, { message, category, sentimentScore });
  } catch (error) {
    const errorMetadata = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "analyzeSentimentHandler" },
      },
      labels: {
        user_id: req.user.id,
        originatingEndpoint: "/api/ai/sentiment",
      }, // Pass along metadata
    };
    writeErrorLog("analyzeSentimentHandler_errors", errorMetadata, error);
    logger.error("Error detecting sentiment:", error);
    sendError(res, "Failed to analyze sentiment.", 500, error.message);
  }
};

exports.analyzingSyntaxHandler = async (req, res) => {
  const message = req.body.data.message;

  try {
    const metadata = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "analyzingSyntaxHandler" },
      },
      labels: { user_id: req.user.id },
    };

    const logEntryData = {
      message: "Natural Language Syntax Analyzer initiated",
      prompt: message,
      originatingEndpoint: "/api/ai/syntax",
    };

    // Log the successful call
    writeLog("analyzingSyntaxHandler_success", metadata, logEntryData);

    const [response] = await client.analyzeSyntax({
      document: { content: message, type: "PLAIN_TEXT" },
      encodingType,
    });
    sendSuccess(res, { message, syntaxResponse: response });
  } catch (error) {
    // Define and use error-specific metadata for detailed tracing
    const errorMetadata = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "analyzingSyntaxHandler" },
      },
      labels: { user_id: req.user.id, originatingEndpoint: "/api/ai/syntax" },
    };

    // Log the error with specific details
    writeErrorLog("analyzingSyntaxHandler_errors", errorMetadata, error);

    logger.error("Error analyzing syntax:", error);
    sendError(res, "Failed to analyze syntax.", 500, error.message);
  }
};

exports.chatbotHandler = async (req, res) => {
  const userMessage = req.body.data.message;

  try {
    const metadata = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "chatbotHandler" },
      },
      labels: { user_id: req.user.id },
    };

    const logEntryData = {
      message: "Chatbot API call initiated",
      prompt: userMessage,
      originatingEndpoint: "/api/ai/chat",
    };

    // Log the successful call before the API request
    writeLog("chatbot_handler_success", metadata, logEntryData);

    const aiResponse = await generateChatResponse({
      logger,
      prompt: userMessage,
    });
    sendSuccess(res, { aiResponse });
  } catch (error) {
    // Define and use error-specific metadata for detailed tracing
    const errorMetadata = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "chatbotHandler" },
      },
      labels: { user_id: req.user.id, originatingEndpoint: "/api/ai/chat" },
    };

    // Log the error with specific details
    writeErrorLog("chatbot_handler_errors", errorMetadata, error);

    logger.error("Chat processing error:", error);
    sendError(res, "Chat processing error.", 500, error.message);
  }
};

exports.generateImageHandler = async (req, res) => {
  const { prompt } = req.body.data;

  try {
    const metadata = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "generateImageHandler" },
      },
      labels: { user_id: req.user.id },
    };

    const logEntryData = {
      message: "Image generation API call initiated",
      prompt: prompt,
      originatingEndpoint: "/api/ai/image",
    };

    // Log the successful call before the API request
    writeLog("image_generation_success", metadata, logEntryData);

    const base64Image = await generateImage({ logger, prompt });
    sendSuccess(res, { image: base64Image, format: "png" });
  } catch (error) {
    // Define and use error-specific metadata for detailed tracing
    const errorMetadata = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "generateImageHandler" },
      },
      labels: { user_id: req.user.id, originatingEndpoint: "/api/ai/image" },
    };

    // Log the error with specific details
    writeErrorLog("image_generation_errors", errorMetadata, error);

    logger.error("Image generation error:", error);
    sendError(res, "Image generation error.", 500, error.message);
  }
};

exports.textGenerationHandler = async (req, res) => {
  const { prompt } = req.body.data;

  try {
    const metadata = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "textGenerationHandler" },
      },
      labels: { user_id: req.user.id },
    };

    const logEntryData = {
      message: "Text generation API call initiated",
      prompt: prompt,
      originatingEndpoint: "/api/ai/text",
    };

    // Log the successful call before the API request
    writeLog("text_generation_success", metadata, logEntryData);

    const generatedText = await generateText({ logger, prompt });
    sendSuccess(res, { prompt, generatedText });
  } catch (error) {
    // Define and use error-specific metadata for detailed tracing
    const errorMetadata = {
      resource: {
        type: "cloud_function",
        labels: { function_name: "textGenerationHandler" },
      },
      labels: { user_id: req.user.id, originatingEndpoint: "/api/ai/text" },
    };

    // Log the error with specific details
    writeErrorLog("text_generation_errors", errorMetadata, error);

    logger.error("Text generation error:", error);
    sendError(res, "Text generation error.", 500, error.message);
  }
};
