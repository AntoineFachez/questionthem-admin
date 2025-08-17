"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  List,
  ListItem,
  LinearProgress,
} from "@mui/material";

import MuiLink from "@mui/material/Link";
import Link from "next/link";
import { iconMap } from "../../lib/maps/iconMap";

export default function Overview({ data }) {
  const calculateOverallProgress = (steps) => {
    if (!steps || steps.length === 0) {
      return 0;
    }
    const totalProgress = steps.reduce((sum, step) => sum + step.progress, 0);
    return totalProgress / steps.length;
  };
  return (
    <Paper sx={{ maxWidth: "90ch", width: "100%" }}>
      <Typography variant="body1">
        Common topics for an admin-facing web app extend far beyond a basic
        collection overview. They generally focus on giving administrators
        control over data, user management, and app configuration.
        <br />
        <br />
        Here the core features to build:
      </Typography>
      <List dense={true} disablePadding={true}>
        {data
          ?.sort((a, b) => a.importance - b.importance)
          .map((item, i) => {
            const IconComponent = iconMap[item.overview.icon];
            const overallProgress = calculateOverallProgress(item.steps);
            const progressPercentage = Math.round(overallProgress * 100);
            return (
              <ListItem
                key={i}
                alignItems="flex-start"
                dense
                // divider
                sx={{ display: "flex", flexFlow: "column nowrap" }}
              >
                {i < data.length - 1 && <Divider sx={{ my: 2 }} />}{" "}
                <MuiLink
                  component={Link}
                  href={item.overview.href}
                  color="inherit"
                  underline="none"
                  sx={{
                    transition: "color 0.3s ease-in-out",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexFlow: "row nowrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingRight: "2rem",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        display: "flex",
                        flexFlow: "row nowrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {item.overview.header}
                    </Typography>{" "}
                    {IconComponent && (
                      <IconButton size="small" sx={{ color: "inherit" }}>
                        <IconComponent />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="body1">{item.overview.text}</Typography>
                </MuiLink>
                <Box sx={{ width: "100%" }}>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                    sx={{ height: 10, borderRadius: 5 }}
                  />{" "}
                </Box>{" "}
              </ListItem>
            );
          })}{" "}
      </List>
    </Paper>
  );
}
