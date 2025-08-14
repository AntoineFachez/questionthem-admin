const { VertexAI } = require("@google-cloud/vertexai");

/**
 * Analyzes an image using Vertex AI's Gemini 1.0 Pro Vision model.
 *
 * @param {object} options - The options for image analysis.
 * @param {string} options.projectId - Your Google Cloud project ID.
 * @param {string} [options.location='us-central1'] - The Vertex AI region.
 * @param {string} [options.model='gemini-1.0-pro-vision'] - The Gemini model to use.
 * @param {string} options.prompt - The text prompt for the image.
 * @param {string} options.imageUriOrBase64 - The Google Cloud Storage URI (e.g., 'gs://your-bucket/image.jpg')
 * or a base64 encoded string of the image.
 * @param {string} [options.mimeType='image/jpeg'] - The MIME type of the image (e.g., 'image/jpeg', 'image/png').
 * @returns {Promise<string>} The extracted text content from the image analysis.
 * @throws {Error} If the image analysis fails or no text is returned.
 */
async function analyzeImageContent({
  projectId = process.env.PROJECT_ID,
  location = process.env.VERTEX_AI_LOCATION || "us-central1", // Default location
  model = "gemini-1.0-pro-vision",
  prompt,
  imageUriOrBase64,
  mimeType = "image/jpeg",
}) {
  if (!projectId) {
    throw new Error("projectId is required.");
  }
  if (!prompt) {
    throw new Error("prompt text is required.");
  }
  if (!imageUriOrBase64) {
    throw new Error(
      "imageUriOrBase64 is required (Google Cloud Storage URI or base64 string).",
    );
  }

  // Initialize Vertex with your Cloud project and location
  const vertexAI = new VertexAI({ project: projectId, location: location });

  // Instantiate the model
  const generativeVisionModel = vertexAI.getGenerativeModel({
    model: model,
  });

  let filePart;
  if (imageUriOrBase64.startsWith("gs://")) {
    // It's a GCS URI
    filePart = {
      fileData: {
        fileUri: imageUriOrBase64,
        mimeType: mimeType,
      },
    };
  } else {
    // Assume it's a base64 string
    filePart = {
      inlineData: {
        // Use inlineData for base64 strings
        data: imageUriOrBase64,
        mimeType: mimeType,
      },
    };
  }

  const textPart = {
    text: prompt,
  };

  const request = {
    contents: [{ role: "user", parts: [filePart, textPart] }],
  };

  try {
    // Create the response stream
    const responseStream =
      await generativeVisionModel.generateContentStream(request);

    // Wait for the response stream to complete
    const aggregatedResponse = await responseStream.response;

    // Select the text from the response
    const fullTextResponse =
      aggregatedResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!fullTextResponse) {
      throw new Error(
        "No text content found in the response from Gemini Vision model.",
      );
    }

    return fullTextResponse;
  } catch (error) {
    console.error("Error analyzing image content:", error);
    throw new Error(`Failed to analyze image content: ${error.message}`);
  }
}

// --- Example Usage (for testing or local script execution) ---
// You would typically call this function from your Cloud Function or other application code.
/*
(async () => {
  try {
    const projectId = process.env.PROJECT_ID || 'your-gcp-project-id'; // Replace with your project ID
    const location = process.env.VERTEX_AI_LOCATION || 'us-central1'; // Replace with your region

    // Example 1: Using a Google Cloud Storage URI
    const gcsResult = await analyzeImageContent({
      projectId: projectId,
      location: location,
      prompt: "Describe this image in detail.",
      imageUriOrBase64: "gs://generativeai-downloads/images/scones.jpg",
      mimeType: "image/jpeg",
    });
    console.log("--- GCS Image Analysis Result ---");
    console.log(gcsResult);

    // Example 2: Using a base64 encoded image string (replace with actual base64)
    // IMPORTANT: In a real scenario, the base64 string would be much longer.
    // This is just a placeholder to show the structure.
    const base64DummyImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; // A tiny 1x1 transparent PNG base64
    const base64Result = await analyzeImageContent({
      projectId: projectId,
      location: location,
      prompt: "What is this image? Is it a real photo?",
      imageUriOrBase64: base64DummyImage,
      mimeType: "image/png",
    });
    console.log("--- Base64 Image Analysis Result ---");
    console.log(base64Result);

  } catch (err) {
    console.error("Script execution failed:", err);
  }
})();
*/

module.exports = {
  analyzeImageContent,
};
