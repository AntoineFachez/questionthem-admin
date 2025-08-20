// functions/services/geminiService.js

const {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} = require("@google/generative-ai");

// Initialize the client once when the module is loaded.
const geminiApiKey = process.env.GOOGLE_GEN_AI_KEY;
if (!geminiApiKey) {
  // This will log once on function startup if the key is missing.
  console.error(
    "FATAL ERROR: GOOGLE_GEN_AI_KEY environment variable is not set.",
  );
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

const generationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 32,
  maxOutputTokens: 250, // Increased for better responses
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
};

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig,
});

/**
 * Generates a text response from the Gemini model based on a prompt.
 * @param {object} options - The options for generating content.
 * @param {object} options.logger - The Firebase Functions logger instance.
 * @param {string} options.prompt - The user's prompt to send to the model.
 * @returns {Promise<string>} The generated text response.
 * @throws {Error} If the API key is missing or content generation fails.
 */
async function generateChatResponse({ logger, prompt }) {
  if (!geminiApiKey) {
    throw new Error("Server configuration error: AI Key not set.");
  }

  try {
    logger.info(`Sending prompt to Gemini: "${prompt}"`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    logger.info("Gemini response received.");
    return text;
  } catch (error) {
    logger.error("Error generating content with Gemini:", error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
}

module.exports = {
  generateChatResponse,
};
