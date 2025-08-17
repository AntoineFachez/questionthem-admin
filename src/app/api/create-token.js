// src/app/api/create-token.js
import admin from "firebase-admin";

// Initialize the Firebase Admin SDK only once
if (!admin.apps.length) {
  const serviceAccountKey = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Expect a user ID in the request body
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Use the Admin SDK to create a custom token
    const customToken = await admin.auth().createCustomToken(userId);
    res.status(200).json({ customToken });
  } catch (error) {
    console.error("Error creating custom token:", error);
    res.status(500).json({ message: "Failed to create custom token" });
  }
}
