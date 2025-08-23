// filename: pages/dashboard.js

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

import { rawData, viewModel } from "./mockData.json";
import fetchedBlueprint from "./blueprint.json";
import { transformStatsToBlueprint } from "./transformers/dashboard-transformer";
import { renderScreen } from "./mappers/renderer";
import Renderer from "../../core/Renderer";
import ScreenLayout from "../ScreenLayout";

export default function DashboardPage({ context }) {
  const [blueprint, setBlueprint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true); // Set loading to true at the start

    // --- Start of Simulation ---
    // We create a new Promise to mimic the async behavior of fetch()
    const simulatedFetch = new Promise((resolve, reject) => {
      // Use setTimeout to simulate a 1-second network delay
      setTimeout(() => {
        // Check if rawData exists, then resolve the promise with it.
        // This is like a successful API call.
        if (rawData) {
          // We don't need a `.json()` step because we already have the object
          resolve(rawData);
        } else {
          // If something went wrong, we reject the promise.
          reject("Failed to load mock data.");
        }
      }, 1000); // 1000ms = 1 second delay
    });
    // --- End of Simulation ---

    simulatedFetch
      .then((data) => {
        // This part remains the same!
        const uiBlueprint = transformStatsToBlueprint(data);
        setBlueprint(uiBlueprint);
      })
      .catch((err) => {
        setError("Failed to load dashboard layout.");
      })
      .finally(() => {
        // This will run after the promise succeeds or fails
        setIsLoading(false);
      });

    // The dependency array is now empty because `rawData` is a stable import
    // and doesn't change, so the effect only needs to run once.
  }, [rawData]);

  if (isLoading) return <Box>Loading dashboard...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  // Here's the magic: render the fetched blueprint!
  return <Renderer blueprint={blueprint} />;
}
