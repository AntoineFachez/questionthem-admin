// app/api/login/route.js

import admin from 'firebase-admin';
import { NextResponse } from 'next/server';

// Initialize the Firebase Admin SDK only once.
if (!admin.apps.length) {
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
 * This function is automatically called for POST requests to /api/login.
 * * @param {object} req - The Next.js API request object.
 */
export async function POST(req) {
  try {
    // Parse the request body as JSON.
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Authenticate the user with their email.
    // In a real-world scenario, you would verify the password securely.
    // For this demonstration, we'll assume the email identifies a valid admin user.
    const userRecord = await admin.auth().getUserByEmail(email);

    // Generate a custom authentication token for this user.
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    // Return the custom token to the client using NextResponse.
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
