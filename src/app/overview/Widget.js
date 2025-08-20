// Refactored Widget.js
// filename: app/overview/Widget.js

"use client"; // This component needs to be a Client Component to fetch data

import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { renderComponent } from "../../components/Renderer"; // Adjust path

export default function Widget({}) {
  const [uiBlueprint, setUiBlueprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the UI blueprint from your Cloud Function endpoint
    async function fetchUiBlueprint() {
      try {
        const response = await fetch(
          "https://getoverviewwidget-kllcl4ciaa-ew.a.run.app"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch UI blueprint");
        }
        const data = await response.json();
        setUiBlueprint(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUiBlueprint();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  return renderComponent(uiBlueprint);
}
