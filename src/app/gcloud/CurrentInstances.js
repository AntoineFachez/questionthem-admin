"use client";

import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Alert,
  Stack,
} from "@mui/material";

export default function CurrentInstances({ instances, isLoading, error }) {
  // Show a single loading spinner for the initial fetch
  if (isLoading) {
    return (
      <Box
        sx={{
          p: 2,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          maxWidth: 500,
          textAlign: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show an error message if the fetch fails
  if (error) {
    return (
      <Box sx={{ maxWidth: 500 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Map over the instances array to display each service
  return (
    <Box
      sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2, maxWidth: 500 }}
    >
      <Typography variant="h6" gutterBottom>
        Service Status
      </Typography>
      <Stack spacing={2}>
        {instances.map(({ serviceName, instanceCount }) => (
          <Box
            key={serviceName}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1">
              Instances for: <strong>{serviceName}</strong>
            </Typography>
            <Chip
              label={instanceCount}
              color={instanceCount > 0 ? "success" : "default"}
              size="small"
              sx={{ fontWeight: "bold", fontSize: "1rem", px: 1 }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
