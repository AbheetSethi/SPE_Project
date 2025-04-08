import CssBaseline from '@mui/material/CssBaseline';
import Navbar from "../../components/navbar/Navbar";
import {Paper, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Modal, Table, TabPanel} from "@mui/joy";
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Card, CardMedia, Typography} from '@material-ui/core';
import async from "async";
import {useLocation, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Box from '@mui/material/Box';
import viewall from "../../services/Viewall";
import fetch from "../../services/Fetchimage";
// import "react-image-lightbox/style.css";
const useStyles = makeStyles((theme) => ({
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
}));

export default function Makediagnosis(){
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        scrollY: true,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        // boxShadow: 24,
        p: 4,
    };
    const {did}=useParams();
    const [imageData, setImageData] = useState('');
    console.log("Here Makediagnosis",did);
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);
    const [token, setToken] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const classes = useStyles();
    console.log("Here Makediagnosis",did);
    const [blobUrl, setBlobUrl] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // const openModal = () => {
    //     setModalIsOpen(true);
    //     console.log(imageData)
    // };
    // const closeModal = () => {
    //     setModalIsOpen(false);
    // }

    useEffect(() => {
        if (modalIsOpen) {
            viewimage();
        }
    }, [modalIsOpen]);

    const openModal = () => {
        console.log("Inside openmodal")
        setModalIsOpen(true);
        console.log("openmodal value",modalIsOpen)
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setImageData('');
    };
    const viewimage= async(aid)=>{
        console.log("inside viewimage",aid)
        // const data={
        //     "aid":aid
        // }
        setIsOpen(true)
        fetch.fetchimage(aid)
            .then((response) => {
                console.log("image fetched",response)
                const blob = response.data;
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result;
                    setImageData(base64data);
                    console.log(imageData)
                };
                reader.readAsDataURL(blob);
                console.log("Fetchimage response",response);
                // openModal();
                if (response.status === 200) {
                    toast.success("Successfully created request!!", {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }
            })
    }
    useEffect(() => {
        console.log("HI")
        const fetchData = async () => {
            // {console.log(props.pid)}
            // const data={
            //     'pid':pid,
            //     'aid':''
            // }
            try {
                console.log(did)
                viewall.pastdata()
                    .then((response) => {
                        console.log("response from getpast",response);
                        setRecords(response.data);
                        if (response.status === 200) {
                            toast.success("Successfully created request!!", {
                                position: "bottom-right",
                                autoClose: 1000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            })
                        }
                    })

            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };
        fetchData();
    },[]);
    return(
        <>
            <Navbar/>
            {/*<div>*/}
            {/*    {imageData ? (*/}
            {/*        <img src={imageData} alt="Image" />*/}
            {/*    ) : (*/}
            {/*        <p>Loading image...</p>*/}
            {/*    )}*/}
            {/*</div>*/}
            {console.log(records)}
            {!loading && records.length==0?<>No past diagnosis Present</>:<></>}
            {!loading && records.length!==0?
                ( <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 550}} aria-label="simple table">
                            <TableHead sx={{ backgroundColor:"whitesmoke" }}>
                                <TableRow>
                                    <TableCell align="left"
                                        // sx={{ fontWeight: 'bold' }}
                                    >APPOINTMENT ID</TableCell>
                                    <TableCell align="left"
                                        // sx={{ fontWeight: 'bold' }}
                                    >CREATE DATE</TableCell>
                                    <TableCell align="left"
                                        // sx={{ fontWeight: 'bold' }}
                                    >VIEW IMAGE</TableCell>
                                    <TableCell align="left"
                                        // sx={{ fontWeight: 'bold' }}
                                    >ML DIAGNOSIS</TableCell>
                                    <TableCell align="center"
                                        // sx={{ fontWeight: 'bold' }}
                                    >DOCTOR DIAGNOSIS</TableCell>
                                    <TableCell align="left"
                                        // sx={{ fontWeight: 'bold' }}
                                    >DOCTOR COMMENTS</TableCell>
                                    <TableCell align="left"
                                        // sx={{ fontWeight: 'bold' }}
                                    >PATIENT COMMENTS</TableCell>
                                    <TableCell align="left"
                                        // sx={{ fontWeight: 'bold' }}
                                    >STATUS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ backgroundColor:"white" }}>
                                { !loading && records.map((row) => (
                                    <TableRow
                                        key={row.aid}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{row.aid}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {moment(row.createdate).format("MMMM D, YYYY")}
                                        </TableCell>
                                        {/*<TableCell><button onClick={()=>viewimage(row.aid)} >View Image</button></TableCell>*/}
                                        <TableCell><button onClick={()=>{viewimage(row.aid); openModal();}} >View Image</button></TableCell>
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
                ):<></>}
            <div>
                <br/>
                <br/>
                {imageData ? (
                    <img src={imageData} alt="Image" />
                ) : (
                    <p>Loading image...</p>
                )}
            </div>
            {/*<div>*/}
            {/*    {modalIsOpen ?(*/}
            {/*        <Modal show={openModal} onHide={closeModal}>*/}
            {/*            {console.log("Inside actual modal",imageData)}*/}
            {/*            {imageData ? (*/}
            {/*                <img src={imageData} alt="Image" />*/}
            {/*            ) : (*/}
            {/*                <p>Loading image...</p>*/}
            {/*            )}*/}
            {/*        </Modal>*/}
            {/*    ):<></>}*/}
            {/*</div>*/}

            {/*{modalIsOpen ?(*/}
            {/*    <Modal*/}
            {/*        keepMounted*/}
            {/*        aria-labelledby="keep-mounted-modal-title"*/}
            {/*        open={modalIsOpen}*/}
            {/*        // className={id}*/}
            {/*        onClose={closeModal}*/}
            {/*        contentLabel="Image Modal"*/}
            {/*    >*/}
            {/*        {console.log("Inside actual modal")}*/}
            {/*        <Box sx={style}>*/}
            {/*            {console.log("Inside Box")}*/}
            {/*            /!*{imageData ? (*!/*/}
            {/*            /!*    <img src={imageData} alt="Image" />*!/*/}
            {/*            /!*) : (*!/*/}
            {/*            /!*    <p>Loading image...</p>*!/*/}
            {/*            /!*)}*!/*/}
            {/*            <Typography  id="keep-mounted-modal-description" sx={{ mt: 2 ,whiteSpace:"pre"}}>*/}
            {/*                <div>*/}
            {/*                    <img src={imageData} alt="Image" />*/}
            {/*                </div>*/}
            {/*            </Typography>*/}
            {/*            <button onClick={closeModal}>Close Modal</button>*/}
            {/*        </Box>*/}
            {/*    </Modal>):<></>}*/}
        </>
    );
};


// const getCookie = (name) => {
//     const cookieString = document.cookie;
//     console.log(cookieString)
//     if (cookieString.length > 0) {
//         const cookieArray = cookieString.split(';');
//         for (let i = 0; i < cookieArray.length; i++) {
//             const cookie = cookieArray[i].trim();
//             console.log(cookie)
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 return decodeURIComponent(cookie.substring(name.length + 1));
//             }
//         }
//     }
//     return null;
// }
// useEffect(() => {
//     // check for the token in cookies when the component mounts
//     const tokenFromCookie = getCookie('_xsrf');
//     console.log("token here",token)
//     if (tokenFromCookie) {
//         setToken(tokenFromCookie);
//     }
// }, []);