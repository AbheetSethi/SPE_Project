import React from 'react';
import {
  Container,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  Box,
  Paper,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
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
  backgroundColor: '#1976d2',
}));

export default function Signin() {
  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <StyledAvatar>
          <LockIcon />
        </StyledAvatar>
        <Typography component="h1" variant="h5" fontWeight="600" color="primary">
          Welcome to DermaCare
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Sign in to your account
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, borderRadius: 2 }}
          >
            Sign In
          </Button>
          <Box textAlign="center">
            <Link href="/register" variant="body2">
              {"Don't have an account? Register"}
            </Link>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
}
