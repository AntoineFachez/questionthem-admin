// app/api/login/route.js

import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize the Firebase Admin SDK only once, and only if the environment variable exists.
// The check `process.env.FIREBASE_SERVICE_ACCOUNT_KEY` prevents the build from crashing.
if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccountKey = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
    });
  } catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
    // You should handle this error appropriately in a production app.
  }
}

/**
 * Handles the secure login request for an admin user.
 */
export async function POST(req) {
  if (!admin.apps.length) {
    return NextResponse.json(
      { message: "Server configuration error." },
      { status: 500 }
    );
  }

  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { message: "ID token is required." },
        { status: 400 }
      );
    }

    // Verify the ID token. This is the crucial security step.
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // OPTIONAL BUT RECOMMENDED: Check for admin custom claim
    // You would set this claim on the user via the Admin SDK at another time.
    if (decodedToken.isAdmin !== true) {
      return NextResponse.json(
        { message: "User is not an admin." },
        { status: 403 }
      ); // 403 Forbidden
    }

    // At this point, the user is authenticated and authorized as an admin.
    // You no longer need to create and send a custom token.
    return NextResponse.json(
      { status: "success", message: "Admin authenticated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login authorization failed:", error);
    // The token might be expired, invalid, etc.
    return NextResponse.json(
      { message: "Authorization failed." },
      { status: 401 }
    );
  }
}
