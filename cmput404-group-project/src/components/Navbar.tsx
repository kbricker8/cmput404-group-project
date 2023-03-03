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
            <Link to="/" className="navbar-logo" onClick={closeMobileMenu} style={{textDecoration: 'none'}}>
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
                  style={{textDecoration: 'none'}}
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
                  style={{textDecoration: 'none'}}
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
                  style={{textDecoration: 'none', textDecorationColor: 'white'}}
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