"use client";
import React from "react";
import { Table, TableContainer } from "@mui/material";
export default function SduiTable(props) {
  const { children } = props;
  // console.log(
  //   "organism.tableHead",
  //   props.children[0].props.blueprint.children[0]
  // );

  return <TableContainer>{children}</TableContainer>;
}
