"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import MuiLink from "@mui/material/Link";
import Link from "next/link";

import { iconMap } from "../../lib/maps/iconMap";
import { features as ADMIN_FEATURES } from "../../lib/data/srumSteps.json";

import { useUser } from "../../context/UserContext";
import { useUIContext } from "../../context/UIContext";

import AdminLogout from "../auth/AdminLogOut";

export default function Navbar() {
  const { user } = useUser();
  const { uiContext, setUiContext } = useUIContext();

  // Sort the features array by importance in ascending order
  const sortedFeatures = [...ADMIN_FEATURES].sort(
    (a, b) => a.importance - b.importance
  );

  return (
    <Box
      component="nav"
      sx={{ bgcolor: "grey.800", color: "white", p: 2, boxShadow: 3 }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "lg",
          mx: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
          <MuiLink
            component={Link}
            href="/"
            color="inherit"
            underline="none"
            sx={{
              transition: "color 0.3s ease-in-out",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            Home
          </MuiLink>
        </Typography>{" "}
        <Button
          color="inherit"
          underline="none"
          onClick={() => setUiContext((prev) => !prev)}
          sx={{
            transition: "color 0.3s ease-in-out",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          Features
        </Button>
        {/* <MuiLink
          component={Link}
          href="/features"
          color="inherit"
          underline="none"
          onClick={() => setUiContext((prev) => !prev)}
          sx={{
            transition: "color 0.3s ease-in-out",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          Features
        </MuiLink> */}
        {user && (
          <Box sx={{ display: "flex", gap: 4 }}>
            {sortedFeatures.map((item) => {
              const IconComponent = iconMap[item.overview.icon];
              return (
                <MuiLink
                  key={item.feature}
                  component={Link}
                  href={item.overview.href}
                  color="inherit"
                  underline="none"
                  sx={{
                    transition: "color 0.3s ease-in-out",
                    "&:hover": {
                      color: "primary.main",
                    },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {IconComponent && <IconComponent />}
                </MuiLink>
              );
            })}
            <AdminLogout />
          </Box>
        )}
      </Box>
    </Box>
  );
}
