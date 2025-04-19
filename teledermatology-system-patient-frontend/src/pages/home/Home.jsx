import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Button, Container, Paper, Grid, Box } from "@mui/material";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleIcon from '@mui/icons-material/Article';
import Navbar from "../../components/navbar/Navbar";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const { pid } = useParams();

  const handleCreateRequest = () => {
    navigate(`/createrequest/${pid}`);
  };

  const handleViewDiagnosis = () => {
    navigate(`/viewdiagnosis/${pid}`);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 5, borderRadius: 3, textAlign: "center", backgroundColor: "#f8f9fa" }}>
          <HealthAndSafetyIcon sx={{ fontSize: 80, color: "#4051B5", mb: 2 }} />
          
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: "#4051B5" }}>
            Welcome to Teledermatology System
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 5, color: "#555" }}>
            Upload images of your skin condition for professional diagnosis by specialized dermatologists.
            Get expert advice without leaving the comfort of your home.
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  }
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 60, color: "#4051B5", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Create New Request
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color: "#666" }}>
                  Upload images of your skin condition to get professional diagnosis
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleCreateRequest}
                  sx={{ 
                    backgroundColor: "#4051B5",
                    "&:hover": {
                      backgroundColor: "#303f9f"
                    }
                  }}
                >
                  Upload Image
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  }
                }}
              >
                <ArticleIcon sx={{ fontSize: 60, color: "#4051B5", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  View Your Diagnoses
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color: "#666" }}>
                  Check the status and results of your previous diagnosis requests
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={handleViewDiagnosis}
                  sx={{ 
                    borderColor: "#4051B5",
                    color: "#4051B5",
                    "&:hover": {
                      borderColor: "#303f9f",
                      backgroundColor: "rgba(64, 81, 181, 0.04)"
                    }
                  }}
                >
                  View Diagnoses
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default Home;
