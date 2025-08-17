"use client";
import React from "react";
import { Box, Button, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";

import { UserProvider } from "../context/UserContext";
import { DataBaseProvider } from "../context/DataBaseContext";
import { UIProvider, useUIContext } from "../context/UIContext";

import Navbar from "../components/navbar/Navbar";
import ScrollDialog from "../components/dialog/ScrollDialog";
import DynamicBreadcrumbs from "../components/breadcrumbs/DynamicBreadcrumbs";

import { darkTheme } from "../theme/theme";
export default function RootLayout({ children }) {
  const steps = [{ step: 1 }];
  return (
    <html lang="en">
      <ThemeProvider theme={darkTheme}>
        <Box
          component="body"
          sx={{
            width: "100vw",
            height: "100vh",
            bgcolor: "background.default",
            m: 0,
            p: 0,
            boxSizing: "border-box",
            color: "text.primary",
            fontFamily: "sans-serif",
          }}
        >
          <UIProvider>
            <UserProvider>
              <DataBaseProvider>
                <Navbar />
                <Box
                  component="main"
                  // sx={{ maxWidth: "lg", height: "100%", mx: "auto", p: 4 }}
                  sx={{ width: "100%", height: "100%" }}
                >
                  {" "}
                  <DynamicBreadcrumbs steps={steps} />
                  {children}
                </Box>{" "}
                <ToastContainer />
                <ScrollDialog />
              </DataBaseProvider>
            </UserProvider>
          </UIProvider>
        </Box>
      </ThemeProvider>
    </html>
  );
}
