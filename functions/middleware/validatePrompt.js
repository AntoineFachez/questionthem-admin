// functions/middleware/validatePrompt.js

const { sendError } = require("../utils/responseFormatter");

/**
 * Middleware to validate the presence of 'prompt' in req.body.
 */
const validatePrompt = (req, res, next) => {
  if (!req.body?.prompt) {
    return sendError(
      res,
      "A 'prompt' property is required in the request body.",
      400,
    );
  }
  next();
};

module.exports = { validatePrompt };
