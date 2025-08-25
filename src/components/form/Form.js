// src/components/organisms/LoginForm.jsx
import React from "react";
import { Box } from "@mui/material";

const Form = ({ children, style }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submitted with data:", data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={style}>
      {children}
    </Box>
  );
};

export default Form;
