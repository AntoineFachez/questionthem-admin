"use client";

import React, { useState } from "react";
import { Box, Typography, Paper, Button, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { firebaseConfig } from "../../app/firebase/config";

import { useFirestoreData } from "../../context/DataBaseContext";
import { useUIContext } from "../../context/UIContext";
import { useUser } from "../../context/UserContext";

import { blueprintMap } from "../../lib/maps/blueprintMap";

import DynamicTable from "../../components/table/DynamicTable";
import KebabMenu from "../../components/menus/KebabMenu";
import ConfirmDeletionDialog from "../../components/dialog/ConfirmDeletionDialog";

export default function DataBaseOverview() {
  const theme = useTheme();
  const {
    dbOverview,
    loading,
    error,
    setError,
    setRefetchTrigger,
    handleDeleteCollection,
  } = useFirestoreData();
  const { handleOpenForm } = useUIContext();
  const { user } = useUser();
  const [isConfirming, setIsConfirming] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState("");

  const openConfirmDialog = (collectionName) => {
    setCollectionToDelete(collectionName);
    setIsConfirming(true);
  };

  const closeConfirmDialog = () => {
    setIsConfirming(false);
    setCollectionToDelete("");
  };

  const onConfirmDeletion = (name) => {
    handleDeleteCollection(name);
  };

  const handleDismissError = () => {
    setError(null);
    setRefetchTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Typography variant="h5" color="text.primary">
          Loading database overview...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
          gap: 2,
        }}
      >
        <Typography variant="h5" color="error.main">
          Error: {error}
        </Typography>
        <Button
          onClick={handleDismissError}
          variant="contained"
          color="primary"
        >
          Dismiss and Reload
        </Button>
      </Box>
    );
  }

  const columns = [
    { id: "name", label: "Collections" },
    { id: "docCount", label: "Docs", align: "right" },
  ];

  const rowActions = {
    header: "",
    menu: (collection) => {
      // Define the actions for a single row
      const actions = [
        {
          name: "Add Document",
          icon: "Add",
          onClick: () => handleOpenForm(collection.name),
        },
        {
          name: "Delete Collection",
          icon: "Delete",
          onClick: () => handleDeleteCollection(collection.name),
        },
      ];
      // Render the KebabMenu component with the actions
      return <KebabMenu actions={actions} />;
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "background.default",
        color: "text.primary",
        fontFamily: theme.typography.fontFamily,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{ overflow: "auto" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "primary.main",
            padding: "1rem",
          }}
        >
          Firestore Database Overview
        </Typography>
        <DynamicTable
          data={dbOverview}
          columns={columns}
          rowActions={rowActions}
        />
        <Box
          sx={{
            fontSize: "0.875rem",
            color: "text.secondary",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          <Typography>Project ID: {firebaseConfig.projectId}</Typography>
          <Typography>
            Authentication Status:{" "}
            {user ? `Authenticated (UID: ${user.uid})` : "Not Authenticated"}
          </Typography>
        </Box>
      </Paper>
      <Button onClick={() => openConfirmDialog(item.name)}>Delete</Button>
      <ConfirmDeletionDialog
        open={isConfirming}
        onClose={closeConfirmDialog}
        itemName={collectionToDelete}
        onConfirm={onConfirmDeletion}
      />
    </Box>
  );
}
