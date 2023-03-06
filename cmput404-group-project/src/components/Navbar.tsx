import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [click, setClick] = useState(false);
  const [user, setUser] = useState(null);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  let signInSignOut;
  let homePageFeed;
  React.useEffect(() => {
    if (localStorage.getItem('user') != null) {
      setUser(JSON.parse(localStorage.getItem('user')!));
    }

  }, []);
  if (user == null) {
    console.log("USER IS NULL", localStorage.getItem('user'));
    signInSignOut = <NavLink
      to="/SignIn"
      className={({ isActive }) =>
        "nav-links" + (isActive ? " activated" : "")
      }
      onClick={closeMobileMenu}
      style={{ textDecoration: 'none', textDecorationColor: 'white' }}
    >
      Sign In
    </NavLink>
    homePageFeed = <NavLink
      to="/"
      className={({ isActive }) =>
        "nav-links" + (isActive ? " activated" : "")
      }
      onClick={closeMobileMenu}
      style={{ textDecoration: 'none' }}
    >
      Home Page
    </NavLink>
  } else {
    console.log("USER IS NOT NULL", localStorage.getItem('user'));
    signInSignOut = <NavLink
      to="/"
      className={({ isActive }) =>
        "nav-links" + (isActive ? " activated" : "")
      }
      onClick={() => { setUser(null); localStorage.removeItem('user'); closeMobileMenu(); }}
      style={{ textDecoration: 'none', textDecorationColor: 'white' }}
    >
      Sign Out
    </NavLink>
    homePageFeed = <NavLink
      to="/feed"
      className={({ isActive }) =>
        "nav-links" + (isActive ? " activated" : "")
      }
      onClick={closeMobileMenu}
      style={{ textDecoration: 'none' }}
    >
      Feed
    </NavLink>
  }


  return (
    <>
      <nav className="navbar">
        <div className="navbar-container container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu} style={{ textDecoration: 'none' }}>
            Social Distribution
          </Link>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              {homePageFeed}
            </li>
            <li className="nav-item">

              <NavLink
                to="/AboutUs"
                className={({ isActive }) =>
                  "nav-links" + (isActive ? " activated" : "")
                }
                onClick={closeMobileMenu}
                style={{ textDecoration: 'none' }}
              >
                About
              </NavLink>

            </li>
            <li className="nav-item">
              {signInSignOut}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;