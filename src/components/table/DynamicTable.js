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

export default function DynamicTable({ data, columns, rowActions }) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: "100%" }}>
        <TableHead>
          <TableRow hover selected>
            {columns.map((column) => (
              <TableCell key={column.id} align={column.align || "left"}>
                <Typography variant="body1">{column.label}</Typography>
              </TableCell>
            ))}
            {rowActions && (
              <TableCell>
                <Typography variant="body1">{rowActions.header}</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    size="small"
                    align={column.align || "left"}
                  >
                    <Typography variant="body1">{row[column.id]}</Typography>
                  </TableCell>
                ))}
                {rowActions && (
                  <TableCell size="small">{rowActions.menu(row)}</TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                sx={{ textAlign: "center" }}
              >
                <Typography>No collections found or configured.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
