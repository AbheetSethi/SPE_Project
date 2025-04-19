import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate, useParams } from 'react-router-dom';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#4051B5',
    color: '#fff',
  },
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '10px',
  },
  button: {
    margin: '0 5px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    borderRadius: '5px',
    textTransform: 'none',
  }
}));

const Navbar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { pid } = useParams();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <HealthAndSafetyIcon className={classes.icon} /> 
            Teledermatology System
          </Typography>
          <Box>
            <Button className={classes.button} onClick={() => navigate(`/home/${pid}`)}>HOME</Button>
            <Button className={classes.button} onClick={() => navigate(`/createrequest/${pid}`)}>NEW REQUEST</Button>
            <Button className={classes.button} onClick={() => navigate(`/viewdiagnosis/${pid}`)}>VIEW DIAGNOSIS</Button>
            <Button className={classes.button} onClick={handleLogout}>LOGOUT</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
