// app/notificationsAndAlert/layout.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";

import { useUser } from "@/context/UserContext";
import { WidgetContext } from "./Context";

export default function Alerts({ children }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
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
    <WidgetContext>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexFlow: "column nowrap",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        {children}
      </Box>
    </WidgetContext>
  );
}
