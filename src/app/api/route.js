// src/app/api/route.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import {
  createFirestoreDocument,
  updateFirestoreDocument,
  deleteFirestoreDocument,
  deleteCollection,
  listCollections,
} from "../../lib/firebase/firestore";

// Function to initialize the Firebase Admin SDK, ensuring it only runs once.
const initializeAdmin = () => {
  if (!admin.apps.length) {
    try {
      const serviceAccountKey = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
      });
    } catch (e) {
      console.error("Firebase Admin SDK Initialization failed:", e);
      // Re-throw the error so it can be caught by the main handler.
      throw new Error("Failed to initialize Firebase Admin SDK.");
    }
  }
};

export async function POST(request) {
  try {
    initializeAdmin();
    const { feature, action, collection, id, data } = await request.json();

    let result;
    switch (feature) {
      case "datamanagement":
        switch (action) {
          case "create":
            result = await createFirestoreDocument(collection, data);
            break;
          case "update":
            result = await updateFirestoreDocument(collection, id, data);
            break;
          case "delete":
            result = await deleteFirestoreDocument(collection, id);
            break;
          case "deleteCollection":
            if (!collection) {
              return NextResponse.json(
                { error: "Collection name is required" },
                { status: 400 }
              );
            }
            await deleteCollection(collection); // Pass the collection name directly
            result = {
              message: `Collection ${collection} deleted successfully`,
            };
            break;
          default:
            return NextResponse.json(
              { error: "Invalid datamanagement action" },
              { status: 400 }
            );
        }
        break;

      case "usermanagement":
        // This is a placeholder; you'd handle user management logic here.
        if (action === "createToken" && id) {
          const customToken = await admin.auth().createCustomToken(id);
          result = { customToken };
        } else {
          return NextResponse.json(
            { error: "Invalid userManagement action" },
            { status: 400 }
          );
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid feature" }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Global API Error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    initializeAdmin();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
      case "listCollections":
        const collections = await listCollections();
        return NextResponse.json({ collections }, { status: 200 });
      default:
        return NextResponse.json(
          { error: "Invalid GET action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Global API Error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
