import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Link,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import VerifyEmailDialog from "./VerifyEmailDialog";
import PasswordResetNotice from "./PasswordResetNotice";

export default function LoginDialog({ open, onClose, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifyEmailOpen, setVerifyEmailOpen] = useState(false);
  const [passwordResetOpen, setPasswordResetOpen] = useState(false);


  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (response.status === 403) {
        setVerifyEmailOpen(true); // NEW state
        return;
      }
      if (response.status === 400) {
        setPasswordResetOpen(true); // NEW state
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      // Notify parent that login succeeded
      onLoginSuccess?.(data.token);

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            autoComplete="off"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="new-username"
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              autoComplete="new-password"
            />

            <Link href="#" variant="body2" sx={{ alignSelf: "flex-end" }}>
              Forgot password?
            </Link>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </DialogActions>
      </Dialog>

      <VerifyEmailDialog
        open={verifyEmailOpen}
        onClose={() => setVerifyEmailOpen(false)}
      />

      <PasswordResetNotice
        open={passwordResetOpen}
        onClose={() => setPasswordResetOpen(false)}
      />
    </>
  );
}
