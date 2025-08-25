import { useState } from "react";
import { Box, Card, CardActionArea } from "@mui/material";

import { darkTheme } from "../../theme/theme";

// The card is now a "dumb" component with no internal state.
export default function DynamicCard({
  index,
  children,
  sx,
  data,
  onClick,
  parentProps,
}) {
  console.log("parentProps", parentProps);

  // const [randomDeg] = useState(() => Math.random() * 360 * (index + 1));
  // const gradient = darkTheme.palette.randomeRainbow;
  const baseStyles = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    cursor: onClick ? "pointer" : "default",
  };
  const combinedStyles = { ...baseStyles, ...sx };

  return (
    <Box
      sx={{
        // background: `linear-gradient(${randomDeg}deg, ${gradient})`,
        backgroundSize: "200% 200%",
        animation: "gradient-animation 8s ease infinite",
        borderRadius: "8px",
        padding: "1px",
      }}
    >
      <Card
        sx={{
          ...combinedStyles,
          maxWidth: "20rem",
        }}
        onClick={onClick}
      >
        {children}
      </Card>{" "}
      {/* </Box> */}
      {/* CSS for the animation */}
      <style>
        {`
        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        `}
      </style>
    </Box>
  );
}
