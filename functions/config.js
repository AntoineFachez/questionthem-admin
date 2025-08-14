// functions/config/environment.js

/**
 * This file is primarily for defining and exporting configuration variables.
 *
 * In a deployed Firebase Cloud Function, environment variables set during deployment
 * (e.g., via `firebase deploy --set-env-vars ...` or `gcloud functions deploy --set-env-vars ...`)
 * are automatically available via `process.env`.
 *
 * For local development, if you are using a `.env` file and `dotenv` to load it,
 * these variables will be populated from your `.env` file.
 */

// If you are using `dotenv` for local development, ensure it's loaded where needed.
// For example, in your functions/index.js if you need it globally, or in specific function files.
// require('dotenv').config(); // Only for local development, remove for deployment to Cloud Functions

const CLIENT_URL = process.env.CLIENT_URL;
const SERVER_PORT = process.env.SERVER_PORT; // This would typically be undefined in Cloud Functions, as they don't run on a fixed port you control.

module.exports = {
  CLIENT_URL,
  SERVER_PORT,
};
