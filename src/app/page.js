"use client";
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import MuiLink from "@mui/material/Link";
import Link from "next/link";

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
  const buttonData = [
    { title: "Pitch", navigateTo: "/pitch" },
    { title: "Scrum", navigateTo: "/scrum" },
  ];
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
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // overflow: "hidden",
            }}
          >
            {buttonData?.map((button) => (
              <>
                <MuiLink
                  component={Link}
                  href={button.navigateTo}
                  color="primary.main"
                  underline="none"
                  sx={{
                    width: "10rem",
                    height: "10rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "primary.main",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                    },
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "2px solid",
                    borderColor: "primary.main",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <Typography variant="h5">{button.title}</Typography>
                </MuiLink>
              </>
            ))}
          </Box>
        </>
      ) : (
        <AdminLoginForm />
      )}
    </Box>
  );
}
