// functions/app.js

const express = require("express");
// const admin = require("firebase-admin"); // Admin SDK is now initialized in index.js
const cors = require("cors");
const allowedOrigins = require("./cors/allowedOrigins");

const app = express();

// The initialization block has been removed to prevent the error.

// --- CORS Middleware Configuration ---
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    preflightContinue: true,
  }),
);

// --- JSON Body Parser ---
app.use(express.json());

// --- Define your Express routes here ---
app.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello from Express app!" });
});

app.post("/submit", (req, res) => {
  const data = req.body;
  res
    .status(200)
    .json({ received: data, message: "Data received by Express app!" });
});

module.exports = app;
