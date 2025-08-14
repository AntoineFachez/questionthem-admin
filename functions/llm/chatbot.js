/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable indent */

// NEW: Use specific imports from firebase-functions/v2
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions"); // Use v2 logger for better logging

const cors = require("cors");

// Important: For Cloud Functions, environment variables set via `firebase functions:config:set`
// or in the Google Cloud Console are automatically available via process.env.
// You do NOT typically need `require("dotenv").config()` in deployed functions.
// If you are using it for local development with `firebase emulators`, that's fine,
// but ensure GOOGLE_GEN_AI_KEY is set via `firebase functions:config:set google_gen_ai.key="YOUR_KEY"`
// and accessed as functions.config().google_gen_ai.key.
// For simplicity and deployment readiness, I'll assume it's set as a Cloud Function env var.
// process.env.GOOGLE_GEN_AI_KEY

const {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} = require("@google/generative-ai");

// You'll need to define `allowedOrigins` or import it correctly.
// For now, I'll assume it's either an array or '*' as per your original code.
const allowedOrigins = require("../cors/allowedOrigins"); // Ensure this path is correct

// Initialize Generative AI.
// For production, use Firebase Functions' config or Cloud Secrets Manager.
// For local development, process.env is fine if .env is loaded.
// Here, we'll try to get it from process.env for direct deployment readiness.
const geminiApiKey = process.env.GOOGLE_GEN_AI_KEY;

if (!geminiApiKey) {
  logger.error("GOOGLE_GEN_AI_KEY environment variable is not set.");
  // In a deployed function, this will prevent initialization issues later.
  // For local emulator, ensure your .env has it or use firebase functions:config:set
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

// You had `app.post("standIn3", async (req, res) => {});` which suggests
// `app` is an Express app, but `standIn3` is also exported as a function.
// If `app` is an Express app that serves your functions, you'd typically export it
// as `const api = onRequest(app);` in index.js, and then define routes within `app`.
// If `standIn3` is meant to be a standalone HTTP function, keep it as `onRequest`.
// I'm proceeding assuming `standIn3` is a standalone HTTP function.

// standIn3 Function (migrated to v2 HTTP function syntax)
const standIn3 = onRequest(
  {
    // Options passed directly to the function definition.
    // Region set globally in index.js via setGlobalOptions, but can be overridden here.
    memory: "512MiB", // Memory specified directly
    timeoutSeconds: 180, // Timeout specified directly
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

      // Ensure it's a POST request for data
      if (req.method !== "POST") {
        return res.status(405).send({
          data: {
            error: "Method Not Allowed. Only POST requests are accepted.",
          },
        });
      }

      const data = req.body.data; // Assuming `data` is nested in the request body
      const userMessage = data?.message || "Tell me something interesting."; // Get message from request, default if not provided

      if (!geminiApiKey) {
        logger.error(
          "Gemini API Key is missing. Cannot proceed with AI request.",
        );
        return res.status(500).send({
          data: { error: "Server configuration error: AI Key not set." },
        });
      }

      const generationConfig = {
        temperature: 0.9,
        topP: 1,
        topK: 32,
        maxOutputTokens: 100, // limit output
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          // Add other safety settings as needed
          // {
          //   category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          //   threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          // },
          // {
          //   category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          //   threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          // },
          // {
          //   category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          //   threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          // },
        ],
      };

      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        generationConfig: generationConfig, // Pass generationConfig here
      });

      try {
        // The prompt should likely come from `userMessage` or be dynamic
        const prompt = userMessage; // Using the message from the request body as the prompt

        logger.info(`Sending prompt to Gemini: "${prompt}"`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        logger.info(`Gemini response: "${text}"`);

        // Respond with the AI's generated text
        res.status(200).send({
          data: {
            aiResponse: text,
            receivedData: data, // Echo back original data for context
          },
        });
      } catch (error) {
        logger.error("Error generating content with Gemini:", error);
        // More specific error handling for AI API issues
        let errorMessage = "Failed to get AI response.";
        if (error.status && error.message) {
          errorMessage = `AI API Error (${error.status}): ${error.message}`;
        } else if (error.code && error.details) {
          // Specific errors from @google/generative-ai
          errorMessage = `AI Error (${error.code}): ${error.details}`;
        }

        res.status(500).send({
          data: {
            error: errorMessage,
            details: error.toString(), // Send full error object for debugging
          },
        });
      }
    });
  },
);

// Exports the function
module.exports = {
  standIn3,
};
