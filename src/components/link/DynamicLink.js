import React from "react";
import { Typography } from "@mui/material";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
export default function DynamicLink({ href, buttonText }) {
  return (
    <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
      <MuiLink
        component={Link}
        href={href}
        color="inherit"
        underline="none"
        sx={{
          transition: "color 0.3s ease-in-out",
          "&:hover": {
            color: "primary.main",
          },
        }}
      >
        {buttonText}
      </MuiLink>
    </Typography>
  );
}
