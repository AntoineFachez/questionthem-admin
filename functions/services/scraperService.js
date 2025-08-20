// functions/services/scraperService.js

/**
 * Fetches the text content of a given URL.
 * @param {object} options - The options for fetching.
 * @param {object} options.logger - The Firebase Functions logger instance.
 * @param {string} options.url - The URL to fetch.
 * @returns {Promise<string>} The fetched text content.
 * @throws {Error} If the URL is invalid or fetching fails.
 */
async function fetchUrlContent({ logger, url }) {
  // 1. Validate Input
  if (!url || typeof url !== "string") {
    throw new Error("A valid URL string must be provided.");
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error("The URL must start with http:// or https://.");
  }

  // 2. Perform the Core Task
  try {
    logger.info(`Attempting to fetch content from: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status} - ${response.statusText}`,
      );
    }

    const content = await response.text();
    logger.info(
      `Successfully fetched content from ${url}. Length: ${content.length}`,
    );
    return content;
  } catch (error) {
    logger.error(`Error during fetch operation for ${url}:`, error);
    // Re-throw the error to be handled by the caller
    throw new Error(
      `Could not retrieve content from the URL. Reason: ${error.message}`,
    );
  }
}

module.exports = {
  fetchUrlContent,
};
