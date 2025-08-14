// functions/index.js

const admin = require("firebase-admin");
const { setGlobalOptions } = require("firebase-functions/v2");

// Initialize Firebase Admin SDK once globally.
admin.initializeApp();

// Set global options for all functions in this codebase.
// This sets the default region to 'europe-west1'.
setGlobalOptions({
  region: "europe-west4",
});

// Import and re-export your v2 functions.
const {
  incrementCollectionCounter,
  decrementCollectionCounter,
} = require("./firestore/documentCountUpdater");

// The Express app is also a function, so it should be handled correctly here if you have one.
const app = require("./app");

module.exports = {
  incrementCollectionCounter,
  decrementCollectionCounter,
  app, // Make sure to export your Express app if needed
};
