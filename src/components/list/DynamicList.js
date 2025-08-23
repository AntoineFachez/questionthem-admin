// components/list/List.js
import {
  Box,
  IconButton,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { getComponent } from "./renderComponent";
import { containerProps } from "../../theme/muiProps";

export default function DynamicList({ data, itemInFocus, blueprint, onClick }) {
  if (!blueprint) {
    return <Typography>Error: Blueprint not provided.</Typography>;
  }

  return (
    <List
      className="dynamic-list"
      dense={true}
      disablePadding={true}
      // {...containerProps}
      sx={{ height: "100%", overflow: "scroll" }}
    >
      {data?.map((item, i) => (
        <ListItem
          className="dynamic-list-item"
          key={i}
          alignItems="flex-start"
          onClick={() => onClick(item)}
          sx={{
            display: "flex",
            flexFlow: "column nowrap",
            backgroundColor:
              itemInFocus === item ? "primary.dark" : "transparent",
            transition: "background-color 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          {blueprint.map((field, fieldIndex) => (
            <Box
              key={fieldIndex}
              sx={{
                display: "flex",
                width: "100%",
                display: "flex",
                // flexFlow: "column nowrap",
                justifyContent: "center",
                alignItems: "center",

                ...field.containerSx,
                // pl: field.type === "sublist" ? 2 : 0,
              }}
            >
              {getComponent(
                item,
                itemInFocus,
                field,
                fieldIndex,
                onClick,
                DynamicList
              )}
            </Box>
          ))}
        </ListItem>
      ))}
    </List>
  );
}
