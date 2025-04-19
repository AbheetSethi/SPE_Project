import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Button, Container, Paper } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Navbar from "../../components/navbar/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const { did } = useParams();

  const handleStart = () => {
    navigate(`/makeDiagnosis/${did}`);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Paper
          elevation={4}
          sx={{
            padding: 6,
            borderRadius: 4,
            textAlign: "center",
            backgroundColor: "#f5faff",
          }}
        >
          <LocalHospitalIcon sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Welcome to Derma System!
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#555", mb: 4 }}>
            Your intelligent assistant for skin disease detection.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStart}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              borderRadius: "30px",
              textTransform: "none",
              boxShadow: 3,
            }}
          >
            Get Started
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default Home;
