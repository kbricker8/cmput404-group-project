import { Outlet, Link } from "react-router-dom";
import {Route, Router, Routes} from "react-router";
import Navbar from "../components/Navbar";

import AboutUs from "./about-us";
import SignIn from "./sign-in";
import Home from "./home-page";
import NavBar from "./navbar";
export default function Root() {
    return (

        <div id="navbar">
            <div>
              <Navbar/>
              <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="aboutUs" element={<AboutUs/>} />
                <Route path="signIn" element={<SignIn/>} />
                </Routes>
            </div>
            
        </div>
    );
  }