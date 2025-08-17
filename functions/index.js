/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable indent */

// NEW: Use specific imports from firebase-functions/v2
const { setGlobalOptions } = require("firebase-functions/v2");
const { HttpsFunction, onRequest } = require("firebase-functions/v2/https"); // For type hinting if desired

const express = require("express");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK (do this once globally)
// If you have a serviceAccountKey.json, ensure it's in the functions folder
// Otherwise, Firebase Admin SDK can often auto-initialize in Cloud Functions environment
try {
  admin.initializeApp();
} catch (error) {
  console.error(
    "Firebase Admin SDK already initialized or error during init:",
    error,
  );
  // This error can happen if you run `firebase emulators` locally and init happens multiple times.
  // In a deployed Cloud Function, it should only happen once.
}

// Optional: Set global options for all functions in this codebase.
// This is often done in functions/index.js for the entire codebase.
setGlobalOptions({
  region: "europe-west1", // Set your desired region here for all functions by default
  // Add other global options like memory, cpu, timeout if needed
  // memory: '128MiB', // Example
  // timeoutSeconds: 300, // Example
});

// Import and re-export your functions
// Note: For functions exposed directly as HTTP endpoints,
// they should typically handle their own CORS if not using a global middleware.
// For callable functions, Firebase handles CORS automatically.

// Import modules
const app = require("./app"); // Assuming this is an Express app
const {
  getAllDocs,
  sayHello,
  getAllStories,
  getDocIdSByValueSearch, // Assuming you want to re-enable this if it was fixed
} = require("./firestore/firestore.js");
const {
  analyzeSentiment,
  analyzingSyntax,
  extractEntities,
} = require("./llm/analyzingText.js");
const {
  sayHelloAgainFromSomeFolder,
  extractInformation,
} = require("./someFiles/someOtherFile.js");
const {
  incrementCollectionCounter,
  decrementCollectionCounter,
} = require("./firestore/documentCountUpdater");
// const { helloAuth, emailSender } = require("./users/onCreate.js");
// const { fetchPage } = require("./webpage-fetcher/fetchUrl.js");
// const { standIn3 } = require("./llm/chatbot.js");
const { fetchContent } = require("./scraper/scraper.js");
const { getYouTubeTranscript } = require("./youtube/index.js");
const { generateImageFromPrompt } = require("./llm/imagen.js"); // Your new function

const orchestratorApp = require("./agenticEngine/orchestrator.js");
// --- Export your functions ---
// For functions defined directly in other files using the v2 syntax,
// you can just export them directly.

// Assuming 'app' is an Express app, you might want to wrap it like this for v2 HTTP function
// or keep it as a v1 function if 'app' itself requires v1 context.
// If your 'app' is truly an Express app that uses `functions.https.onRequest`,
// you'd typically migrate `app` to v2 like this:
// const { onRequest } = require("firebase-functions/v2/https");
// exports.api = onRequest(app); // This would make your whole Express app a v2 function
// However, given your current setup, we'll assume `app` is a V1 compatibility function for now,
// or that it's meant to be an internal module not directly exported as a function.

module.exports = {
  // Re-exporting functions from other modules
  // No need to wrap them again if they are already defined using v2 syntax in their files
  analyzingSyntax,
  extractEntities,
  // standIn3,
  fetchContent,
  getYouTubeTranscript,
  generateImageFromPrompt, // Your new image generation function
  // helloAuth,
  // emailSender,
  // If your firestore functions (getAllDocs, sayHello, etc.) are now correctly
  // defined as v2 functions in firestore/firestore.js, you can export them directly
  getAllDocs,
  incrementCollectionCounter,
  decrementCollectionCounter,
  sayHello,
  getAllStories,
  getDocIdSByValueSearch, // Make sure this function is defined and exported from firestore.js
  agenticQueryEngine: onRequest(orchestratorApp.agenticQueryEngine),
  // For `app` (if it's an Express app meant to be a single function endpoint)
  // You would typically wrap it like:
  // exports.api = onRequest(app);
  // If 'app' is just a module, remove this line or adjust its usage.
  // For now, assuming 'app' is correctly defined in its module and exported as a function:
  app, // If app is an actual function, e.g., exports.app = functions.https.onRequest(expressApp);
  // if it's an express instance itself you might need to wrap it in onRequest
  // exports.api = onRequest(app); // This would make it a single HTTP endpoint
};
