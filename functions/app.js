// functions/app.js

const express = require("express");
const cors = require("cors");
const allowedOrigins = require("./config/allowedOrigins.js");

// --- Routes Imports ---
const dataRoutes = require("./api/dataRoutes");
const visionRoutes = require("./api/visionRoutes");
const orchestratorApp = require("./api/agentRoutes.js");
const aiRoutes = require("./api/aiRoutes"); // <-- IMPORT THE NEW ROUTER
const blueprintRoutes = require("./api/blueprintRoutes.js"); // <-- CORRECTED FILENAME

const app = express();

// --- Global Middleware ---
// 1. CORS for allowed origins
app.use(cors({ origin: allowedOrigins, credentials: true }));
// 2. JSON Body Parser
app.use(express.json());

// --- API Routes ---
app.use("/ai", aiRoutes);
app.use("/agent", orchestratorApp);
app.use("/data", dataRoutes);
app.use("/sdui", blueprintRoutes);
app.use("/vision", visionRoutes);

// Example Routes
app.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello from the unified Express app!" });
});

module.exports = app;
