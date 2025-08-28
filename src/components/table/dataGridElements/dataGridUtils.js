// src/dataGridUtils.js
import { useMemo } from "react";
import moment from "moment";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export const useDataGridRowsAndColumns = (data, columns, rowActions) => {
  // 1. Transform the data object into an array of rows
  const rows = useMemo(() => {
    if (!data || typeof data !== "object") return [];

    return Object.entries(data).map(([key, value]) => ({
      id: key,
      collection: key,
      ...value,
    }));
  }, [data]);

  // 2. Add the custom renderCell to the existing lastUpdated column
  const baseColumns = useMemo(() => {
    return columns.map((col) => {
      if (col.field === "lastUpdated") {
        return {
          ...col,
          renderCell: (params) => {
            const firestoreTimestamp = params.value;
            if (
              !firestoreTimestamp ||
              typeof firestoreTimestamp.toDate !== "function"
            ) {
              return "N/A";
            }
            const jsDate = firestoreTimestamp.toDate();
            return moment(jsDate).fromNow();
          },
        };
      }
      return col;
    });
  }, [columns]);

  // 3. Append the actions column
  const columnsWithActions = useMemo(() => {
    const actionsColumn = {
      field: "actions",
      headerName: rowActions?.header || "Actions",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return rowActions?.menu(params.row);
      },
    };

    return [...baseColumns, actionsColumn];
  }, [baseColumns, rowActions]);
  // const accordion = useMemo(() => {
  //   const accordionField = {
  //     field: "details",
  //     headerName: "Details",
  //     width: 250,
  //     renderCell: (params) => {
  //       // You can access the entire row from params.row
  //       const rowData = params.row;
  //       return (
  //         <Accordion sx={{ width: "100%", boxShadow: "none" }}>
  //           <AccordionSummary expandIcon={<ExpandMore />}>
  //             <Typography>Show More</Typography>
  //           </AccordionSummary>
  //           <AccordionDetails>
  //             <Typography>Docs: {rowData.docCount}</Typography>
  //             <Typography>
  //               Last Updated: {rowData.lastUpdated.toLocaleString()}
  //             </Typography>
  //           </AccordionDetails>
  //         </Accordion>
  //       );
  //     },
  //   };

  //   return [...columnsWithActions, accordionField];
  // }, [columnsWithActions]);

  // Return the prepared data and columns
  return { rows, columnsWithActions };
};
