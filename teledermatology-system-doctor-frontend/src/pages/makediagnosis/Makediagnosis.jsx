import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Modal,
  CircularProgress,
} from "@mui/material";
import moment from "moment";
import viewall from "../../services/Viewall";
import fetch from "../../services/Fetchimage";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#f5faff",
  border: "2px solid #1976d2",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const Makediagnosis = () => {
  const { did } = useParams();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [imageData, setImageData] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await viewall.pastdata();
        setRecords(response.data);
        if (response.status === 200) {
          toast.success("Successfully fetched past diagnoses!", {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        toast.error("Failed to fetch past diagnoses.");
      }
      setLoading(false);
    };
    fetchData();
  }, [did]);

  const handleViewImage = async (aid) => {
    setModalIsOpen(true);
    setImageData("");
    try {
      const response = await fetch.fetchimage(aid);
      const blob = response.data;
      const reader = new FileReader();
      reader.onloadend = () => setImageData(reader.result);
      reader.readAsDataURL(blob);
    } catch (error) {
      toast.error("Failed to fetch image.");
      setModalIsOpen(false);
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setImageData("");
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: "#1976d2" }}>
          Past Diagnoses
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : records.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", background: "#fff8f0" }}>
            <Typography variant="h6" color="text.secondary">
              No past diagnosis present.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Appointment ID</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Create Date</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>View Image</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>ML Diagnosis</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Doctor Diagnosis</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Doctor Comments</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Patient Comments</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((row) => (
                  <TableRow key={row.aid} hover>
                    <TableCell align="center">{row.aid}</TableCell>
                    <TableCell align="center">{moment(row.createdate).format("MMMM D, YYYY")}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ borderRadius: 2, textTransform: "none" }}
                        onClick={() => handleViewImage(row.aid)}
                      >
                        View Image
                      </Button>
                    </TableCell>
                    <TableCell align="center">{row.mldiagnosis}</TableCell>
                    <TableCell align="center">{row.docdiagnosis}</TableCell>
                    <TableCell align="center">{row.dcomments}</TableCell>
                    <TableCell align="center">{row.pcomments}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <Modal
        open={modalIsOpen}
        onClose={handleCloseModal}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="image-modal-title" variant="h6" sx={{ mb: 2 }}>
            Diagnosis Image
          </Typography>
          {imageData ? (
            <img
              src={imageData}
              alt="Diagnosis"
              style={{
                maxWidth: "100%",
                maxHeight: 300,
                borderRadius: 8,
                marginBottom: 16,
                border: "1px solid #ddd",
              }}
            />
          ) : (
            <CircularProgress />
          )}
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, mt: 2, px: 4 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Makediagnosis;
