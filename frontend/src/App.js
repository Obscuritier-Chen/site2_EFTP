import React from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/home';
import Signup from "./pages/signup";
import Login from './pages/login';
import Upload from './pages/upload';
import Display from "./pages/display";
import Search from "./pages/search";

const App=()=>{
    return(
        <Router>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/signup" element={<Signup/>}/>
                <Route exact path="/login" element={<Login/>}/>
                <Route exact path="/upload/*" element={<Upload/>}/>
                <Route exact path="/display/*" element={<Display/>}/>
                <Route exact path="/search/*" element={<Search/>}/>
            </Routes>
        </Router>
    );
};

export default App;