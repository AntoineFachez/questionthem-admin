// functions/services/visionService.js

const { VertexAI } = require("@google-cloud/vertexai");

/**
 * Analyzes an image using Vertex AI's Gemini model.
 *
 * @param {object} options - The options for image analysis.
 * @param {object} options.logger - The Firebase Functions logger instance.
 * @param {string} options.projectId - Your Google Cloud project ID.
 * @param {string} options.prompt - The text prompt for the image.
 * @param {string} options.imageUriOrBase64 - The GCS URI or base64 image string.
 * @param {string} [options.location='us-central1'] - The Vertex AI region.
 * @param {string} [options.model='gemini-1.0-pro-vision'] - The Gemini model.
 * @param {string} [options.mimeType='image/jpeg'] - The image MIME type.
 * @returns {Promise<string>} The extracted text content.
 */
async function analyzeImageContent({
  logger,
  projectId = process.env.PROJECT_ID,
  location = process.env.VERTEX_AI_LOCATION || "us-central1",
  model = "gemini-1.0-pro-vision",
  prompt,
  imageUriOrBase64,
  mimeType = "image/jpeg",
}) {
  // Basic validation
  if (!logger) throw new Error("Logger instance is required.");
  if (!projectId) throw new Error("projectId is required.");
  if (!prompt) throw new Error("Prompt text is required.");
  if (!imageUriOrBase64)
    throw new Error("Image URI or base64 string is required.");

  const vertexAI = new VertexAI({ project: projectId, location });
  const generativeVisionModel = vertexAI.getGenerativeModel({ model });

  const filePart = imageUriOrBase64.startsWith("gs://")
    ? { fileData: { fileUri: imageUriOrBase64, mimeType } }
    : { inlineData: { data: imageUriOrBase64, mimeType } };

  const request = {
    contents: [{ role: "user", parts: [filePart, { text: prompt }] }],
  };

  try {
    const responseStream = await generativeVisionModel.generateContentStream(
      request,
    );
    const aggregatedResponse = await responseStream.response;
    const fullTextResponse =
      aggregatedResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!fullTextResponse) {
      throw new Error("No text content found in the Gemini Vision response.");
    }
    return fullTextResponse;
  } catch (error) {
    // ✅ Use the structured logger for consistent error reporting
    logger.error("Error analyzing image content with Vertex AI:", error);
    // Re-throw the error so the calling function knows it failed
    throw new Error(`Failed to analyze image content: ${error.message}`);
  }
}

module.exports = {
  analyzeImageContent,
};
