import React from "react";
import { Typography } from "@mui/material";

export default function Title({ props }) {
  const { string, variant = "h1", sx } = props;
  return (
    <Typography sx={sx} variant={variant}>
      {string}
    </Typography>
  );
}
