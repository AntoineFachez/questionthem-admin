// functions/app.js

const express = require("express");
const cors = require("cors");
const allowedOrigins = require("./config/allowedOrigins.js");
const { logger } = require("firebase-functions");
const { sendSuccess, sendError } = require("./utils/responseFormatter");

// Import handlers and middleware
const { validatePrompt } = require("./middleware/validatePrompt");
const { validateMessage } = require("./middleware/validateMessage");

// Server-side Rendering
const createBlueprintHandler = require("./api/uiRoutes.js");

// Agentic Engine
const orchestratorApp = require("./api/agentRoutes.js");

const { analyzeImageContent } = require("./services/visionService");
const { chatbotHandler } = require("./llm/chatbot");
const { generateImageHandler } = require("./llm/imagen");
const { textGenerationHandler } = require("./llm/text");

const {
  analyzeSentimentHandler,
  analyzingSyntaxHandler,
} = require("./llm/analyzingText.js");

const app = express();

// --- Global Middleware ---
// 1. CORS for allowed origins
app.use(cors({ origin: allowedOrigins, credentials: true }));
// 2. JSON Body Parser
app.use(express.json());

// --- API Routes ---

// UI Blueprint Routes
app.get("/ui-blueprints/:blueprintId", createBlueprintHandler("ui_blueprints"));
app.get(
  "/form-blueprints/:blueprintId",
  createBlueprintHandler("form_blueprints"),
);

// LLM (Natural Language) Routes
const llmRouter = express.Router();
llmRouter.post("/sentiment", validateMessage, analyzeSentimentHandler);
llmRouter.post("/syntax", validateMessage, analyzingSyntaxHandler);
llmRouter.post("/chat", validateMessage, chatbotHandler);
llmRouter.post("/generate-image", validatePrompt, generateImageHandler);
llmRouter.post("/generate-text", validatePrompt, textGenerationHandler);

app.use("/llm", llmRouter);
app.use("/agent", orchestratorApp);

// Example Routes
app.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello from the unified Express app!" });
});

const visionRouter = express.Router();
visionRouter.post("/analyze-image", async (req, res) => {
  // 1. Validation Layer (Handled by the route)
  const { prompt, imageBase64, mimeType } = req.body?.data || {};

  if (!prompt || !imageBase64 || !mimeType) {
    return sendError(
      res,
      "Request data must include prompt, imageBase64, and mimeType.",
      400,
    );
  }

  try {
    // 2. Business Logic Layer (Call the service)
    const analysisResult = await analyzeImageContent({
      logger: logger, // Pass the logger to the service
      prompt: prompt,
      imageUriOrBase64: imageBase64,
      mimeType: mimeType,
    });

    // 3. Response Layer (Format the output)
    sendSuccess(res, { result: analysisResult });
  } catch (error) {
    // Catch errors from the service and format them for the client
    sendError(
      res,
      "An error occurred during image analysis.",
      500,
      error.message,
    );
  }
});

app.use("/vision", visionRouter);

module.exports = app;
