import { Card } from "@mui/material";

// A generic Card "shell" that can render any content.
export default function DynamicCard({ children, style }) {
  const baseStyles = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    margin: "8px",
    minWidth: "200px",
  };

  // Combine the component's base styles with styles sent from the server.
  const combinedStyles = { ...baseStyles, ...style };

  return (
    <>
      <Card style={combinedStyles}>{children}</Card>
    </>
  );
}
