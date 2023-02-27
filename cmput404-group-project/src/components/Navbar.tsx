// import React from "react";
// import { Outlet, Link, NavLink } from "react-router-dom";
// import "./Navbar.css";

// function Navbar() {
//     return (
//         <>
//         <nav className="navbar">
//             <div className="navbar-container container">
//                 <Link to={`/`}>
//                     Home Page
//                 </Link>

//                 <Link to={`AboutUs`}>
//                     About Us
//                 </Link>

//                 <Link to={`SignIn`}>
//                     Sign In / Up
//                 </Link>
//             </div>
//         </nav>
//         </>
//     );
// }

// export default Navbar;


import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>
        <nav className="navbar">
          <div className="navbar-container container">
            <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                Social Distribution
            </Link>
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  Home Page
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/AboutUs"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/SignIn"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  Sign In
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
    </>
  );
}

export default Navbar;