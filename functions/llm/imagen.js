// functions/llm/imagen.js

// NEW: Use specific imports from firebase-functions/v2
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions"); // Use v2 logger for better logging

const { PredictionServiceClient } = require("@google-cloud/aiplatform").v1;
const { helpers } = require("@google-cloud/aiplatform");

/**
 * HTTP Cloud Function to generate an image using Vertex AI Imagen 3.0.
 *
 * It expects a POST request with a JSON body containing:
 * {
 * "prompt": "a dog reading a newspaper"
 * }
 *
 * It returns a JSON object with the base64 encoded image:
 * {
 * "image": "iVBORw0KGgo...",
 * "format": "png"
 * }
 */
exports.generateImageFromPrompt = onRequest(
  {
    // Options passed directly to the function definition
    // The region will be picked up from setGlobalOptions in index.js,
    // but you can override it here if needed: region: 'us-central1',
    memory: "512MiB", // Increase memory for image generation if needed
    timeoutSeconds: 300, // Increase timeout for image generation as it can take longer
  },
  async (req, res) => {
    // Set CORS headers. In production, restrict to your frontend's domain(s).
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS"); // Allow POST and OPTIONS
    res.set("Access-Control-Allow-Headers", "Content-Type"); // Allow Content-Type header
    res.set("Access-Control-Max-Age", "3600"); // Cache preflight response for 1 hour

    // Handle preflight OPTIONS requests
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      logger.warn(`Method Not Allowed: ${req.method}`);
      return res.status(405).json({
        error: "Method Not Allowed. Only POST requests are accepted.",
      });
    }

    const { prompt } = req.body;

    if (!prompt) {
      logger.error(
        "generateImageFromPrompt: No prompt provided in request body.",
      );
      return res
        .status(400)
        .json({ error: "Prompt is required in the request body." });
    }

    // Retrieve project ID and location from environment variables.
    // GOOGLE_CLOUD_PROJECT_ID is automatically set by Cloud Functions.
    // LOCATION should be set as an environment variable during deployment.
    const projectId = process.env.PROJECT_ID;
    const location = process.env.VERTEX_AI_LOCATION || "us-central1"; // Default locatio;

    if (!projectId) {
      logger.error("GOOGLE_CLOUD_PROJECT_ID environment variable not set.");
      return res
        .status(500)
        .json({ error: "Google Cloud Project ID not configured." });
    }

    const clientOptions = {
      apiEndpoint: `${location}-aiplatform.googleapis.com`,
    };
    const predictionServiceClient = new PredictionServiceClient(clientOptions);

    try {
      const endpoint = `projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-001`;

      const promptText = {
        prompt: prompt,
      };
      const instanceValue = helpers.toValue(promptText);
      const instances = [instanceValue];

      const parameter = {
        sampleCount: 1,
        // You can't use a seed value and watermark at the same time.
        // seed: 100,
        // addWatermark: false, // If true, disables seed and vice-versa
        aspectRatio: "1:1", // or '16:9', '9:16', '4:3', '3:4', '21:9', '9:21'
        safetyFilterLevel: "block_some", // 'block_most', 'block_all', 'block_none'
        personGeneration: "allow_adult", // 'allow_adult', 'block_all'
      };
      const parameters = helpers.toValue(parameter);

      const request = {
        endpoint,
        instances,
        parameters,
      };

      logger.info(
        `Sending prediction request to Vertex AI for prompt: "${prompt}"`,
      );
      const [response] = await predictionServiceClient.predict(request);
      const predictions = response.predictions;

      if (!predictions || predictions.length === 0) {
        logger.warn(
          "Vertex AI returned no predictions for the image generation request.",
        );
        return res.status(500).json({
          error:
            "No image was generated. Check the request parameters and prompt.",
        });
      }

      // Assuming the first prediction contains the image
      const base64Image =
        predictions[0].structValue.fields.bytesBase64Encoded.stringValue;

      logger.info("Image generated successfully.");
      // Return the base64 image string and format (assuming PNG as per original script's save)
      return res.status(200).json({ image: base64Image, format: "png" });
    } catch (error) {
      logger.error("Error generating image from Vertex AI:", error);
      return res.status(500).json({
        error: "Failed to generate image.",
        details: error.message,
        // Optionally, add more details from the original error if it's safe to expose
        // apiError: error.details || error.code || error.status
      });
    }
  },
);
