// src/api/datamanagement/route.js
import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase/firebase-admin";

/**
 * A utility function to delete all documents in a Firestore collection.
 * This function should be placed in a separate server-side library file.
 */
const deleteCollection = async (collectionRef) => {
  const snapshot = await collectionRef.get();
  if (snapshot.size === 0) {
    return;
  }
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};
export async function POST(request) {
  try {
    const { action, collection, id, data } = await request.json();

    let result;
    switch (action) {
      case "create":
        // Logic for creating a document
        result = await createFirestoreDocument(collection, data);
        break;
      case "update":
        // Logic for updating a document
        result = await updateFirestoreDocument(collection, id, data);
        break;
      case "delete":
        // Logic for deleting a single document
        result = await deleteFirestoreDocument(collection, id);
        break;
      case "deleteCollection":
        // New case to handle deleting an entire collection
        if (!collection) {
          return NextResponse.json(
            { error: "Collection name is required" },
            { status: 400 }
          );
        }
        await deleteCollection(db.collection(collection));
        result = { message: `Collection ${collection} deleted successfully` };
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// NOTE: The following functions are placeholders.
// They should be defined and imported from a server-side file like "@/lib/firestore".
async function createFirestoreDocument(collectionName, data) {
  // Your create logic here
  return { id: "new-id", ...data };
}
async function updateFirestoreDocument(collectionName, id, data) {
  // Your update logic here
  return { id, ...data };
}
async function deleteFirestoreDocument(collectionName, id) {
  // Your delete logic here
  return { message: "Document deleted" };
}
