// functions/index.js
require("dotenv").config({ path: "../.env" });
const admin = require("firebase-admin");
const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");

try {
  admin.initializeApp();
} catch (e) {
  /* This can be ignored on local emulator reloads */
}
setGlobalOptions({ region: "europe-west1" });

// --- Import the Main API ---
const app = require("./app");

// --- Import All Trigger Functions ---
//* Firestore Triggers
const {
  incrementCollectionCounter,
  decrementCollectionCounter,
} = require("./triggers/triggerDocCount");

//* Scheduled Triggers
const { accountCleanup } = require("./scheduler/accountCleanup");
const { batchUpdateStats } = require("./scheduler/batchUpdate");

//* Callable Triggers (Client-invoked functions)
const { backfillEmbeddings } = require("./triggers/callableEmbeddingsGen");
const { secureDataExtractor } = require("./auth/secureAi");
const { fetchContent } = require("./triggers/callableScraper");
const { getYouTubeTranscript } = require("./triggers/callableTransscript");

//* Auth Triggers
//! not in firebase SDK /v2 yet
// const { handleUserCreate } = require("./triggers/callableAuth");

// --- Export All Functions ---
//* app.js export
exports.api = onRequest({ memory: "1GiB" }, app);
//* individual background and callable triggers
exports.incrementCollectionCounter = incrementCollectionCounter;
exports.decrementCollectionCounter = decrementCollectionCounter;
exports.accountCleanup = accountCleanup;
exports.batchUpdateStats = batchUpdateStats;
exports.backfillEmbeddings = backfillEmbeddings;
exports.fetchContent = fetchContent;
exports.getYouTubeTranscript = getYouTubeTranscript;
exports.secureDataExtractor = secureDataExtractor;
//! not in firebase SDK /v2 yet
// exports.handleUserCreate = handleUserCreate;
