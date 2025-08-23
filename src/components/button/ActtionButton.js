"use client";

import React from "react";
import { Button, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { actionRegistry } from "../../core/registries/action-registry";
import { iconMap } from "../../lib/maps/iconMap";

export function ActionButton({ action, params, iconName }) {
  const router = useRouter();

  const handleAction = () => {
    actionRegistry[action]({ router, ...params });
  };

  return (
    <Button onClick={handleAction} startIcon={iconMap[iconName]}>
      {/* ... */}
    </Button>
  );
}
export function ActionIconButton({ action, params, iconName }) {
  const router = useRouter();

  const handleAction = () => {
    actionRegistry[action]({ router, ...params });
  };

  return <IconButton onClick={handleAction}>{iconMap[iconName]}</IconButton>;
}
