// functions/llm/imagen.js

const { logger } = require("firebase-functions");
const { sendSuccess, sendError } = require("../utils/responseFormatter");
const { generateImage } = require("../services/imagenService");

/**
 * An Express route handler for generating images from a prompt.
 */
const generateImageHandler = async (req, res) => {
  const { prompt } = req.body;

  try {
    const base64Image = await generateImage({
      logger: logger,
      prompt: prompt,
    });
    sendSuccess(res, { image: base64Image, format: "png" });
  } catch (error) {
    sendError(
      res,
      "An error occurred during image generation.",
      500,
      error.message,
    );
  }
};

module.exports = { generateImageHandler };
