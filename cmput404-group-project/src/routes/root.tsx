import { Outlet, Link } from "react-router-dom";

export default function Root() {
    return (
      <>
        <div id="navbar">
          <h1>Social Enterprise</h1>
          <nav>
            <ul>
            <li>
              <Link to={`/`}>Home Page</Link>
              </li>
              <li>
              <Link to={`AboutUs`}>About Us</Link>
              </li>
              <li>
              <Link to={`SignIn`}>Sign In / Up</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div id="detail">
        <Outlet />
        </div>
      </>
    );
  }