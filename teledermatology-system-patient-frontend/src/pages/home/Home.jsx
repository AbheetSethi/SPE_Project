import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Box
} from "@mui/material";
import moment from "moment";
import { toast } from "react-toastify";
import viewall from "../../services/Viewall";
import HomeNavbar from "../../components/navbar/HomeNavbar";
import "./home.css";

const Home = () => {
  const { pid } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusBadgeStyle = (status) => {
    const styles = {
      Completed: { backgroundColor: "#e6f7ee", color: "#0d904f" },
      "In Progress": { backgroundColor: "#fff4e5", color: "#ab6100" },
      Pending: { backgroundColor: "#f8f9fa", color: "#666" }
    };
    return styles[status] || styles.Pending;
  };

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
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead sx={{ backgroundColor: "#e8eaf6" }}>
                  <TableRow>
                    <TableCell>Appointment ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Doctor Comments</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.aid}>
                      <TableCell>{record.aid}</TableCell>
                      <TableCell>{moment(record.createdate).format("MMM D, YYYY")}</TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: "inline-block",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          ...getStatusBadgeStyle(record.status),
                          fontWeight: 500
                        }}>
                          {record.status || "Pending"}
                        </Box>
                      </TableCell>
                      <TableCell>{record.dcomments || "No comments yet"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Home;
