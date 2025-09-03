// utils/cloudLogger.js
const { Logging } = require("@google-cloud/logging");
const logging = new Logging();

const writeLog = async (logName, metadata, data) => {
  try {
    const log = logging.log(logName);
    const entry = log.entry(metadata, data);
    await log.write(entry);
  } catch (error) {
    console.error(`Failed to write log entry to ${logName}:`, error);
  }
};

const writeErrorLog = async (logName, metadata, error) => {
  try {
    const log = logging.log(logName);
    const entry = log.entry(
      { ...metadata, severity: "ERROR" }, // Add severity for filtering
      {
        message: error.message,
        stack: error.stack,
        originatingEndpoint: metadata.labels.originatingEndpoint, // Use existing metadata
      },
    );
    await log.write(entry);
  } catch (logError) {
    console.error(`Failed to write error log to ${logName}:`, logError);
  }
};

module.exports = { writeLog, writeErrorLog };
