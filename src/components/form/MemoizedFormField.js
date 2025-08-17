// src/components/dynamicform/MemoizedFormField.js
import React from "react";
import {
  TextField,
  Switch,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
} from "@mui/material";
import { componentMap } from "../../lib/maps/componentMap";

const FormField = ({ field, value, onChange, onArrayChange, path }) => {
  const Component = componentMap[field.type];
  if (!Component) return null;

  if (field.type === "boolean") {
    return (
      <FormControlLabel
        key={field.name}
        control={
          <Component
            name={field.name}
            checked={value || false}
            onChange={(e) => onChange(e, path)}
          />
        }
        label={field.label}
      />
    );
  } else if (field.type === "select") {
    return (
      <FormControl fullWidth margin="normal" key={field.name}>
        <InputLabel>{field.label}</InputLabel>

        <Component
          name={field.name}
          label={field.label}
          value={value || ""}
          onChange={(e) => onChange(e, path)}
        >
          {field.options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Component>
      </FormControl>
    );
  } else if (field.type === "textarea") {
    return (
      <Component
        key={field.name}
        name={field.name}
        label={field.label}
        value={value || ""}
        onChange={(e) => onChange(e, path)}
        type={field.type === "number" ? "number" : "text"}
        fullWidth
        margin="normal"
        sx={{ width: "100%" }}
      />
    );
  } else {
    return (
      <>
        <Component
          key={field.name}
          name={field.name}
          label={field.label}
          value={value || ""}
          onChange={(e) => onChange(e, path)}
          type={field.type === "number" ? "number" : "text"}
          fullWidth
          margin="normal"
          sx={{ maxWidth: "20ch" }}
        />
      </>
    );
  }
};

export default React.memo(FormField);
