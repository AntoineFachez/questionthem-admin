const { PubSub } = require("@google-cloud/pubsub");
const { subscribeRepos } = require("atproto-firehose");
const { ComAtprotoSyncSubscribeRepos } = require("@atproto/api");
const { decodeMultiple } = require("cbor-x");
const { onSchedule } = require("firebase-functions/v2/scheduler");

const pubsub = new PubSub();
const topicName = "bluesky-posts";
const subscriptionName = "bluesky-post-processor";
let firehoseSubscription = null;

// --- ADDED: A foolproof way to check if the new code is deployed ---
const DEPLOYMENT_VERSION = "v1.4-correct-type-check";
// ------------------------------------------------------------------

const createFirehoseSubscription = () => {
  if (firehoseSubscription) {
    return;
  }
  console.log("Attempting to connect to Bluesky Firehose...");
  const sub = subscribeRepos("wss://bsky.network", {
    decodeRepoOps: true,
  });
  const rawSocket = sub.ws;
  rawSocket.removeAllListeners("message");
  rawSocket.on("message", async (data) => {
    try {
      const messages = decodeMultiple(data);
      for (const msg of messages) {
        // --- FINAL LOGIC ---
        // The first message is a header. We ignore it but check its type.
        if (msg.t === "#commit") {
          // The next message in the stream will be the body for this commit.
          // We do nothing here and wait for the body.
        }
        // The second message has no 't' but has 'ops'. This is the body.
        else if (msg.ops) {
          for (const op of msg.ops) {
            if (
              op.action === "create" &&
              op.path.includes("app.bsky.feed.post")
            ) {
              // --- THIS IS THE FIX ---
              // Explicitly convert the CID to a string before creating the post object.
              const cidString = op.cid.toString();
              const post = { cid: cidString, uri: op.uri };

              // Also, let's improve the log to show the real CID.
              console.log(`✅ Found new post to publish: CID=${cidString}`);
              // --- END OF FIX ---

              const eventData = {
                type: "new_posts",
                payload: { did: msg.repo, posts: [post] },
              };
              await pubsub.topic(topicName).publishMessage({ json: eventData });
              console.log("🚀 Message published to Pub-Sub.");
            }
          }
        } else if (msg.t === "#handle") {
          console.log(`ℹ️ Ignoring message type: Handle - ${msg.handle}`);
        } else if (msg.t === "#info") {
          console.log(`ℹ️ Ignoring message type: Info - ${msg.name}`);
        } else if (msg.t === "#tombstone") {
          console.log(`ℹ️ Ignoring message type: Tombstone - ${msg.did}`);
        } else {
          console.warn("⚠️ Ignoring unknown message:", msg);
        }
      }
    } catch (error) {
      console.error("❌ Failed to decode or process firehose message:", error);
    }
  });

  sub.on("open", () =>
    console.log("✅ Successfully connected to Bluesky Firehose"),
  );
  sub.on("error", (err) =>
    console.error("❌ Firehose subscription error event:", err),
  );
  sub.on("close", (code, reason) => {
    const reasonString = reason ? reason.toString() : "No reason given";
    console.warn(
      `⚠️ Firehose connection closed. Code: ${code}, Reason: ${reasonString}. Reconnecting...`,
    );
    firehoseSubscription = null;
    setTimeout(createFirehoseSubscription, 5000);
  });

  firehoseSubscription = sub;
};

const firehosePublisher = onSchedule(
  {
    schedule: "every 1 minutes",
    timeoutSeconds: 540,
    memory: "1GiB",
  },
  async (context) => {
    // --- ADDED: Log the deployment version when the function runs ---
    console.log(`Function starting. Deployment version: ${DEPLOYMENT_VERSION}`);
    // -------------------------------------------------------------

    console.log("Checking for active subscribers...");
    try {
      const [subscriptions] = await pubsub.topic(topicName).getSubscriptions();
      const hasActiveClient = subscriptions.some((sub) =>
        sub.name.endsWith(subscriptionName),
      );

      if (hasActiveClient) {
        console.log(
          "✅ Active client detected. Starting/maintaining firehose subscription.",
        );
        createFirehoseSubscription();
      } else {
        console.log(
          "⚠️ No active clients found. Shutting down firehose subscription.",
        );
        if (firehoseSubscription) {
          firehoseSubscription.ws.close(1000, "No active subscribers");
          firehoseSubscription = null;
          console.log("🛑 Firehose subscription gracefully shut down.");
        }
      }
    } catch (error) {
      console.error("❌ Failed to check subscriptions:", error);
    }
    return null;
  },
);

module.exports = firehosePublisher;
