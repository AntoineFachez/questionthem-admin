// functions/index.js
require("@google-cloud/trace-agent").start();
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
  handleDocumentCreation,
  handleDocumentDeletion,
  recalculateDatabaseStats,
} = require("./triggers/triggerDocCount");

//* Scheduled Triggers
// const { accountCleanup } = require("./scheduler/accountCleanup");
// const { batchUpdateStats } = require("./scheduler/batchUpdate");
const { firehosePublisher } = require("./firehosePublisher/firehosePublisher");
//* Callable Triggers (Client-invoked functions)
// const { backfillEmbeddings } = require("./triggers/callableEmbeddingsGen");
// const { secureDataExtractor } = require("./auth/secureAi");
const { fetchContent } = require("./triggers/callableScraper");

// const { getYouTubeTranscript } = require("./triggers/callableTransscript");

//* Auth Triggers
//! not in firebase SDK /v2 yet
// const { handleUserCreate } = require("./triggers/callableAuth");

// --- Export All Functions ---
//* app.js export

exports.api = onRequest({ memory: "1GiB" }, app);
//* individual background and callable triggers
// exports.accountCleanup = accountCleanup;
// exports.batchUpdateStats = batchUpdateStats;
// exports.backfillEmbeddings = backfillEmbeddings;
exports.fetchContent = fetchContent;
exports.firehosePublisher = firehosePublisher;
// exports.handleUserCreate = handleUserCreate;
exports.handleDocumentCreation = handleDocumentCreation;
exports.handleDocumentDeletion = handleDocumentDeletion;

// exports.getYouTubeTranscript = getYouTubeTranscript;
exports.recalculateDatabaseStats = recalculateDatabaseStats;
// exports.secureDataExtractor = secureDataExtractor;
//! not in firebase SDK /v2 yet
