/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable indent */

// Import CORS middleware
const cors = require("cors");
const { onRequest } = require("firebase-functions/v2/https");
// No need for setGlobalOptions here, it's done in index.js

// Ensure Firebase Admin SDK is initialized if it's not done in index.js globally
// It's generally better to initialize it once in your main index.js file.
const admin = require("firebase-admin");
if (!admin.apps.length) {
  admin.initializeApp();
}

// CORS setup - for v2 functions, you handle CORS explicitly within the handler
const allowedOrigins = require("../cors/allowedOrigins");

// --- Updated Functions using v2 syntax ---

// getAllDocs
const getAllDocs = onRequest(
  {
    // You can add per-function options here, e.g., memory, timeout
    memory: "512MiB",
    timeoutSeconds: 3, // Assuming this was desired from old runWith
  },
  async (req, res) => {
    const corsHandler = cors({ origin: allowedOrigins });
    corsHandler(req, res, async () => {
      // <<< CRUCIAL: Handle OPTIONS preflight request for CORS >>>
      if (req.method === "OPTIONS") {
        res.status(204).send(""); // Respond with 204 No Content for preflight
        return;
      }

      // Ensure it's a POST request if you expect req.body.data
      if (req.method !== "POST") {
        res.status(405).json({
          error: "Method Not Allowed. Only POST requests are accepted.",
        });
        return;
      }

      const data = req.body.data;
      if (!data || !data.name || !data.message) {
        res
          .status(400)
          .json({ error: "Missing required fields (name, message) in data." });
        return;
      }

      res.status(200).json({
        result: `hey ${data.name}, thanks for saying "${data.message}", getAllDocs says hello too!`,
      });
    });
  },
);

// sayHello
const sayHello = onRequest(
  { memory: "512MiB", timeoutSeconds: 3 },
  async (req, res) => {
    const corsHandler = cors({ origin: allowedOrigins });
    corsHandler(req, res, async () => {
      // <<< CRUCIAL: Handle OPTIONS preflight request for CORS >>>
      if (req.method === "OPTIONS") {
        res.status(204).send(""); // Respond with 204 No Content for preflight
        return;
      }

      if (req.method !== "POST") {
        res.status(405).json({
          error: "Method Not Allowed. Only POST requests are accepted.",
        });
        return;
      }

      const data = req.body.data;
      if (!data || !data.name || !data.message) {
        res
          .status(400)
          .json({ error: "Missing required fields (name, message) in data." });
        return;
      }

      res.status(200).json({
        result: `hey ${data.name}, thanks for saying "${data.message}", sayHello says hello too!`,
      });
    });
  },
);

// getAllStories
const getAllStories = onRequest(
  { memory: "512MiB", timeoutSeconds: 3 },
  async (request, response) => {
    const corsHandler = cors({ origin: allowedOrigins });
    corsHandler(request, response, async () => {
      // <<< CRUCIAL: Handle OPTIONS preflight request for CORS >>>
      if (request.method === "OPTIONS") {
        response.status(204).send(""); // Respond with 204 No Content for preflight
        return;
      }

      // No explicit method check for GET if it's meant to be GET, but POST is assumed by body.data
      // If this is meant to be a GET, change request.body.data to request.query or adjust logic.

      // Ensure admin is initialized and accessible here
      try {
        const snapshot = await admin.firestore().collection("stories").get();
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        response.json({ posts });
      } catch (error) {
        console.error("Error fetching stories:", error);
        response.status(500).json({
          error: "Failed to retrieve stories.",
          details: error.message,
        });
      }
    });
  },
);

// If you had getDocIdSByValueSearch in this file, update it similarly:
// const getDocIdSByValueSearch = onRequest(
//   {
//     timeoutSeconds: 3,
//   },
//   async (req, res) => {
//     const corsHandler = cors({ origin: allowedOrigins });
//     corsHandler(req, res, async () => {
//       if (req.method === 'OPTIONS') {
//         res.status(204).send('');
//         return;
//       }
//       if (req.method !== 'POST') {
//         res.status(405).json({ error: 'Method Not Allowed. Only POST requests are accepted.' });
//         return;
//       }
//       // ... your logic for getDocIdSByValueSearch ...
//       res.status(200).json({ status: 'ok' });
//     });
//   }
// );

module.exports = {
  getAllDocs,
  sayHello,
  getAllStories,
  // getDocIdSByValueSearch,
};
