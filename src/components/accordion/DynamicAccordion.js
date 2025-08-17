// src/components/accordion/DynamicAccordion.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
export default function DynamicAccordion({ summary, detail }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  return (
    <Accordion
      sx={{ mb: 0, borderRadius: 1, p: 0 }}
      expanded={expanded}
      onChange={handleExpansion}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6" component="h3" gutterBottom>
          {summary}
        </Typography>
      </AccordionSummary>{" "}
      <Divider sx={{ my: 1 }} />
      <AccordionDetails>{detail}</AccordionDetails>
    </Accordion>
  );
}
