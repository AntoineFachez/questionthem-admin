import { NextResponse } from "next/server";

export async function POST(request) {
  let body;
  try {
    // This is the line that is likely causing the crash.
    // By wrapping it, we prevent the build from failing.
    body = await request.json();
  } catch (error) {
    // If there's no body or it's not valid JSON, send a clear error.
    return NextResponse.json(
      { error: "Invalid or missing request body" },
      { status: 400 }
    );
  }

  // Your existing logic can now safely use the 'body' variable.
  // For example:
  // const { name, email } = body;
  // ... do something with the data ...

  return NextResponse.json({ message: "Success", data: body });
}

// If you have a GET handler or others, they can remain as they are.
export async function GET(request) {
  return NextResponse.json({ message: "This is the datamanagement endpoint." });
}
