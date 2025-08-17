// src/app/api/listcollections/route.js
import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase-admin"; // Your server-side Admin SDK instance

export async function GET() {
  try {
    // List all root-level collections in the database
    const collections = await db.listCollections();
    const collectionNames = collections.map((col) => col.id);

    return NextResponse.json({ collections: collectionNames }, { status: 200 });
  } catch (error) {
    console.error("Error listing collections:", error);
    return NextResponse.json(
      { error: "Failed to list collections" },
      { status: 500 }
    );
  }
}
