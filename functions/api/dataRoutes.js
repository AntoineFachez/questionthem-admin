// functions/api/dataRoutes.js
const express = require("express");
const {
  getPaginatedDocs,
  getDocFromCollection,
  echo,
  // getAllDocs,
} = require("../controllers/dataController");

const router = express.Router();

//* Define the API endpoints
router.get("/persons", getPaginatedDocs("persons", "createdAt"));
router.get("/:collection/:docId", getDocFromCollection);
router.post("/echo", echo);
// router.get("/persons", getAllDocs("persons"));

module.exports = router;
