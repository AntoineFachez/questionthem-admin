import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

/**
 * A confirmation dialog that requires the user to type the item name to confirm deletion.
 * This component is reusable for any resource that needs a confirmation step.
 * * @param {object} props - The component's properties.
 * @param {boolean} props.open - Controls the dialog's visibility.
 * @param {function} props.onClose - Function to close the dialog.
 * @param {string} props.itemName - The name of the item to be deleted (e.g., collection name).
 * @param {function} props.onConfirm - The function to call when the user confirms.
 */
export default function ConfirmDeletionDialog({
  open,
  onClose,
  itemName,
  onConfirm,
}) {
  const [inputValue, setInputValue] = useState("");
  const [isMatch, setIsMatch] = useState(false);

  // Reset input state when the dialog opens or the itemName changes
  useEffect(() => {
    if (open) {
      setInputValue("");
      setIsMatch(false);
    }
  }, [open, itemName]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setIsMatch(value === itemName);
  };

  const handleConfirmClick = () => {
    if (isMatch) {
      onConfirm(itemName);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          To confirm, please type the name of the collection: <br />
          <strong>{itemName}</strong>
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="confirm-name"
          label="Collection Name"
          type="text"
          fullWidth
          variant="outlined"
          value={inputValue}
          onChange={handleInputChange}
          error={inputValue.length > 0 && !isMatch}
          helperText={
            inputValue.length > 0 && !isMatch ? "Names do not match." : ""
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmClick}
          color="error"
          variant="contained"
          disabled={!isMatch}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
