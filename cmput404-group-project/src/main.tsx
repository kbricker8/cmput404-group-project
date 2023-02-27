import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import HomePage from "./routes/home-page";
import ErrorPage from "./error-page";
import AboutUs from "./routes/about-us";
import SignIn from "./routes/sign-in";
import SignUp from "./routes/sign-up";
import Navbar from "./components/NavBar";

// const AppLayout = () => {
//   return (
//     <>
//     <Navbar />
//     <Outlet />
//     </>
//   )
// }

const router = createBrowserRouter([
  {
    element: <Root />,
    // element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "AboutUs",
        element: <AboutUs />,
      },
      {
        path: "SignIn",
        element: <SignIn />,
      },
      {
        path: "SignUp",
        element: <SignUp />,
      }
    ]
  },

]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
