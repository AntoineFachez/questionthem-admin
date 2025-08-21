// functions/api/blueprintRoutes.js

const express = require("express");
const { getDocFromCollection } = require("../controllers/dataController");

const router = express.Router();

// When a request comes to GET /ui/:docId, it will use the handler
// created by getDocFromCollection, pre-configured to look in the 'uiBlueprints' collection.
router.get("/widgets/:docId", getDocFromCollection("widgetBlueprints"));

// Similarly, this route is locked to the 'formBlueprints' collection.
router.get("/form/:docId", getDocFromCollection("formBlueprints"));

module.exports = router;
