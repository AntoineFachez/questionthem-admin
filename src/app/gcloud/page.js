"use client";

import { useState, useEffect } from "react";
import CloudRunScaler from "./CloudRunScaler";
import CurrentInstances from "./CurrentInstances";
import { Box, Typography, Stack } from "@mui/material";

export default function AdminPage() {
  const [instances, setInstances] = useState([
    { serviceName: "sse-server", instanceCount: 0 },
    { serviceName: "bluesky-websocket-consumer", instanceCount: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect now handles fetching data for ALL services
  useEffect(() => {
    const fetchAllInstances = async () => {
      // Don't show the main loading spinner on subsequent polls
      if (!isLoading) {
        // This is a background refresh, no need to set loading true
      }
      setError(null);

      try {
        // Use Promise.all to fetch all instance counts concurrently
        const promises = instances.map((inst) =>
          fetch(
            `/api/gcloud/get-instance-count?service=${inst.serviceName}`
          ).then((res) => {
            if (!res.ok) {
              // Throw an error to be caught by the catch block
              throw new Error(`Failed to fetch status for ${inst.serviceName}`);
            }
            return res.json();
          })
        );

        const results = await Promise.all(promises);

        // Correctly update the state array
        setInstances((prevInstances) =>
          prevInstances.map((inst) => {
            const result = results.find(
              (r) => r.serviceName === inst.serviceName
            );
            // Return a new object with the updated count, or the original if not found
            return result
              ? { ...inst, instanceCount: result.currentInstanceCount }
              : inst;
          })
        );
      } catch (err) {
        setError("Failed to fetch one or more instance counts.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllInstances(); // Fetch immediately when the component mounts
    const intervalId = setInterval(fetchAllInstances, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []); // Empty array ensures this effect runs only once to set up the polling

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Control Panel
      </Typography>

      <Stack spacing={4}>
        <CurrentInstances
          instances={instances}
          isLoading={isLoading}
          error={error}
        />
        <CloudRunScaler serviceName="sse-server" />
        <CloudRunScaler serviceName="bluesky-websocket-consumer" />
      </Stack>
    </Box>
  );
}
