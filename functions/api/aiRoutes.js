// functions/api/aiRoutes.js

const express = require("express");
const {
  analyzeSentimentHandler,
  analyzingSyntaxHandler,
  chatbotHandler,
  generateImageHandler,
  textGenerationHandler,
} = require("../controllers/aiController");

const { validatePrompt } = require("../middleware/validatePrompt");
const { validateMessage } = require("../middleware/validateMessage");

const router = express.Router();

// --- AI Routes ---

// Natural Language Analysis
router.post("/sentiment", validateMessage, analyzeSentimentHandler);
router.post("/syntax", validateMessage, analyzingSyntaxHandler);

// Generative AI
router.post("/chat", validateMessage, chatbotHandler);
router.post("/generate-image", validatePrompt, generateImageHandler);
router.post("/generate-text", validatePrompt, textGenerationHandler);

module.exports = router;
