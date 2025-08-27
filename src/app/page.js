"use client";
import React from "react";
import { Box, Button, Typography } from "@mui/material";

import { useUser } from "../context/UserContext";
import { useDataBase } from "../context/DataBaseContext";

import AdminLoginForm from "../components/auth/AdminLogIn";

import DynamicLink from "../components/link/DynamicLink";

export default function Home() {
  const { user, loading } = useUser();
  const { handleRecalculateStats } = useDataBase();

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {user ? (
        <>
          <Typography
            variant="h6"
            sx={{ height: "fit-content", textAlign: "center", mt: 4 }}
          >
            Welcome {user.email || "Admin"}
          </Typography>{" "}
          <DynamicLink href={"overview"} buttonText={"Overview"} />
        </>
      ) : (
        <AdminLoginForm />
      )}
    </Box>
  );
}
