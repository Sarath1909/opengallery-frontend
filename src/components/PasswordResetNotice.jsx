import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function PasswordResetNotice({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LockResetIcon color="warning" /> Password Reset Required
      </DialogTitle>

      <DialogContent>
        <Typography>
          Since this is your first login, a password reset link has been sent
          to your email. Please reset your password before trying again.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          OK, I’ll Check
        </Button>
      </DialogActions>
    </Dialog>
  );
}
