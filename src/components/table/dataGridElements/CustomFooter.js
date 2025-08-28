// src/components/dataGrid/CustomFooter.js

import {
  GridFooter,
  GridFooterContainer,
  GridPagination,
} from "@mui/x-data-grid";
import { Typography, Box } from "@mui/material";

export default function CustomFooter(props) {
  // Access the selected row count from the props passed by DataGrid
  const selectedRowCount = props.selectedRowCount;

  return (
    <GridFooterContainer>
      {/* <Box sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="body2">
          {selectedRowCount} items selected
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}></Box> */}

      {/* <GridFooter /> */}
      <GridPagination />
    </GridFooterContainer>
  );
}
