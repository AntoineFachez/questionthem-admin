// functions/scheduler/accountCleanup.js

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const { deleteInactiveUsers } = require("../services/authMaintenanceService");

/**
 * Scheduled function that runs daily to clean up inactive user accounts.
 */
exports.accountCleanup = onSchedule(
  {
    schedule: "0 0 * * *", // Runs at midnight every day
    timeoutSeconds: 540,
    memory: "512MiB",
    maxInstances: 1,
  },
  async () => {
    logger.info("Scheduled user account cleanup starting.");
    try {
      await deleteInactiveUsers({ logger });
    } catch (error) {
      logger.error("The account cleanup process failed:", error);
    }
  },
);
