import React from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Make sure you have @mui/icons-material installed

const StyledIconButton = styled((props) => {
  // Remove the custom 'expand' prop so it's not passed to the underlying DOM element
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

// This is the component you will register
export default function ExpandMore(props) {
  return (
    <StyledIconButton {...props}>
      <ExpandMoreIcon />
    </StyledIconButton>
  );
}
