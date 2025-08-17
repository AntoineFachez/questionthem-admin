"use client";
import React from "react";
import { Box, Button, Typography } from "@mui/material";

import { useUser } from "../context/UserContext";

import Header from "../components/header/Header";
import AdminLoginForm from "../components/auth/AdminLogIn";

export default function Home() {
  const { user, loading } = useUser();

  const headerProps = {
    string: "Home",
    variant: "h1",
    sx: {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
    },
  };

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
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      {" "}
      <Header props={headerProps} />
      {user ? (
        <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
          Welcome {user.email || "Admin"}
        </Typography>
      ) : (
        <AdminLoginForm />
      )}
    </Box>
  );
}
