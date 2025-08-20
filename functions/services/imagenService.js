// functions/services/imagenService.js

const { PredictionServiceClient } = require("@google-cloud/aiplatform").v1;
const { helpers } = require("@google-cloud/aiplatform");

const projectId = process.env.PROJECT_ID;
const location = process.env.VERTEX_AI_LOCATION || "us-central1";
const endpoint = `projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-001`;

const clientOptions = {
  apiEndpoint: `${location}-aiplatform.googleapis.com`,
};
const predictionServiceClient = new PredictionServiceClient(clientOptions);

/**
 * Generates an image using the Vertex AI Imagen model.
 * @param {object} options - The options for image generation.
 * @param {object} options.logger - The Firebase Functions logger instance.
 * @param {string} options.prompt - The text prompt for the image.
 * @returns {Promise<string>} The base64 encoded image string.
 * @throws {Error} If image generation fails.
 */
async function generateImage({ logger, prompt }) {
  if (!projectId) {
    throw new Error("Google Cloud Project ID not configured.");
  }

  const promptText = { prompt };
  const instanceValue = helpers.toValue(promptText);
  const instances = [instanceValue];

  const parameters = helpers.toValue({
    sampleCount: 1,
    aspectRatio: "1:1",
    safetyFilterLevel: "block_some",
    personGeneration: "allow_adult",
  });

  const request = { endpoint, instances, parameters };

  try {
    logger.info(`Sending prediction request to Imagen for prompt: "${prompt}"`);
    const [response] = await predictionServiceClient.predict(request);
    const predictions = response.predictions;

    if (!predictions || predictions.length === 0) {
      throw new Error(
        "Vertex AI returned no predictions for the image generation request.",
      );
    }
    const base64Image =
      predictions[0].structValue.fields.bytesBase64Encoded.stringValue;
    logger.info("Image generated successfully.");
    return base64Image;
  } catch (error) {
    logger.error("Error generating image from Vertex AI:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

module.exports = { generateImage };
