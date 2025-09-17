// components/CloudRunScaler.js
"use client";

import React, { useState } from "react";
import { useUser } from "../../context/UserContext"; // Your user context hook
import {
  Box,
  Slider,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function CloudRunScaler({ serviceName }) {
  const { user } = useUser();
  const [minInstances, setMinInstances] = useState(0);
  const [maxInstances, setMaxInstances] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ message: "", severity: "info" });

  // Handle slider changes, ensuring min is never greater than max
  const handleMinChange = (event, newValue) => {
    setMinInstances(newValue);
    if (newValue > maxInstances) {
      setMaxInstances(newValue);
    }
  };

  const handleMaxChange = (event, newValue) => {
    setMaxInstances(newValue);
    if (newValue < minInstances) {
      setMinInstances(newValue);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setStatus({ message: "You must be logged in.", severity: "error" });
      return;
    }

    setIsLoading(true);
    setStatus({ message: "", severity: "info" });

    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/gcloud/manage-scaling-instances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          serviceName,
          minInstances,
          maxInstances,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update service.");
      }

      setStatus({ message: data.message, severity: "success" });
    } catch (error) {
      setStatus({ message: error.message, severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{ p: 3, border: "1px solid #ccc", borderRadius: 2, maxWidth: 500 }}
    >
      <Typography variant="h6" gutterBottom>
        Scale: {serviceName}
      </Typography>

      <Typography gutterBottom>Minimum Instances: {minInstances}</Typography>
      <Slider
        value={minInstances}
        onChange={handleMinChange}
        step={1}
        marks
        min={0}
        max={10}
        valueLabelDisplay="auto"
        disabled={isLoading}
      />

      <Typography gutterBottom>Maximum Instances: {maxInstances}</Typography>
      <Slider
        value={maxInstances}
        onChange={handleMaxChange}
        step={1}
        marks
        min={0}
        max={10}
        valueLabelDisplay="auto"
        disabled={isLoading}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Apply Scaling"}
      </Button>

      {status.message && (
        <Alert severity={status.severity} sx={{ mt: 2 }}>
          {status.message}
        </Alert>
      )}
    </Box>
  );
}
