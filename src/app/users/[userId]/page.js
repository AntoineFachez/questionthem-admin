import React from "react";

// The 'params' object contains the dynamic route parameters.
export default function UserPage({ params }) {
  // Access the productId from the params object.
  const { userId } = params;

  return (
    <div>
      <h1>User Details</h1>
      <p>This is the page for user ID: {userId}</p>
    </div>
  );
}
