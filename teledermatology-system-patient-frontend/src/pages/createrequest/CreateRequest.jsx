import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Navbar from "../../components/navbar/Navbar";
import { toast } from "react-toastify";
import createrequest from "../../services/Createrequest";
import uploadImage from "../../services/Uploadimage";
import "./createrequest.css";

const CreateRequest = () => {
  const navigate = useNavigate();
  const { pid } = useParams();
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.includes("image/")) {
        setFile(selectedFile);
        setErrorMsg("");
        // Create a preview URL for the image
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setErrorMsg("Please select a valid image file");
        setFile(null);
        setPreviewUrl(null);
      }
    }
  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  const handleSubmit = async () => {
    if (!name) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (!file) {
      setErrorMsg("Please upload an image");
      return;
    }

    setUploading(true);
    setErrorMsg("");

    try {
      // First create the request entry
      const createResponse = await createrequest.createRequest({
        patientName: name,
        patientId: pid,
        comments: comments
      });

      if (createResponse.status === 200) {
        // Then upload the image with the appointment ID
        const aid = createResponse.data.appointmentId;
        const formData = new FormData();
        formData.append("image", file);
        formData.append("aid", aid);

        const uploadResponse = await uploadImage.upload(formData);

        if (uploadResponse.status === 200) {
          toast.success("Request created successfully!");
          navigate(`/home/${pid}`);
        } else {
          toast.error("Failed to upload image");
        }
      } else {
        toast.error("Failed to create request");
      }
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error("An error occurred while creating your request");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 600, color: "#4051B5", mb: 1 }}
          >
            Create New Request
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "#555", mb: 4 }}
          >
            Upload an image to create a new request for diagnosis
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={name}
                onChange={handleNameChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "#4051B5",
                  },
                  mb: 2,
                }}
                onClick={() => document.getElementById("file-upload").click()}
              >
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <CloudUploadIcon sx={{ fontSize: 60, color: "#4051B5", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {file ? file.name : "Choose file or drag & drop"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Supported formats: JPEG, PNG, JPG
                </Typography>
              </Box>

              {previewUrl && (
                <Box
                  sx={{
                    mt: 2,
                    mb: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Image Preview:
                  </Typography>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                    }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Patient Comments"
                variant="outlined"
                multiline
                rows={4}
                value={comments}
                onChange={handleCommentsChange}
                placeholder="Please describe your symptoms or concerns..."
                sx={{ mb: 2 }}
              />
            </Grid>

            {errorMsg && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMsg}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={uploading}
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: "8px",
                  textTransform: "none",
                  backgroundColor: "#4051B5",
                  "&:hover": {
                    backgroundColor: "#303f9f",
                  },
                }}
              >
                {uploading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Request"
                )}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default CreateRequest;
