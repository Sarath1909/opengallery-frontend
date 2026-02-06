import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Typography, CircularProgress, Alert, Button } from "@mui/material";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/auth/verify-email?token=${token}`, {
          method: "POST"
        });

        const text = await response.text();

        if (!response.ok) {
          setError(true);
        }
        setMessage(text);
      } catch (err) {
        setError(true);
        setMessage("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setError(true);
      setMessage("Missing verification token.");
      setLoading(false);
    }
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Email Verification
          </Typography>

          <Alert severity={error ? "error" : "success"} sx={{ mt: 2 }}>
            {message}
          </Alert>

          {!error && (
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => (window.location.href = "/login")}
            >
              Go to Login
            </Button>
          )}
        </>
      )}
    </Container>
  );
}
