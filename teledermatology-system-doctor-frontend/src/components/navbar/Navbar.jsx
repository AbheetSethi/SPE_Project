import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        backgroundColor: '#f0f4f8',
        color: '#0a3d62',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e0e0e0',
    },
    title: {
        flexGrow: 1,
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    button: {
        marginLeft: theme.spacing(2),
        backgroundColor: '#0a3d62',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#074a83',
        },
        borderRadius: '8px',
        textTransform: 'none',
        padding: '6px 16px',
    },
}));

const Navbar = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const { did } = useParams();

    const handleLogout = () => {
        navigate(`/`);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        🩺 Teledermatology System
                    </Typography>
                    <Box>
                        <Button className={classes.button} onClick={() => navigate(`/home/${did}`)}>Home</Button>
                        <Button className={classes.button} onClick={() => navigate(`/makediagnosis/${did}`)}>Make Diagnosis</Button>
                        <Button className={classes.button} onClick={handleLogout}>Logout</Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;
