// functions/services/authMaintenanceService.js

const admin = require("firebase-admin");
const PromisePool = require("es6-promise-pool").default;

// Max concurrent account deletions.
const MAX_CONCURRENT = 3;

/**
 * Recursively fetches all users who have been inactive for 30+ days.
 * @param {object} logger - The Firebase Functions logger instance.
 * @param {admin.auth.UserRecord[]} users - Accumulated users.
 * @param {string} nextPageToken - Token for fetching the next page.
 * @returns {Promise<admin.auth.UserRecord[]>} A list of inactive users.
 */
async function findInactiveUsers(logger, users = [], nextPageToken) {
  const result = await admin.auth().listUsers(1000, nextPageToken);
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  // Filter for users inactive for more than 30 days.
  const inactiveBatch = result.users.filter(
    (user) =>
      (user.metadata.lastRefreshTime || user.metadata.lastSignInTime) <
      thirtyDaysAgo,
  );

  users.push(...inactiveBatch);

  if (result.pageToken) {
    logger.info(
      `Fetching next page of users... Found ${users.length} inactive users so far.`,
    );
    return findInactiveUsers(logger, users, result.pageToken);
  }

  return users;
}

/**
 * Deletes a list of inactive users with limited concurrency.
 * @param {object} options - The options for the deletion process.
 * @param {object} options.logger - The Firebase Functions logger instance.
 */
async function deleteInactiveUsers({ logger }) {
  const inactiveUsers = await findInactiveUsers(logger);
  logger.info(`Found ${inactiveUsers.length} inactive users to delete.`);

  if (inactiveUsers.length === 0) {
    return;
  }

  const promisePool = new PromisePool(() => {
    const userToDelete = inactiveUsers.pop();
    if (!userToDelete) {
      return null; // Signal to the pool that we are done.
    }
    return admin
      .auth()
      .deleteUser(userToDelete.uid)
      .then(() => logger.log(`Deleted inactive user: ${userToDelete.uid}`))
      .catch((err) =>
        logger.error(`Failed to delete user ${userToDelete.uid}:`, err),
      );
  }, MAX_CONCURRENT);

  await promisePool.start();
  logger.info("Inactive user deletion process finished.");
}

module.exports = { deleteInactiveUsers };
