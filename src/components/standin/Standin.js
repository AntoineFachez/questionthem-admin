"use client";

import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DynamicList from "../list/List";

export default function Standin({ data }) {
  const theme = useTheme();
  console.log(data);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "background.default",
        color: "text.primary",
        // p: 4,
        // fontFamily: theme.typography.fontFamily,
        display: "flex",
        flexDirection: "column",
        // gap: 1,
        // justifyContent: "center",
        // alignItems: "center",
      }}
    >
      <Paper
        sx={{
          height: "100%",
          // maxWidth: "lg",
          // width: "100%",
          // maxWidth: "80ch",
          // p: 3,
          overflow: "auto",
        }}
      >
        <Typography>{data.header}</Typography>
        {data && (
          <DynamicList
            data={data.substeps}
            // onClick={handleSetUiContext}
            // itemInFocus={activeStep}
          />
        )}
      </Paper>
    </Box>
  );
}
