/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// The Cloud Functions for Firebase SDK to set up triggers and logging.
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions"); // Use v2 logger for consistent logging

// The Firebase Admin SDK to delete inactive users.
const admin = require("firebase-admin");

// The es6-promise-pool to limit the concurrency of promises.
const PromisePool = require("es6-promise-pool").default;

// Max concurrent account deletions to prevent overwhelming Firebase Auth API.
const MAX_CONCURRENT = 3;

// Ensure Firebase Admin SDK is initialized if it's not done in index.js globally.
if (!admin.apps.length) {
  admin.initializeApp();
}

// --- Scheduled User Account Cleanup ---
// This function runs once a day at midnight.
// It fetches inactive users and deletes them in batches.
exports.accountcleanup = onSchedule(
  {
    // Define the schedule using cron syntax. This runs at midnight every day.
    // Learn more about cron syntax: https://crontab.guru/
    schedule: "0 0 * * *",
    // Options passed directly to the function definition.
    // Region set globally in index.js via setGlobalOptions, but can be overridden here.
    region: "europe-west1", // Explicitly setting region for clarity
    memory: "256MiB", // Adjust memory as needed for user fetching/deletion
    timeoutSeconds: 540, // 9 minutes - enough time for fetching and batch deletion
    maxInstances: 1, // Ensure only one instance runs at a time for cleanup tasks
  },
  async () => {
    // Scheduled functions receive an event object, but often it's not used directly.
    logger.info("Starting user account cleanup based on schedule.");

    try {
      // Fetch all inactive user details.
      const inactiveUsers = await getInactiveUsers();
      logger.info(
        `Found ${inactiveUsers.length} inactive users to consider for deletion.`,
      );

      if (inactiveUsers.length === 0) {
        logger.info("No inactive users found. Cleanup finished.");
        return; // Nothing to do
      }

      // Use a promise pool so that we delete a maximum of `MAX_CONCURRENT` users in parallel.
      const promisePool = new PromisePool(
        () => deleteInactiveUser(inactiveUsers), // Pass the array to the generator
        MAX_CONCURRENT,
      );
      await promisePool.start(); // Start the deletion process

      logger.info("User cleanup finished successfully.");
    } catch (error) {
      logger.error("Error during user cleanup process:", error);
      // For background/scheduled functions, just log the error; no HTTP response.
    }
  },
);

/**
 * Deletes one inactive user from the list. This function is designed to be
 * called repeatedly by PromisePool.
 * @param {admin.auth.UserRecord[]} inactiveUsers - The array of inactive users to process.
 * @return {null | Promise<void>} Returns a Promise that resolves when a user is deleted, or null if no users left.
 */
function deleteInactiveUser(inactiveUsers) {
  if (inactiveUsers.length > 0) {
    const userToDelete = inactiveUsers.pop(); // Remove one user from the end of the array

    // Delete the inactive user.
    // IMPORTANT: Uncomment admin.auth().deleteUser(userToDelete.uid) when ready for actual deletion.
    return admin
      .auth()
      .deleteUser(userToDelete.uid) // This line performs the actual deletion
      .then(() => {
        logger.log(
          "Deleted user account:",
          userToDelete.uid,
          "because of inactivity.",
        );
      })
      .catch((error) => {
        // Log errors but don't re-throw to allow other deletions to proceed.
        logger.error(
          "Deletion of inactive user account",
          userToDelete.uid,
          "failed:",
          error,
        );
      });
  } else {
    return null; // Signal to PromisePool that no more tasks are available
  }
}

/**
 * Recursively fetches all inactive users.
 * An inactive user is defined as someone who hasn't signed in or refreshed their token in the last 30 days.
 * @param {admin.auth.UserRecord[]} [users=[]] - The current list of inactive users found so far.
 * @param {string} [nextPageToken] - Token for fetching the next page of users.
 * @return {Promise<admin.auth.UserRecord[]>} A promise that resolves to the list of all inactive users.
 */
async function getInactiveUsers(users = [], nextPageToken) {
  const result = await admin.auth().listUsers(1000, nextPageToken); // Fetch up to 1000 users at a time

  // Calculate the timestamp for 30 days ago
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  // Filter users that have not signed in or refreshed their token in the last 30 days.
  const inactiveUsers = result.users.filter(
    (user) =>
      // Check lastRefreshTime first, then lastSignInTime if refresh time isn't available
      (user.metadata.lastRefreshTime || user.metadata.lastSignInTime) <
      thirtyDaysAgo,
  );

  // Add to the list of previously found inactive users.
  users = users.concat(inactiveUsers);

  // If there are more users to fetch, recursively call this function.
  if (result.pageToken) {
    logger.info(`Fetching next page of users... Found ${users.length} so far.`);
    return getInactiveUsers(users, result.pageToken);
  }

  return users;
}
