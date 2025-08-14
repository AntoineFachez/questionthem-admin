/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable indent */

// NEW: Use specific imports from firebase-functions/v2
const { onRequest, onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions"); // Use v2 logger for consistent logging
const { HttpsError } = require("firebase-functions/v2/https"); // For structured errors

const cors = require("cors");
const allowedOrigins = require("../cors/allowedOrigins"); // Ensure this path is correct

// Google Cloud clients
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const { PredictionServiceClient } = require("@google-cloud/aiplatform").v1; // Explicitly import v1 for PredictionServiceClient
const { helpers } = require("@google-cloud/aiplatform"); // For protobuf helpers

// --- extractInformation (Callable Function) ---
// This function aims to extract information using AI Platform after accessing a secret.
// IMPORTANT: For Vertex AI client authentication in Cloud Functions,
// the default service account typically works if it has the 'Vertex AI User' role.
// Explicitly using Secret Manager for `private_key` and `client_email` is often
// unnecessary unless you're using a *specific* custom service account key file for auth.
// If you want to use the default Cloud Function service account, you can remove
// the Secret Manager part and just initialize `PredictionServiceClient` directly.
const extractInformation = onCall(
  {
    // Region set globally in index.js via setGlobalOptions, but can be overridden.
    memory: "512MiB", // Adjust memory as needed for AI calls
    timeoutSeconds: 60, // Adjust timeout as needed
  },
  async (data, context) => {
    // No CORS handling needed for callable functions! Firebase handles it automatically.
    logger.info(
      `extractInformation (onCall) received data: ${JSON.stringify(data)}`,
    );

    const projectId =
      process.env.GOOGLE_CLOUD_PROJECT_ID || "questionthem-90ccf"; // Use env var, fallback to hardcoded
    const secretName = "aiPlatForm"; // Name of your secret in Secret Manager
    const secretManagerClient = new SecretManagerServiceClient();

    try {
      if (!projectId) {
        throw new HttpsError("internal", "Google Cloud Project ID is missing.");
      }

      // Access the secret version
      const [version] = await secretManagerClient.accessSecretVersion({
        name: secretManagerClient.secretVersionName(
          projectId,
          secretName,
          "latest",
        ),
      });

      // Parse the secret payload (assuming it's JSON with private_key and client_email)
      const key = JSON.parse(version.payload.data.toString());

      // Initialize AI Platform client with retrieved credentials
      // The `aiplatform.aiplatform` constructor was incorrect.
      // It should be `new PredictionServiceClient` or use the higher-level `VertexAI` SDK.
      // If you're using a service account key, you'd typically pass it like this:
      const predictionServiceClient = new PredictionServiceClient({
        projectId: projectId, // Ensure projectId is passed here
        credentials: {
          private_key: key.private_key,
          client_email: key.client_email,
        },
        apiEndpoint: `${process.env.LOCATION || "us-central1"}-aiplatform.googleapis.com`, // Use env var for location
      });

      // --- Your AI Platform API calls would go here ---
      // For demonstration, let's make a simple dummy call or indicate where it would go
      logger.info(
        "Successfully initialized AI Platform client with secret credentials.",
      );
      // Example: You would call a model here, similar to extractInformationFallBack
      // For instance:
      // const endpoint = `projects/${projectId}/locations/us-central1/publishers/google/models/text-bison@001`;
      // const response = await predictionServiceClient.predict({ endpoint, instances: [], parameters: {} });
      // logger.info("Dummy AI Platform call successful.");

      // Example response from a dummy AI call
      const dummyResponse = {
        extractedText:
          "Information extracted based on your prompt (replace with actual AI output)",
        // You could pass the user's prompt via `data.prompt`
        // originalPrompt: data.prompt
      };

      return { success: true, data: dummyResponse };
    } catch (error) {
      logger.error("Error in extractInformation (onCall):", error);
      throw new HttpsError("internal", "Failed to extract information.", {
        details: error.message,
      });
    }
  },
);

// --- sayHelloAgainFromSomeFolder (HTTP Request Function) ---
const sayHelloAgainFromSomeFolder = onRequest(
  {
    // Region set globally in index.js via setGlobalOptions, but can be overridden.
    // memory: "128MiB",
    timeoutSeconds: 3,
  },
  async (req, res) => {
    // CORS handling: Use the imported `cors` middleware
    const corsHandler = cors({ origin: allowedOrigins });
    corsHandler(req, res, async () => {
      // Handle OPTIONS preflight request (crucial for CORS)
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }

      if (req.method !== "POST") {
        logger.warn(
          `sayHelloAgainFromSomeFolder: Method Not Allowed - ${req.method}`,
        );
        return res.status(405).json({
          error: "Method Not Allowed. Only POST requests are accepted.",
        });
      }

      const data = req.body.data; // Access data from the request body

      if (!data || !data.name || !data.message) {
        logger.error(
          "sayHelloAgainFromSomeFolder: Missing 'name' or 'message' in request body data.",
        );
        return res
          .status(400)
          .json({ error: "Missing required fields (name, message) in data." });
      }

      logger.info(
        `sayHelloAgainFromSomeFolder received data from ${data.name}: "${data.message}"`,
      );

      res.status(200).send({
        // Changed to 200 for consistency, 201 is "Created"
        data: {
          message: `hey ${data.name}, thanks for saying "${data.message}", sayHelloAgainFromSomeFolder says hello too!`,
          receivedData: data, // Clarified `data` as `receivedData`
        },
      });
    });
  },
);

// --- extractInformationFallBack (HTTP Request Function - updated to take prompt) ---
// This function was making a hardcoded Vertex AI call.
// Now it's adjusted to take a prompt from the request body.
const extractInformationFallBack = onRequest(
  {
    // Region set globally in index.js via setGlobalOptions, but can be overridden.
    memory: "1GB", // Text generation can be memory-intensive, adjust as needed
    timeoutSeconds: 60, // Adjust timeout for AI calls
  },
  async (req, res) => {
    // CORS handling: Use the imported `cors` middleware
    const corsHandler = cors({ origin: allowedOrigins });
    corsHandler(req, res, async () => {
      // Handle OPTIONS preflight request
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }

      if (req.method !== "POST") {
        logger.warn(
          `extractInformationFallBack: Method Not Allowed - ${req.method}`,
        );
        return res.status(405).json({
          error: "Method Not Allowed. Only POST requests are accepted.",
        });
      }

      const {
        prompt,
        projectId: reqProjectId,
        location: reqLocation,
      } = req.body.data || {}; // Extract prompt and optional project/location

      if (!prompt) {
        logger.error(
          "extractInformationFallBack: 'prompt' is required in request body data.",
        );
        return res.status(400).json({
          error: "The 'prompt' parameter is required in request body data.",
        });
      }

      const projectId =
        reqProjectId ||
        process.env.GOOGLE_CLOUD_PROJECT_ID ||
        "questionthem-90ccf";
      const location = reqLocation || process.env.LOCATION || "us-central1";

      if (!projectId) {
        logger.error(
          "extractInformationFallBack: Google Cloud Project ID is not configured.",
        );
        return res
          .status(500)
          .json({ error: "Google Cloud Project ID is not configured." });
      }

      const clientOptions = {
        apiEndpoint: `${location}-aiplatform.googleapis.com`,
      };

      // Instantiates a client (using the default service account, which is usually fine)
      const predictionServiceClient = new PredictionServiceClient(
        clientOptions,
      );

      const publisher = "google";
      const model = "text-bison@001"; // Or 'gemini-pro', 'gemini-1.0-pro' for text generation

      try {
        const endpoint = `projects/${projectId}/locations/${location}/publishers/${publisher}/models/${model}`;

        const instance = {
          content: prompt, // Use the prompt from the request body
        };
        const instanceValue = helpers.toValue(instance);
        const instances = [instanceValue];

        const parameter = {
          temperature: 0.2,
          maxOutputTokens: 256,
          topP: 0,
          topK: 1,
        };
        const parameters = helpers.toValue(parameter);

        const request = {
          endpoint,
          instances,
          parameters,
        };

        logger.info(
          `Sending text prediction request to Vertex AI for prompt: "${prompt.substring(0, 50)}..."`,
        );
        const [response] = await predictionServiceClient.predict(request);
        const predictions = response.predictions;

        if (!predictions || predictions.length === 0) {
          logger.warn("Vertex AI returned no predictions for text generation.");
          return res.status(500).json({ error: "No text generated from AI." });
        }

        // Assuming the first prediction contains the text content
        const generatedText =
          predictions[0]?.structValue?.fields?.content?.stringValue;

        if (!generatedText) {
          logger.warn(
            "Vertex AI prediction did not contain expected text content.",
          );
          return res
            .status(500)
            .json({ error: "AI response format unexpected." });
        }

        logger.info("Text generated successfully.");
        res.status(200).json({
          data: {
            prompt: prompt,
            generatedText: generatedText,
            // You can include raw predictions if needed for debugging
            // rawPredictions: predictions,
          },
        });
      } catch (error) {
        logger.error("Error calling Vertex AI text generation:", error);
        res.status(500).json({
          error: "Failed to get AI text generation response.",
          details: error.message,
        });
      }
    });
  },
);

// Export all functions
module.exports = {
  sayHelloAgainFromSomeFolder,
  extractInformation, // Callable function for secret access + AI platform
  extractInformationFallBack, // HTTP function for direct AI platform text generation
};
