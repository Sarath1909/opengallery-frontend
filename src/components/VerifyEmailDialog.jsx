import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

export default function VerifyEmailDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <MarkEmailReadIcon color="primary" /> Email Verification Required
      </DialogTitle>

      <DialogContent>
        <Typography>
          We’ve sent a verification link to your registered email address.  
          Please check your inbox (and spam folder) before logging in.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          OK, Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}
