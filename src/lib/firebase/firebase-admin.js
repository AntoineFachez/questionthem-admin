// src/lib/firebase-admin.js

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// The service account key is a JSON object that contains your credentials.
// It is critical to store this securely. The best practice is to
// store it in an environment variable or a secrets manager.
// For development, you can use a .env file.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// This ensures the app is only initialized once, preventing errors
// in a hot-reloading or serverless environment. This is a singleton pattern.
const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];

// Get the Firestore instance. You can add other services here.
const db = getFirestore(app);

// Export the initialized services for use in server-side code.
export { db };
