// functions/youtube/index.js

// NEW: Use specific imports from firebase-functions/v2
const { onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions"); // Use v2 logger for consistent logging
const { HttpsError } = require("firebase-functions/v2/https"); // For structured errors

const { YoutubeTranscript } = require("youtube-transcript");

// CORS is automatically handled by Firebase for callable functions.
// const cors = require("cors")({ origin: true }); // No longer needed for onCall functions

/**
 * Callable Cloud Function to retrieve a YouTube video transcript.
 *
 * It expects data to be passed via a callable function request, e.g.:
 * `{ "videoId": "dQw4w9WgXcQ" }`
 *
 * @param {object} data - The data passed to the callable function.
 * @param {string} data.videoId - The ID of the YouTube video.
 * @param {object} context - The context of the callable function call (contains auth, etc.).
 * @returns {Promise<{transcript: Array<object>}>} An object containing the transcript data.
 * @throws {HttpsError} If the video ID is missing, invalid, or fetching fails.
 */
const getYouTubeTranscript = onCall(
  {
    // Options passed directly to the function definition.
    // The region will be picked up from setGlobalOptions in index.js,
    // but you can override it here if needed: region: 'europe-west1',
    memory: "512MiB", // A reasonable default for this task
    // timeoutSeconds: 30, // Adjust timeout as needed for external API calls
  },
  async (data) => {
    // For callable functions, Firebase handles CORS automatically.
    // No need for explicit CORS middleware or headers here.

    logger.info(
      `Received data for getYouTubeTranscript: ${JSON.stringify(data)}`,
    );

    // --- 1. Validate Input ---
    const videoId = data?.videoId; // Use optional chaining for safe access

    if (!videoId) {
      logger.error("Validation Error: Missing videoId in request data.");
      // Throw an HttpsError for structured error responses to the client
      throw new HttpsError(
        "invalid-argument",
        "The function must be called with a 'videoId' argument.",
      );
    }

    // --- 2. Fetch Transcript using youtube-transcript ---
    try {
      logger.info(`Fetching transcript for videoId: ${videoId}`);
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);

      if (!transcriptData || transcriptData.length === 0) {
        logger.warn(
          `No transcript found or transcript is empty for videoId: ${videoId}`,
        );
        throw new HttpsError(
          "not-found",
          `No transcript found or it is empty for video ID: ${videoId}. This might be due to video settings or availability.`,
        );
      }

      logger.info(
        `Successfully fetched transcript for videoId: ${videoId}. Number of entries: ${transcriptData.length}`,
      );
      // Return the transcript data to the client
      return {
        transcript: transcriptData,
      };
    } catch (error) {
      logger.error(`Error fetching transcript for videoId ${videoId}:`, error);

      // Check for specific error types or messages from the `youtube-transcript` library
      if (error.message && error.message.toLowerCase().includes("disabled")) {
        throw new HttpsError(
          "failed-precondition", // Or 'not-found'
          `Transcript is disabled for video ID: ${videoId}. Original error: ${error.message}`,
        );
      } else if (
        error.message &&
        error.message.toLowerCase().includes("not found")
      ) {
        throw new HttpsError(
          "not-found",
          `Video or transcript not found for ID: ${videoId}. Original error: ${error.message}`,
        );
      }
      // For other general errors (network issues, unexpected responses, etc.)
      throw new HttpsError(
        "internal", // General internal error code
        `Failed to fetch transcript for video ID: ${videoId}. Please try again later.`,
        { originalError: error.message }, // Include original error message for debugging
      );
    }
  },
);

module.exports = {
  getYouTubeTranscript,
};
