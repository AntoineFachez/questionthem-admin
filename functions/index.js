// functions/index.js

const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK once globally.
try {
  admin.initializeApp();
} catch (e) {
  /* This can be ignored on local emulator reloads */
}

// Set global options for all functions in this project.
setGlobalOptions({ region: "europe-west1" });

// --- Import the Main API ---
// The entire Express app is treated as a single Cloud Function.
const app = require("./app");

// --- Import All Trigger Functions ---
// Group imports by their trigger type for clarity.

// Auth Triggers
const { handleUserCreate } = require("./triggers/callableAuth");

// Firestore Triggers
const {
  incrementCollectionCounter,
  decrementCollectionCounter,
} = require("./triggers/triggerDocCount");

// Scheduled Triggers
const { accountCleanup } = require("./scheduler/accountCleanup");

// Callable Triggers (Client-invoked functions)
const { backfillEmbeddings } = require("./triggers/callableEmbeddingsGen");
const { secureDataExtractor } = require("./auth/secureAi");
const { fetchContent } = require("./triggers/callableScraper");
const { getYouTubeTranscript } = require("./triggers/callableTransscript");

// --- Export All Functions ---

// 1. Export the unified HTTP API
// All routes defined in app.js are served through this single endpoint.
exports.api = onRequest({ memory: "1GiB" }, app);

// 2. Export all background and callable triggers individually
exports.handleUserCreate = handleUserCreate;
exports.incrementCollectionCounter = incrementCollectionCounter;
exports.decrementCollectionCounter = decrementCollectionCounter;
exports.accountCleanup = accountCleanup;
exports.backfillEmbeddings = backfillEmbeddings;
exports.fetchContent = fetchContent;
exports.getYouTubeTranscript = getYouTubeTranscript;
exports.secureDataExtractor = secureDataExtractor;
