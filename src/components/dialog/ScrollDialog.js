import * as React from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Typography, Button, Dialog } from "@mui/material";

import { useUIContext } from "../../context/UIContext";

import componentMap from "../../lib/maps/widgetMap";

export default function ScrollDialog() {
  const {
    openDialog,
    scrollDialog,
    dialogTitle,
    activeBlueprint,
    activeWidget,
    handleCloseDialog,
  } = useUIContext();

  const ComponentToRender = componentMap[activeWidget.key];

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (openDialog) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openDialog]);

  return (
    <React.Fragment>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        // scroll={scrollDialog}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={"true"}
        maxWidth={"xl"}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {dialogTitle}
        </Typography>
        {/* <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle> */}
        <DialogContent
          dividers={scrollDialog === "paper"}
          // sx={{ maxWidth: "100vh" }}
        >
          {ComponentToRender && (
            <ComponentToRender
              activeBlueprint={activeBlueprint}
              // onClose={handleCloseDialog}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCloseDialog}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
