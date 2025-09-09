// set-admin-claim.js

// This line allows us to use environment variables from a .env.local file
require("dotenv").config({ path: "./.env.local" });

const admin = require("firebase-admin");

// The email of the user you want to make an admin
const emailToMakeAdmin = "anthony.zornig@gmx.de";

// --- Do not edit below this line ---

// Check if the service account key is available
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error(
    "The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set."
  );
}

// Initialize the Firebase Admin SDK
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
  process.exit(1);
}

/**
 * Sets the isAdmin=true custom claim for a user by their email.
 * @param {string} email The email of the user to make an admin.
 */
async function setAdminClaim(email) {
  try {
    // 1. Look up the user by their email address
    console.log(`Looking up user for email: ${email}...`);
    const user = await admin.auth().getUserByEmail(email);

    // 2. Set the custom claim
    console.log(`Setting admin claim for user UID: ${user.uid}...`);
    await admin.auth().setCustomUserClaims(user.uid, { isAdmin: true });

    console.log(
      `\n✅ Success! Custom claim { isAdmin: true } has been set for ${email}.`
    );
    console.log("They will have admin access on their next login.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error setting custom claim:", error.message);
    process.exit(1);
  }
}

// Run the function
setAdminClaim(emailToMakeAdmin);
