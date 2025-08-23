// functions/api/blueprintRoutes.js

const express = require("express");
const { getDocFromCollection } = require("../controllers/dataController");

const router = express.Router();

// When a request comes to GET /ui/:docId, it will use the handler
// created by getDocFromCollection, pre-configured to look in the 'readBlueprints' collection.
router.get("/ui/:docId", getDocFromCollection("uiBlueprints"));
router.get("/read/:docId", getDocFromCollection("readBlueprints"));

// Similarly, this route is locked to the 'writeBlueprints' collection.
router.get("/write/:docId", getDocFromCollection("writeBlueprints"));

module.exports = router;
