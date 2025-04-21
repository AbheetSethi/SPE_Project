import React from 'react';
import {
  Container,
  Avatar,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.spacing(2),
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: '#1976d2', // Match the blue from sign-in
}));

export default function Register() {
  return (
    <Container component="main" maxWidth="sm">
      <StyledPaper elevation={3}>
        <StyledAvatar>
          <PersonAddIcon />
        </StyledAvatar>
        <Typography component="h1" variant="h5" fontWeight="600" color="primary" sx={{ color: '#1976d2' }}>
          Patient Registration
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Sign up for your DermaCare account
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {/* Optional: Add Patient ID if needed
            <Grid item xs={12}>
              <TextField fullWidth label="Patient ID" name="patientId" required />
            </Grid>
            */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="First Name" name="firstName" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Last Name" name="lastName" required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email Address" name="email" type="email" required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Password" name="password" type="password" required />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: 2,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Register
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
}
