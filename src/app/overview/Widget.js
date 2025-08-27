"use client";
import scrumBackendBuldPlan from "../../lib/pitchScrumData/srumBackend.json";
import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useDataBase } from "../../context/DataBaseContext";

import SduiApp from "../../sdui/SduiApp";
import Overview from "./Overview";

export default function Widget({}) {
  const { handleRecalculateStats } = useDataBase();

  return (
    <>
      <Overview data={scrumBackendBuldPlan.features} />{" "}
    </>
  );
}
