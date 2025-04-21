import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CreateRequestNavbar from "../../components/navbar/CreateRequestNavbar";
import { toast } from "react-toastify";
import createrequest from "../../services/Createrequest";
import uploadImage from "../../services/Uploadimage";

const UPLOAD_WIDTH = 320; // px, adjust as needed for your design

const CreateRequest = () => {
  const navigate = useNavigate();
  const { pid } = useParams();
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.includes("image/")) {
        setFile(selectedFile);
        setErrorMsg("");
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
    if (!comments.trim()) {
      setErrorMsg("Please enter your query");
      return;
    }
    if (!file) {
      setErrorMsg("Please upload an image");
      return;
    }

    setUploading(true);
    setErrorMsg("");

    try {
      const createResponse = await createrequest.createRequest({
        patientId: pid,
        comments: comments
      });

      if (createResponse.status === 200) {
        const aid = createResponse.data.appointmentId;
        const formData = new FormData();
        formData.append("image", file);
        formData.append("aid", aid);

        const uploadResponse = await uploadImage.upload(formData);

        if (uploadResponse.status === 200) {
          toast.success("Request created successfully!");
          navigate(`/home/${pid}`);
          window.location.reload();
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
      <CreateRequestNavbar />
      <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "linear-gradient(135deg, #e3eaff 0%, #f8f9fa 100%)"
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: "#4051B5", mb: 2, textAlign: "center" }}
          >
            Create New Request
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "#555", mb: 4, textAlign: "center" }}
          >
            Upload an image and submit your query for diagnosis
          </Typography>

          <Box sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Patient Query"
              variant="outlined"
              multiline
              rows={6}
              value={comments}
              onChange={handleCommentsChange}
              placeholder="Please describe your symptoms or concerns..."
              sx={{
                mb: 3,
                fontSize: "1.1rem",
                fontWeight: 500,
              }}
            />

            <Box
              sx={{
                width: `${UPLOAD_WIDTH}px`,
                margin: "0 auto",
                border: "2px dashed #1976d2",
                borderRadius: 3,
                p: 2,
                textAlign: "center",
                backgroundColor: "#f5f7fa",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "#4051B5",
                },
                mb: 3,
                transition: "border-color 0.3s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "110px",
                boxSizing: "border-box", // Ensures border is included in width
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
              <CloudUploadIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
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
                  width: `${UPLOAD_WIDTH}px`,
                  margin: "0 auto"
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

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2, width: `${UPLOAD_WIDTH}px`, margin: "0 auto" }}>
                {errorMsg}
              </Alert>
            )}

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={uploading}
              sx={{
                width: `${UPLOAD_WIDTH}px`,
                margin: "0 auto",
                mt: 2,
                px: 0,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: "8px",
                textTransform: "none",
                background: "linear-gradient(90deg, #4051B5 60%, #1976d2 100%)",
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(64,81,181,0.08)",
                "&:hover": {
                  background: "linear-gradient(90deg, #303f9f 60%, #1565c0 100%)",
                },
                display: "block"
              }}
            >
              {uploading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Request"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CreateRequest;
