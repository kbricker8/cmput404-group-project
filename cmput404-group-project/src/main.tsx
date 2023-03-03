import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.css';
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
import FeedPage from "./routes/feed";

// import Feed from "./routes/feed";
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
        path: "Feed",
        element: <FeedPage />,
      }
    ]
  },

]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
