import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useUIContext } from "../../context/UIContext";
import DynamicForm from "../form/DynamicForm";
import { Typography } from "@mui/material";

export default function ScrollDialog() {
  const {
    openDialog,
    scrollDialog,
    openForm,
    activeBlueprint,
    handleCloseDialog,
  } = useUIContext();

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
          {activeBlueprint.title}
        </Typography>
        {/* <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle> */}
        <DialogContent
          dividers={scrollDialog === "paper"}
          sx={{ maxWidth: "100vh" }}
        >
          {openForm && activeBlueprint && (
            <DynamicForm
              blueprint={activeBlueprint}
              onClose={() => setopenForm(false)}
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
