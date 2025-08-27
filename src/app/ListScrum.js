"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  List,
  ListItem,
  LinearProgress,
  Card,
  Grid,
  Checkbox,
} from "@mui/material";

import { iconMap } from "../lib/maps/iconMap";
import DynamicAccordion from "../components/accordion/DynamicAccordion";

export default function ListScrum({ data, onUpdateProgress }) {
  const [sections, setSections] = useState(data);

  const calculateOverallProgress = (steps) => {
    if (!steps || steps.length === 0) {
      return 0;
    }
    const totalProgress = steps.reduce((sum, step) => sum + step.progress, 0);
    return totalProgress / steps.length;
  };
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  // 1. Modify the handler to find the correct item and call the parent's update function
  const handleOnChangeCheckbox = (sectionId, subsectionId, isChecked) => {
    // 2. Pass sectionId and subsectionId to the parent handler
    handleUpdateProgress(sectionId, subsectionId, isChecked);
  };
  const handleUpdateProgress = (sectionId, subsectionId, isChecked) => {
    // Create a new array based on the current state to avoid direct mutation
    const newSections = sections.map((section) => {
      console.log("clicked", sectionId, subsectionId, isChecked);
      // Find the correct section
      if (section.section === sectionId) {
        // Create a new subsections array for this section
        const newSubsections = section.subsections.map((subsection) => {
          // Find the correct subsection
          if (subsection.subsection === subsectionId) {
            // Update the progress based on the checkbox state
            const newProgress = isChecked ? 1 : 0;
            return { ...subsection, progress: newProgress };
          }
          return subsection;
        });

        // Recalculate the section's overall progress
        const overallProgress =
          newSubsections.reduce((sum, sub) => sum + sub.progress, 0) /
          newSubsections.length;

        // Return the updated section
        return {
          ...section,
          subsections: newSubsections,
          progress: overallProgress,
        };
      }
      return section;
    });

    // Update the state with the new array
    setSections(newSections);
  };
  return (
    <Paper
      sx={{
        width: "100%",
        maxWidth: "90ch",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* <Button onClick={handleRecalculateStats}>Recalculate Stats</Button> */}
      {/* <SduiApp /> */}
      <List dense={true} disablePadding={true}>
        {sections
          ?.sort((a, b) => a.importance - b.importance)
          .map((item, i) => {
            const IconComponent = iconMap[item?.icon];
            const overallProgress = calculateOverallProgress(item.subsections);
            const progressPercentage = Math.round(overallProgress * 100);
            return (
              <ListItem
                key={i}
                alignItems="flex-start"
                dense
                sx={{
                  display: "flex",
                  flexFlow: "column nowrap",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                {i < data.length - 1 && <Divider sx={{ my: 2 }} />}{" "}
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
                    {item?.title}
                  </Typography>{" "}
                  {IconComponent && (
                    <IconButton size="small" sx={{ color: "inherit" }}>
                      <IconComponent />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="body1">{item?.content}</Typography>
                <Grid sx={{}}>
                  {item.subsections.map((subsection, i) => (
                    <Card
                      key={i}
                      sx={{
                        width: "10rem",
                        p: 0,
                        m: 0,
                      }}
                    >
                      <Checkbox
                        {...label}
                        checked={subsection.progress === 1}
                        color="success"
                        // 3. Update the onChange prop to pass the correct values
                        onChange={(e) =>
                          handleOnChangeCheckbox(
                            item.section,
                            subsection.subsection,
                            e.target.checked
                          )
                        }
                      />
                      <DynamicAccordion
                        summary={subsection.title}
                        detail={subsection.content}
                      />{" "}
                    </Card>
                  ))}{" "}
                </Grid>
                <Box sx={{ width: "100%" }}>
                  <LinearProgress
                    variant="determinate"
                    color="success"
                    value={progressPercentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                    }}
                  />{" "}
                </Box>{" "}
              </ListItem>
            );
          })}{" "}
      </List>
    </Paper>
  );
}
