import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
} from "@mui/material";
import { componentMap } from "../../lib/maps/componentMap";

const FormField = ({ field, value, onChange, path }) => {
  const Component = componentMap[field.type];
  if (!Component) return null;

  // For a boolean, the component is likely a <Switch>
  if (field.type === "boolean") {
    return (
      <FormControlLabel
        key={field.name}
        control={
          <Component
            name={field.name}
            checked={value || false}
            onChange={(e) => onChange(e, path)} // path is used here
          />
        }
        label={field.label}
      />
    );
  }

  if (field.type === "select") {
    return (
      <FormControl
        margin="normal"
        key={field.name}
        size="small"
        fullWidth="false"
      >
        <InputLabel>{field.label}</InputLabel>
        <Component
          name={field.name}
          label={field.label}
          value={value || ""}
          onChange={(e) => onChange(e, path)} // path is used here
        >
          {field.options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Component>
      </FormControl>
    );
  }

  // For all other text-based inputs (TextField, etc.)
  // This combines your 'textarea' and 'else' blocks for simplicity

  return (
    <Component
      key={field.name}
      name={field.name}
      label={field.label}
      value={value || ""}
      onChange={(e) => onChange(e, path)} // path is used here
      type={field.type === "number" ? "number" : "text"}
      multiline={field.type === "textarea"} // Use multiline prop for textareas
      rows={field.type === "textarea" ? 4 : 1} // Example rows
      // fullWidth={field.fullWidth ? true : false}
      margin="normal"
      sx={{
        width:
          field.type === "textarea"
            ? "100%"
            : !field.fullWidth
            ? "20ch"
            : "100%",
        // maxWidth: field.type === "number" ? "6ch" : "20ch",
      }}
    />
  );
};

export default React.memo(FormField);
