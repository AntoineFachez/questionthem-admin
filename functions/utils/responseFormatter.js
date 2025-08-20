// functions/utils/responseFormatter.js

/**
 * Sends a standardized success response.
 * @param {object} res The Express response object.
 * @param {object} data The payload to send.
 * @param {number} statusCode The HTTP status code.
 */
const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data: data,
  });
};

/**
 * Sends a standardized error response.
 * @param {object} res The Express response object.
 * @param {string} message The error message.
 * @param {number} statusCode The HTTP status code.
 * @param {object|null} details Optional additional error details.
 */
const sendError = (res, message, statusCode = 500, details = null) => {
  const errorResponse = {
    success: false,
    error: {
      message: message,
    },
  };
  if (details) {
    errorResponse.error.details = details;
  }
  res.status(statusCode).json(errorResponse);
};

module.exports = {
  sendSuccess,
  sendError,
};
