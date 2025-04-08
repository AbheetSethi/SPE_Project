import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import axios from "axios";
import register from "../../services/Register";
import {useNavigate} from "react-router-dom";
import Home from "../home/Home";
import Navbar from "../../components/navbar/Navbar";

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(2),
    },
    textField: {
        margin: theme.spacing(1),
        width: '25ch',
    },
    button: {
        margin: theme.spacing(3, 0, 2),
    },
}));
export default function Register() {
    const navigate=useNavigate();
    const classes = useStyles();
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [email, setEmail] = useState('');
    const [did, setDid] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null);
    const getCookie = (name) => {
        const cookieString = document.cookie;
        if (cookieString.length > 0) {
            const cookieArray = cookieString.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
                const cookie = cookieArray[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    return decodeURIComponent(cookie.substring(name.length + 1));
                }
            }
        }
        return null;
    }
    useEffect(() => {
        // check for the token in cookies when the component mounts
        const tokenFromCookie = getCookie('token');
        if (tokenFromCookie) {
            setToken(tokenFromCookie);
        }
    }, []);
    const handleSubmit = async (event) => {
        // event.preventDefault();
        console.log(`Email: ${email}\nPassword: ${password}`);
        const data={
            'did':did,
            'aadhaar':aadhar,
            'fname':fname,
            'lname':lname,
            'email':email,
            'pass':password,
            'role':''
        }
        console.log(data)
        const res=await register.register_doctor(data)
        console.log(res)
        navigate(`/home/${res.data.did}`)
    };
    return (
        <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
                className={classes.textField}
                label="Doctor ID"
                value={did}
                onChange={(event) => setDid(event.target.value)}
            />
            <TextField
                className={classes.textField}
                label="First Name"
                value={fname}
                onChange={(event) => setFname(event.target.value)}
            />
            <TextField
                className={classes.textField}
                label="Last Name"
                value={lname}
                onChange={(event) => setLname(event.target.value)}
            />
            <TextField
                className={classes.textField}
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
                className={classes.textField}
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <TextField
                className={classes.textField}
                label="Aadhaar"
                value={aadhar}
                onChange={(event) => setAadhar(event.target.value)}
            />
            <Button onClick={()=>{handleSubmit()}}
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    type="submit"
            >
                Register
            </Button>
        </form>
    );
}
