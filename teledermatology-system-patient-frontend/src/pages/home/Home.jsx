import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Button,
  Modal,
  TablePagination,
} from "@mui/material";
import moment from "moment";
import { toast } from "react-toastify";
import viewall from "../../services/Viewall";
import fetch from "../../services/Fetchimage";
import HomeNavbar from "../../components/navbar/HomeNavbar";
import "./home.css";

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

const Home = () => {
  const { pid } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageData, setImageData] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await viewall.pastdata(pid);
        setRecords(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load diagnosis history");
        setLoading(false);
      }
    };
    fetchData();
  }, [pid]);

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

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Slice data for pagination
  const paginatedRecords = records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <HomeNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: "#f8f9fa" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: "#4051B5", mb: 3 }}>
            Previous Diagnoses
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress sx={{ color: "#4051B5" }} />
            </Box>
          ) : records.length === 0 ? (
            <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body1" color="textSecondary">
                No previous diagnoses found
              </Typography>
            </Paper>
          ) : (
            <Paper elevation={2}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: "#e8eaf6" }}>
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
                    {paginatedRecords.map((row) => (
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
                        <TableCell align="center">{row.mldiagnosis || "—"}</TableCell>
                        <TableCell align="center">{row.docdiagnosis || "—"}</TableCell>
                        <TableCell align="center">{row.dcomments || "—"}</TableCell>
                        <TableCell align="center">{row.pcomments || "—"}</TableCell>
                        <TableCell align="center">{row.status || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={records.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ px: 2 }}
              />
            </Paper>
          )}
        </Paper>
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

export default Home;
