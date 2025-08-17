import React from "react";
import {
  TextField,
  Switch,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";

export const componentMap = {
  text: TextField,
  textarea: (props) => <TextField multiline rows={4} {...props} />,
  number: TextField,
  "date-time": TextField,
  string: TextField,
  boolean: Switch,
  url: TextField,
  select: Select, // Add Select to the map
};

// These extra components are needed to build a proper Select field in MUI
export const selectComponents = {
  FormControl,
  InputLabel,
  MenuItem,
};
