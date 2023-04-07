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
import NewPost from "./components/NewPost";
import EditPost from "./components/EditPost";
import Profile from "./routes/profile";


const basename = "cmput404-group-project" || '';

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: `${basename}/`,
        element: <HomePage />,
      },
      // {
      //   path: `${basename}/AboutUs`,
      //   element: <AboutUs />,
      // },
      {
        path: `${basename}/SignIn`,
        element: <SignIn />,
      },
      {
        path: `${basename}/Feed`,
        element: <FeedPage />,
      },
      {
        path: `${basename}/newPost`,
        element: <NewPost />,
      },
      {
        path: `${basename}/profile`,
        element: <Profile />,
      },
      {
        path: `${basename}/editPost`,
        element: <EditPost />,
      },
    ]
  },
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router}  />
  </React.StrictMode>
);
