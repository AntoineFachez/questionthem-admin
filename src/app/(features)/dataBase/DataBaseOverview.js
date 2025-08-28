"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useDataBase } from "../../../context/DataBaseContext";
import { useUIContext } from "../../../context/UIContext";
import { useUser } from "../../../context/UserContext";

import DynamicTable from "../../../components/table/dataGridElements/DataTable";
// import DynamicTable from "../../../components/table/datagrid/Index";
import KebabMenu from "../../../components/menus/KebabMenu";
import ConfirmDeletionDialog from "../../../components/dialog/ConfirmDeletionDialog";
import { ExpandMore } from "@mui/icons-material";

export default function DataBaseOverview() {
  const theme = useTheme();
  const { handleOpenForm } = useUIContext();
  const { user } = useUser();
  const {
    dbStats,
    loading,
    error,
    setError,
    setRefetchTrigger,
    handleDeleteCollection,
  } = useDataBase();

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

  // if (loading) {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //         bgcolor: "background.default",
  //       }}
  //     >
  //       <Typography variant="h5" color="text.primary">
  //         Loading database overview...
  //       </Typography>
  //     </Box>
  //   );
  // }

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
    { field: "collection", headerName: "Collection", width: 130 },
    { field: "docCount", headerName: "Docs", align: "right", width: 60 },
    {
      field: "lastUpdated",
      headerName: "Last Update",
      align: "right",
      width: 130,
    },
    {
      field: "avgDocSizeBytes",
      headerName: "avgDocSizeBytes",
      align: "right",
      width: 130,
    },
    { field: "topTags", headerName: "topTags", align: "right", width: 130 },
    {
      field: "topReadDocIds",
      headerName: "topReadDocIds",
      align: "right",
      width: 130,
    },
  ];

  const rowActions = {
    header: "",
    menu: (param) => {
      // Define the actions for a single row
      const actions = [
        {
          id: "addDocument",
          name: "Add Document",
          icon: "Add",
          action: () => handleOpenForm(param.collection),
        },
        {
          id: "deleteCollection",
          name: "Delete Collection",
          icon: "Delete",
          action: () => handleDeleteCollection(param.collection),
        },
      ];
      // Render the KebabMenu component with the actions
      return <KebabMenu options={actions} />;
    },
  };
  const handleCellClick = (params, event) => {
    console.log("cell", params.value);
    // If the clicked cell belongs to the 'actions' column
    if (params.field === "actions") {
      // Prevent the onRowClick event from firing
      event.defaultMuiPrevented = true;
    }
  };
  const handleRowClick = (params, event) => {
    console.log("row", params.row);
    // If the clicked cell belongs to the 'actions' column
    if (params.field === "actions") {
      // Prevent the onRowClick event from firing
      event.defaultMuiPrevented = true;
    }
  };
  return (
    <Box
      sx={{
        m: 5,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "background.paper",
          color: "text.primary",
          fontFamily: theme.typography.fontFamily,
          display: "flex",
          flexFlow: "column nowrap",
          justifyContent: "flex-start",
          alignItems: "center",
          overflow: "auto",
          // p: 10,
          // m: 5,
        }}
      >
        <DynamicTable
          loading={loading}
          data={dbStats.collectionStats}
          columns={columns}
          rowActions={rowActions}
          handleCellClick={handleCellClick}
          handleRowClick={handleRowClick}
        />
        <Box
          sx={{
            fontSize: "0.875rem",
            color: "text.secondary",
            textAlign: "center",
            // padding: "1rem",
          }}
        >
          <Typography>Project ID: {"firebaseConfig.projectId"}</Typography>
          <Typography>
            Authentication Status:{" "}
            {user ? `Authenticated (UID: ${user.uid})` : "Not Authenticated"}
          </Typography>
        </Box>
      </Box>
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
