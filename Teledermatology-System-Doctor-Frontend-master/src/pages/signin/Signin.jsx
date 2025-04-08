import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, TextField, FormControlLabel, Checkbox, Grid, Box, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import signin from "../../services/Signin";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import app from "../../App";
import Home from "../home/Home";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Login = () => {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate=useNavigate();
    const [did_1, setDid]=useState('Random');
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    const setCookie = (name, value, days) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + expires.toUTCString() + ';path=/';
    }


    const token = getCookie("token")
    // function to set a cookie
    // const setCookie = (name, value, days) => {
    //     const expires = new Date();
    //     expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    //     document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + expires.toUTCString() + ';path=/';
    // }

    // function to remove a cookie
    // const removeCookie = (name) => {
    //     document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // }

    // function to handle user login
    const handleLogin = (event) => {

        try {
            event.preventDefault();
            console.log(`Username: ${username}, Password: ${password}`);
            const bodyParameters = {
                'email': username,
                'pass': password
            }
            // setToken(response.data.token);
            console.log(bodyParameters)
            signin.login(bodyParameters)
                .then((response) => {
                    if (response.status === 200) {
                        console.log(response)
                        console.log("From Response", response.data.did)
                        console.log(response.data.did)
                        setDid(response.data.did)
                        console.log("After Setting", {did_1})
                        toast.success("Logged in successfully")
                        console.log("response here"+response)
                        console.log("inside",response.data.did)
                        // navigate('/home/',{state:{pid:response.data.pid}})
                        // navigate('/home')
                        // nav(`/new-consent-request/${did}/${name}`)
                        navigate(`/home/${response.data.did}`)
                        // <Link to=
                        console.log("HI")
                    }
                })
                .catch((error) => {
                    console.log(error)
                    navigate("/")
                    toast.error("Error Logging In!!", {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })

                });
            // setCookie('token', response.getData(), 7);
            // const pid=response.data.pid
            // console.log(document.cookie)
            // setToken(response.data.token);
            // setCookie('token', response.data.token, 7);
        } catch (error) {
            console.error(error);
        }
    }
    // function to handle user logout
    const handleLogout = () => {
        axios.get("http://localhost:8092/patient_end/api/v1/auth/logout");
    }
    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={handleLogin}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid item>
                        <Link to="/register" variant="body2">
                            {"Don't have an account? Register"}
                        </Link>
                    </Grid>
                </form>
            </div>
            {/*<ToastContainer*/}
            {/*    position="top-center"*/}
            {/*    autoClose={5000}*/}
            {/*    hideProgressBar={false}*/}
            {/*    newestOnTop={false}*/}
            {/*    closeOnClick*/}
            {/*    rtl={false}*/}
            {/*    pauseOnFocusLoss*/}
            {/*    draggable*/}
            {/*    pauseOnHover*/}
            {/*/>*/}
        </Container>
    );
};

export default Login;