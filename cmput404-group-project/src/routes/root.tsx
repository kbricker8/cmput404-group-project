import { Outlet, Link } from "react-router-dom";

export default function Root() {
    return (
      <>
        <div id="sidebar">
          <h1>Social Enterprise</h1>
          <nav>
            <ul>
              <li>
              <Link to={`AboutUs`}>About Us</Link>
              </li>
              <li>
              <Link to={`SignIn`}>Sign In / Up</Link>
              </li>
            </ul>
          </nav>
        </div>
        <p>
          Welcome to the Social Enterprise! This is a social media platform for the goons in cmput 404
        </p>
        <div id="detail">
        <Outlet />
        </div>
      </>
    );
  }