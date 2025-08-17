import {
  Box,
  IconButton,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import React, { Fragment } from "react";
import { LinearProgress } from "@mui/material";
import { iconMap } from "../../lib/maps/iconMap";
import { handleCopyToClipboard } from "../../lib/utils/clipboard";

export default function DynamicList({ data, itemInFocus, onClick }) {
  return (
    <Paper
      sx={{
        // maxWidth: "80ch",
        width: "100%",
      }}
    >
      <List
        dense={true}
        disablePadding={true}
        sx={{ display: "flex", flexFlow: "column nowrap", gap: 2 }}
      >
        {data?.map((item, i) => {
          const IconApp = iconMap["Apps"];
          const IconCopy = iconMap["ContentCopy"];
          return (
            <ListItem
              key={i}
              alignItems="flex-start"
              dense
              // divider
              onClick={() => onClick(item)}
              sx={{
                display: "flex",
                flexFlow: "column nowrap",
                backgroundColor: itemInFocus === item ? "#333433" : "",
                color: itemInFocus === item ? "darkgrey" : "",

                // borderRadius: "5px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexFlow: "row nowrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexFlow: "column nowrap",
                    // backgroundColor: "grey",
                  }}
                >
                  <Typography variant="body1" align="left" gutterBottom="false">
                    {item.step}
                  </Typography>
                  {item.demo && <IconApp />}
                </Box>
                <Typography
                  variant="body1"
                  align="left"
                  gutterBottom="false"
                  sx={{ width: "30%" }}
                >
                  {item.header}
                </Typography>
                <Typography
                  variant="body1"
                  align="left"
                  gutterBottom="false"
                  sx={{ width: "70%" }}
                >
                  {item.text}
                </Typography>{" "}
                <IconButton
                  size="small"
                  onClick={() => handleCopyToClipboard(item.text)}
                  aria-label="copy to clipboard"
                >
                  <IconCopy fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ width: "100%" }}>
                <LinearProgress
                  variant="determinate"
                  value={item.progress * 100}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>{" "}
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
