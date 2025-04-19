import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  CircularProgress
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { toast } from "react-toastify";
import signin from "../../services/Signin";
import MyContext from "../../components/MyContext/MyContext";

const Signin = () => {
  const navigate = useNavigate();
  const { setPid } = useContext(MyContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      const response = await signin.signinUser({
        username,
        password
      });
      
      if (response.status === 200 && response.data && response.data.pid) {
        setPid(response.data.pid);
        localStorage.setItem("pid", response.data.pid);
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful!");
        navigate(`/home/${response.data.pid}`);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          borderRadius: 2
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%"
          }}
        >
          <Box
            sx={{
              backgroundColor: "#4051B5",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 1
            }}
          >
            <LockOutlinedIcon sx={{ color: "white" }} />
          </Box>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Patient Sign In
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
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#4051B5",
                "&:hover": {
                  backgroundColor: "#303f9f"
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
            
            <Box sx={{ textAlign: "center" }}>
              <Link
                href="#"
                variant="body2"
                onClick={() => navigate("/register")}
                sx={{ color: "#4051B5" }}
              >
                Don't have an account? Sign up
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signin;
