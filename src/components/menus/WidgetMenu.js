import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { iconMap } from "../../lib/maps/iconMap";

export default function WidgetMenu({ activeUiContext }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexFlow: "row npwrap",
        alignItems: "center",
      }}
    >
      {activeUiContext && activeUiContext !== "steps" ? (
        <>
          <IconButton onClick={() => handleSetUiContext("step")}>
            {iconMap["ArrowBack"]}
          </IconButton>

          <Typography variant="body1">{activeUiContext.href}</Typography>
        </>
      ) : (
        <Typography variant="body1">steps</Typography>
      )}
    </Box>
  );
}
