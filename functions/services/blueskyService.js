// This is a standalone Node.js script, not a Next.js API route.
// Run it with: node bluesky-listener.js

import { FirehoseSubscription } from "@atproto/xrpc-stream";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// --- Firebase Admin Setup ---
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// This will hold the set of Bluesky DIDs we are currently watching
let watchedDids = new Set();

/**
 * Fetches all DIDs from all users' watchlists and updates our in-memory set.
 */
async function syncWatchedDids() {
  console.log("Syncing watched DIDs from Firestore...");
  const newWatchedDids = new Set();
  const usersSnapshot = await db.collection("users").get();
  for (const userDoc of usersSnapshot.docs) {
    const watchedAccountsSnapshot = await userDoc.ref
      .collection("watchedAccounts")
      .get();
    watchedAccountsSnapshot.forEach((doc) =>
      newWatchedDids.add(doc.data().did),
    );
  }
  watchedDids = newWatchedDids;
  console.log(`Now watching ${watchedDids.size} accounts.`);
}

/**
 * Connects to the Bluesky Firehose and filters for posts from watched accounts.
 */
function connectToFirehose() {
  const firehose = new FirehoseSubscription({
    service: "wss://bsky.social",
  });

  firehose.on("message", (msg) => {
    // We are only interested in commit messages that contain new records
    if (!FirehoseSubscription.isCommit(msg) || !msg.blocks || !msg.ops) {
      return;
    }

    for (const op of msg.ops) {
      // Check if the operation is a new post from a DID we are watching
      const isWatchedPost =
        op.action === "create" &&
        op.path.startsWith("app.bsky.feed.post/") &&
        watchedDids.has(msg.repo); // msg.repo is the DID of the user who made the commit

      if (isWatchedPost) {
        // A user we are watching has made a new post.
        // Let's get the post data.
        const recordCid = op.cid;
        const postBuffer = msg.blocks.get(recordCid);
        if (!postBuffer) continue;

        const postRecord = JSON.parse(new TextDecoder().decode(postBuffer));
        console.log(`New post from ${msg.repo}: ${postRecord.text}`);

        // Now, find all our app users who are watching this DID
        // and write the new post to their personal "real-time" feed.
        writePostToWatcherFeeds(msg.repo, {
          uri: `at://${msg.repo}/${op.path}`,
          cid: recordCid.toString(),
          authorDid: msg.repo,
          record: postRecord,
          indexedAt: new Date().toISOString(),
        });
      }
    }
  });

  console.log("Connected to Bluesky Firehose.");
  return firehose;
}

/**
 * Finds all users watching a specific DID and writes the new post to a subcollection.
 * @param {string} authorDid - The DID of the post author.
 * @param {object} post - The new post object.
 */
async function writePostToWatcherFeeds(authorDid, post) {
  const watchersQuery = db
    .collectionGroup("watchedAccounts")
    .where("did", "==", authorDid);
  const watchersSnapshot = await watchersQuery.get();

  if (watchersSnapshot.empty) return;

  const batch = db.batch();
  watchersSnapshot.forEach((doc) => {
    const userRef = doc.ref.parent.parent; // Gets the user document reference
    const userRealtimeFeedRef = userRef
      .collection("realtimeFeed")
      .doc(post.uri);
    batch.set(userRealtimeFeedRef, post);
  });

  await batch.commit();
  console.log(`Wrote new post to ${watchersSnapshot.size} user feed(s).`);
}

// --- Main Execution ---
async function main() {
  await syncWatchedDids(); // Initial sync
  connectToFirehose();
  // Periodically re-sync the DIDs in case users update their watchlists
  setInterval(syncWatchedDids, 60 * 1000); // Sync every 60 seconds
}

main();
