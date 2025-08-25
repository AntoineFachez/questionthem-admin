"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function DynamicTable({
  children,
  parentProps,
  data,
  columns,
  rowActions,
}) {
  console.log("DynamicTabledata", data);
  return (
    <TableContainer sx={{ width: "100%", height: "100%", backgroundColor: "" }}>
      {children}
    </TableContainer>
  );
}
