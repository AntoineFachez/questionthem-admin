import React from "react";

// The 'params' object contains the dynamic route parameters.
export default function PersonPage({ params }) {
  // Access the productId from the params object.
  const { personId } = params;

  return (
    <div>
      <h1>Persons Details</h1>
      <p>This is the page for person ID: {personId}</p>
    </div>
  );
}
