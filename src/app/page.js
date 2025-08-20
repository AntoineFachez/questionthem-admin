"use client";
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Overview from "./overview/Widget";
import { useUser } from "../context/UserContext";

import AdminLoginForm from "../components/auth/AdminLogIn";

export default function Home() {
  const { user, loading } = useUser();

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
          </Typography>
          <Overview />{" "}
        </>
      ) : (
        <AdminLoginForm />
      )}
    </Box>
  );
}
