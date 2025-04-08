import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Signin from "./pages/signin/Signin";
import Makediagnosis from "./pages/makediagnosis/Makediagnosis";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
function App()
{
    return (
        <Router>
            <div>
                <Routes>
                    <Route exact path="/" element={<Signin/>}/>
                    <Route exact path="/home/:pid" element={<Home/>}/>
                    <Route exact path="/register" element={<Register/>}/>
                    <Route exact path="/makediagnosis" element={<Makediagnosis/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;