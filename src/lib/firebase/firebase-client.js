// src/lib/firebase-client.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getGenerativeModel, getVertexAI } from "firebase/vertexai";

// Your Firebase project's configuration object.
// This is not a secret and is safe to expose in client-side code.
import { firebaseConfig } from "../../app/firebase/config";

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// Initialize all the Firebase services you need for the frontend
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app, "europe-west1");
const vertexAI = getVertexAI(app);

// Get the generative model for AI features (used on the client)
const model = getGenerativeModel(vertexAI, {
  model: "gemini-2.5-pro",
});

// Export all the initialized services for use in client components
export { app, db, auth, storage, functions, model };
