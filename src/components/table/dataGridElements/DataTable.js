import { useState, useEffect, useMemo, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import GridCustomToolbar from "./GridCustomToolbar";
import { useDataGridRowsAndColumns } from "./dataGridUtils"; // <-- Import the new hook
import CustomFooter from "./CustomFooter"; // Adjust the path

const initialState = {
  pagination: {
    paginationModel: {
      pageSize: 5,
    },
  },
  scroll: {
    left: 0, // Start at the leftmost position
  },
};
export default function DataTable({
  loading,
  data,
  columns,
  rowActions,
  handleCellClick,
  handleRowClick,
}) {
  const { rows, columnsWithActions } = useDataGridRowsAndColumns(
    data,
    columns,
    rowActions
  );

  const [isExpandedTable, setIsExpandedTable] = useState(false);
  const [density, setDensity] = useState(
    isExpandedTable ? "comfortable" : "compact"
  );
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [savedState, setSavedState] = useState({
    count: 0,
    initialState: data.initialState,
    density: "compact",
  });
  const syncState = useCallback((newInitialState) => {
    setSavedState((prev) => ({
      count: prev.count + 1,
      initialState: newInitialState,
    }));
  }, []);

  useEffect(() => {
    setDensity(isExpandedTable ? "comfortable" : "compact");
  }, [isExpandedTable]);
  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        borderRadius: "1rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        // "& >*": {
        //   borderRadius: "1rem",

        //   padding: "24px",
        //   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        // },
        // m: 5,
      }}
    >
      <DataGrid
        key={savedState.count}
        loading={loading}
        rows={rows}
        columns={columnsWithActions}
        onCellClick={handleCellClick}
        onRowClick={handleRowClick}
        // isCellEditable={() => "collection"}
        checkboxSelection
        disableRowSelectionOnClick={true}
        // initialState={{
        //   ...data.initialState,
        //   filter: {
        //     filterModel: {
        //       items: [{ field: "docCount", operator: ">", value: 10 }],
        //     },
        //   },
        //   pagination: { paginationModel: { pageSize: 5 } },
        //   sorting: {
        //     sortModel: [{ field: "docCount", sort: "desc" }],
        //   },
        // }}
        // initialState={savedState.initialState}
        // paginationModel={paginationModel}
        // onPaginationModelChange={setPaginationModel}
        // pageSizeOptions={[5, 10, 25, 50, 100]}
        showToolbar
        slots={{
          toolbar: GridCustomToolbar,
          // footer: CustomFooter
        }}
        slotProps={{
          toolbar: {
            syncState,
            isExpandedTable: isExpandedTable,
            setIsExpandedTable: setIsExpandedTable,
          },
          //   footer: { customProp: 'value' }
        }}
        // sx={{
        //   border: 0,
        //   // MuiPaper: { root: { width: "100%" } },
        //   MuiInputBase: { root: { width: "100%" } },
        //   "& .MuiInputBase-root MuiInputBase-colorPrimary MuiTablePagination-select":
        //     { root: { width: "fit-content" } },
        // }}
        autoPageSize={true}
        density={density}
        // onDensityChange={handleDensityChange}
        onDensityChange={(newDensity) => setDensity(newDensity)}
        // showColumnVerticalBorder={true}
        // hideFooter={!isExpandedTable ? true : false}
        // hideFooterSelectedRowCount={!isExpandedTable ? true : false}
        // hideFooterPagination={!isExpandedTable ? true : false}
        labelRowsPerPage="Items per Page"

        // autoHeight
        // slots={{
        //   // toolbar: CustomToolbar,
        //   toolbar: CustomToolbar,
        //   // toolbar: ToolbarContainer,
        //   // noRowsOverlay: MyNoRowsOverlay,
        //   // toolbar: GridToolbar && Toolbar,
        //   // toolbar: (
        //   //   <>
        //   //     <Toolbar />
        //   //   </>
        //   // ),
        //   // rowReorderIcon: <SwapVert />,
        // }}
      />
    </Paper>
  );
}
