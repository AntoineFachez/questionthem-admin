"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableSortLabel,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import moment from "moment";

export default function DynamicTable({ data, columns, rowActions }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("docCount"); // Default sort column
  if (!data || !data.collectionStats) {
    return <Typography>No data available.</Typography>;
  }

  const handleRequestSort = (property) => {
    console.log(property);

    // Check if the same column is clicked again to toggle the sort direction
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  // Use the sort functions on your collections data
  const sortedCollections = stableSort(
    Object.keys(data.collectionStats),
    getComparator(order, orderBy)
  );

  console.log("columns", columns);
  const collections = Object.keys(data.collectionStats);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                // Add a click handler to update the sort state
                onClick={() => handleRequestSort(column.id)}
                // The `active` and `direction` props are for visual feedback
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : "asc"}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : "asc"}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCollections.map((collectionName) => {
            const stats = data.collectionStats[collectionName];
            const firestoreTimestamp = stats.lastUpdated;
            const jsDate = firestoreTimestamp.toDate();
            const formattedDate = moment(jsDate).format(
              "MMMM Do YYYY, h:mm:ss a"
            );
            const relativeTime = moment(jsDate).fromNow();
            const rowData = { name: collectionName };

            return (
              <TableRow key={collectionName}>
                <TableCell component="th" scope="row">
                  <Typography variant="body1">{collectionName}</Typography>
                </TableCell>
                <TableCell align="right">{stats.docCount}</TableCell>
                <TableCell align="right">{relativeTime}</TableCell>
                <TableCell align="right">{rowActions.menu(rowData)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
