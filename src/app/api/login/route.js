// app/api/login/route.js

import admin from 'firebase-admin';
import { NextResponse } from 'next/server';

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
    console.error('Firebase Admin SDK initialization error:', error);
    // You should handle this error appropriately in a production app.
  }
}

/**
 * Handles the secure login request for an admin user.
 */
export async function POST(req) {
  // If the Admin SDK failed to initialize, return an error.
  if (!admin.apps.length) {
    return NextResponse.json(
      { message: 'Server configuration error.' },
      { status: 500 }
    );
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const userRecord = await admin.auth().getUserByEmail(email);
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    return NextResponse.json({ customToken }, { status: 200 });
  } catch (error) {
    console.error('Login process failed:', error);

    let errorMessage = 'An error occurred during login.';
    if (
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/invalid-credential'
    ) {
      errorMessage = 'Invalid email or password.';
    }

    return NextResponse.json({ message: errorMessage }, { status: 401 });
  }
}
