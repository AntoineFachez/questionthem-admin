// functions/services/textBisonService.js

const { PredictionServiceClient } = require("@google-cloud/aiplatform").v1;
const { helpers } = require("@google-cloud/aiplatform");

const location = process.env.VERTEX_AI_LOCATION || "us-central1";
const clientOptions = { apiEndpoint: `${location}-aiplatform.googleapis.com` };
const predictionServiceClient = new PredictionServiceClient(clientOptions);

/**
 * Generates text using the text-bison model from Vertex AI.
 * @param {object} options - The options for text generation.
 * @param {object} options.logger - The Firebase Functions logger instance.
 * @param {string} options.projectId - The Google Cloud project ID.
 * @param {string} options.prompt - The text prompt for the model.
 * @returns {Promise<string>} The generated text.
 * @throws {Error} If the API call fails or returns no content.
 */
async function generateText({ logger, projectId, prompt }) {
  const endpoint = `projects/${projectId}/locations/${location}/publishers/google/models/text-bison@001`;

  const instance = helpers.toValue({ content: prompt });
  const parameters = helpers.toValue({
    temperature: 0.2,
    maxOutputTokens: 256,
    topP: 0,
    topK: 1,
  });

  const request = { endpoint, instances: [instance], parameters };

  try {
    logger.info(
      `Sending text prediction request to Vertex AI for prompt: "${prompt.substring(
        0,
        50,
      )}..."`,
    );
    const [response] = await predictionServiceClient.predict(request);
    const predictions = response.predictions;

    const generatedText =
      predictions?.[0]?.structValue?.fields?.content?.stringValue;

    if (!generatedText) {
      throw new Error("AI prediction did not contain expected text content.");
    }
    logger.info("Text generated successfully.");
    return generatedText;
  } catch (error) {
    logger.error("Error calling Vertex AI text generation:", error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
}

module.exports = { generateText };
