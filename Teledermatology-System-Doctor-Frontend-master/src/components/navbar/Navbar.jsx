import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import {useNavigate, useParams} from 'react-router-dom';
import logout from "../../services/Logout";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function Navbar(props) {
    const classes = useStyles();
    const navigate = useNavigate();
    // const pid=props.pid;
    // console.log("Inside navbar",pid)
    const {did}=useParams();
    console.log("Here Navbar",did);
    const handleLogout=()=>{
        navigate(`/`);
    };
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Teledermatology System
                    </Typography>
                    <Button color="inherit" onClick={()=>navigate(`/home/${did}`)}>Home</Button>
                    <Button color="inherit" onClick={()=>navigate(`/makediagnosis/${did}`)}>Make Diagnosis</Button>
                    <Button color="inherit" onClick={()=>handleLogout()}>Logout</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;


