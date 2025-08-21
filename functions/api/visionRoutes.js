// functions/api/visionRoutes.js

const { logger } = require("firebase-functions");
const { sendSuccess, sendError } = require("../utils/responseFormatter");
const { analyzeImageContent } = require("../services/visionService");

const express = require("express");
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
module.exports = visionRouter;
