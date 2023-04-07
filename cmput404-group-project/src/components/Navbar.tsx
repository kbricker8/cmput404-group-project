//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Avatar, Badge, Divider, IconButton, List, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import { OUR_API_URL } from '../consts/api_connections';
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';

function Navbar() {
  const [click, setClick] = useState(false);
  const [user, setUser] = useState(null);
  const [inbox, setInbox] = React.useState([]);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const token = JSON.parse(localStorage.getItem('token')!);

  let signInSignOut;
  let homePageFeed;
  let profile;
  let notificationBell;
  let notifType;

  // let badgeNumber;

  React.useEffect(() => {
    if (localStorage.getItem('user') != null) {
      setUser(JSON.parse(localStorage.getItem('user')!));
    }

    const getInbox = axios.get(`${OUR_API_URL}service/authors/${localStorage.getItem('USER_ID')!}/inbox`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then((response) => {
      setInbox(response.data.items);
      console.log("INBOX: " + response)
      // badgeNumber = response.data.items.length;
    });
  }, []);

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
    // inbox.length = 0;
  };

  const noPointer = {cursor: 'default'};

  const handleClear = () => {
    axios.post(`${OUR_API_URL}service/authors/${localStorage.getItem('USER_ID')!}/inbox/clear/`, {}, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    setAnchorEl(null);
    // badgeNumber = 0;
  };


  if (user == null) {
    console.log("USER IS NULL", localStorage.getItem('USER_ID'));
    signInSignOut = 
    <NavLink
      to="/cmput404-group-project/SignIn"
      className={({ isActive }) =>
        "nav-links" + (isActive ? " activated" : "")
      }
      onClick={closeMobileMenu}
      style={{ textDecoration: 'none', textDecorationColor: 'white' }}
    >
      Sign In
    </NavLink>

    homePageFeed = <NavLink
      to="/cmput404-group-project/"
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
      to="/cmput404-group-project/"
      className={({ isActive }) =>
        "nav-links" + (isActive ? " activated" : "")
      }
      onClick={() => { setUser(null); localStorage.removeItem('user'); closeMobileMenu(); }}
      style={{ textDecoration: 'none', textDecorationColor: 'white' }}
    >
      Sign Out
    </NavLink>
    homePageFeed = <NavLink
      to="/cmput404-group-project/feed"
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
            <Badge 
              // badgeContent={badgeNumber}
              badgeContent={inbox.length} 
              color="error">
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
          {inbox.map((notif) => (
            (notif.type == "FollowRequest") || (notif.type == "Like")
              ? <MenuItem style={noPointer}>{notif.summary}</MenuItem>
              : ((notif.type == "comment")
                ? <MenuItem style={noPointer}>{notif.author.displayName} commented "{notif.comment}"</MenuItem>
                : null)
            // likes, follow requests have summaries
            // comments and posts do not
          ))}
          <Divider />
          <MenuItem onClick={handleClear}>
            <ListItemIcon>
              <DeleteIcon fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Clear All Notifications</ListItemText>
          </MenuItem>
        </Menu>
      </div>
  }


  return (
    <>
      <nav className="navbar">
        <div className="navbar-container container">
          <Link to="/cmput404-group-project/" className="navbar-logo" onClick={closeMobileMenu} style={{ textDecoration: 'none' }}>
            Social Distribution
          </Link>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              {homePageFeed}
            </li>
            {user !== null ?
              <li className="nav-item">

                <NavLink
                  to="/cmput404-group-project/profile"
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