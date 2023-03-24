import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Avatar, Badge, Divider, IconButton, List, Menu, MenuItem, Tooltip } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

function Navbar() {
  const [click, setClick] = useState(false);
  const [user, setUser] = useState(null);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  let signInSignOut;
  let homePageFeed;
  let profile;
  let notificationBell;

  React.useEffect(() => {
    if (localStorage.getItem('user') != null) {
      setUser(JSON.parse(localStorage.getItem('user')!));
  }}, []);

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  const handleList = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    tempNotifs.length = 0;
  };

  var tempNotifs = ["Kyle liked your post", "Jacob wants to be your friend", "Jaden is dumb"];
  const noPointer = {cursor: 'default'};

  if (user == null) {
    console.log("USER IS NULL", localStorage.getItem('user'));
    signInSignOut = 
    <NavLink
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

    notificationBell = 
      <div
        className="nav-links"
      >
        <Tooltip title="Notifications">
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleList}
            color="inherit"
          >
            <Badge badgeContent={tempNotifs.length} color="error">
              <NotificationsIcon />
            </Badge>
            {/* <Avatar sx={{ bgcolor: deepOrange[500] }}>{user.displayName[0].charAt(0).toUpperCase()}</Avatar> */}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 20,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {tempNotifs.map((notif) => (
            <MenuItem style={noPointer}>{notif}</MenuItem>
          ))}
        </Menu>
      </div>
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
            {/* <li className="nav-item">

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

            </li> */}
            {user !== null ?
              <li className="nav-item">

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                  style={{ textDecoration: 'none' }}
                >
                  Profile
                </NavLink>

              </li>
              : null}
            <li className="nav-item">
              {signInSignOut}
            </li>
            <li className="nav-item">
              {notificationBell}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;