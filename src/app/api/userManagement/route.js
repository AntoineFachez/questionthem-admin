import { NextResponse } from "next/server";

// You must have at least one of these exported functions.
// This is a GET request handler.
export async function GET(request) {
  // Your logic to get users would go here.
  const users = [{ id: 1, name: "Jane Doe" }];

  return NextResponse.json({ users });
}

// This is a POST request handler.
export async function POST(request) {
  // Your logic to create a user would go here.
  const newUser = await request.json();

  return NextResponse.json(
    { message: "User created", user: newUser },
    { status: 201 }
  );
}
