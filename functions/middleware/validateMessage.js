// functions/middleware/validateMessage.js

const { sendError } = require("../utils/responseFormatter");
const { logger } = require("firebase-functions");

/**
 * Express middleware to validate the presence of 'message' in req.body.data.
 */
const validateMessage = (req, res, next) => {
  const message = req.body?.data?.message;

  if (!message) {
    const errorMessage =
      "The request body must include a 'data' object with a 'message' property.";
    logger.error("Validation Error:", errorMessage, { body: req.body });
    return sendError(res, errorMessage, 400);
  }

  // If validation passes, proceed to the next handler
  next();
};

module.exports = {
  validateMessage,
};
