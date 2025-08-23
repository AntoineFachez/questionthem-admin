// functions/controllers/blueprintController.js

const admin = require("firebase-admin");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

const { logger } = require("firebase-functions");
/**
 * Fetches a static UI blueprint and injects dynamic data into it.
 * In this case, it gets a base layout and injects database statistics cards.
 */
exports.getDynamicStatsWidget = async (req, res) => {
  // The ID of the base template for this widget.
  const templateId = "stats-dashboard-template";

  try {
    // 1. Fetch the UI Blueprint TEMPLATE from Firestore.
    // This template contains all the static parts: metadata, root layout, header, etc.
    const templateDoc = await admin
      .firestore()
      .collection("readBlueprints")
      .doc(templateId)
      .get();

    if (!templateDoc.exists) {
      return sendError(
        res,
        `Blueprint template '${templateId}' not found.`,
        404,
      );
    }
    const uiBlueprint = templateDoc.data();

    // 2. Fetch the DYNAMIC raw data document.
    const statsDoc = await admin
      .firestore()
      .collection("system")
      .doc("dashboard-stats")
      .get();
    const rawData = statsDoc.data().dataBaseStats;

    // 3. Transform the raw data into an array of UI component definitions.
    const dynamicStatCards = Object.keys(rawData).map((collectionName) => {
      const stats = rawData[collectionName];
      return {
        type: "StatisticCard",
        props: {
          title: `${
            collectionName.charAt(0).toUpperCase() + collectionName.slice(1)
          }`,
          statistic: stats.docCount.toLocaleString(),
          description: `Avg. Size: ${stats.avgDocSizeBytes} Bytes`,
          lastUpdated: `Updated: ${new Date(
            stats.lastUpdated,
          ).toLocaleTimeString("de-DE")}`,
          icon: collectionName === "users" ? "PersonIcon" : "ArticleIcon",
        },
      };
    });

    // 4. Inject the dynamic components into the correct slot of the template.
    // We'll place a Grid inside the 'main' slot to hold our cards.
    uiBlueprint.root.slots.main = {
      type: "Grid",
      props: {
        spacing: 2,
        columns: 2,
      },
      children: dynamicStatCards, // The dynamically generated cards go here
    };

    // 5. Send the final, merged blueprint to the client.
    sendSuccess(res, uiBlueprint);
  } catch (error) {
    logger.error(`Error building dynamic widget for '${templateId}':`, error);
    sendError(res, "Internal Server Error", 500);
  }
};
