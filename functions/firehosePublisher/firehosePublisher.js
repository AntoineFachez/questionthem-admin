const { PubSub } = require("@google-cloud/pubsub");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { BskyAgent } = require("@atproto/api");

const pubsub = new PubSub();
const topic = pubsub.topic("bluesky-posts");
const agent = new BskyAgent({ service: "https://bsky.social" });

/**
 * Google Cloud Function triggered on a schedule to manage the firehose connection.
 */
const firehosePublisher = onSchedule(
  {
    schedule: "every 1 minutes",
    timeoutSeconds: 540,
    memory: "1GiB",
  },
  async (context) => {
    console.log("Firehose poller triggered.");
    try {
      // 1. Log in using credentials stored as environment variables.
      await agent.login({
        identifier: process.env.BLUESKY_HANDLE,
        password: process.env.BLUESKY_APP_PASSWORD,
      });
      console.log("Successfully logged in as the poller service.");

      // 2. Use searchPosts to get the latest public posts.
      const response = await agent.api.app.bsky.feed.searchPosts({
        q: "the", // Use a common word to get a broad set of recent posts
        sort: "latest",
        limit: 50,
      });

      const { posts } = response.data;

      if (!posts || posts.length === 0) {
        console.log("No new posts found in this poll.");
        return;
      }

      // Create and execute all publish promises concurrently.
      const publishPromises = posts.map((post) => {
        const messageString = JSON.stringify(post);
        return topic.publishMessage({ data: Buffer.from(messageString) });
      });

      await Promise.all(publishPromises);
      console.log(
        `✅ Successfully published ${posts.length} posts to the topic.`,
      );
    } catch (error) {
      console.error("❗️ An error occurred while polling the firehose:", error);
    }
  },
);
module.exports.firehosePublisher = firehosePublisher;
