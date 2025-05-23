import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Box, Typography, TextField, Button, Link, Paper, Alert,
  CircularProgress, Checkbox, FormControlLabel
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { toast } from "react-toastify";
import signin from "../../services/Signin";

const Signin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await signin.signinUser({ username, password });

      if (response.status === 200 && response.data && response.data.pid) {
        const { pid } = response.data;
        toast.success("Login successful!");
        navigate(`/home/${pid}`);
      }
      else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f8f7',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xs" sx={{ mt: 8, mb: 2 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#4051B5",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <LockOutlinedIcon sx={{ color: "white", fontSize: 28 }} />
          </Box>
          <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 600, textAlign: "center" }}>
            Welcome to Teledermatology
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSignin} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember me"
              sx={{ mt: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              color="primary"
              sx={{
                mt: 3,
                mb: 2,
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "SIGN IN"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Link
                href="#"
                variant="body2"
                onClick={() => navigate("/register")}
                sx={{ color: "#4051B5" }}
              >
                Don't have an account? Register
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signin;
