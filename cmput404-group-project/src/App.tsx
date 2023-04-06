import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/home-page.page";
import ErrorPage from "./error-page";
import AboutUs from "./pages/about-us.page";
import SignIn from "./pages/sign-in.page";
import FeedPage from "./pages/feed.page";
import NewPost from "./components/NewPost";
import EditPost from "./components/EditPost";
import Profile from "./pages/profile.page";

export function createApp() {
  const App = () => (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/AboutUs" element={<AboutUs />} /> */}
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/Feed" element={<FeedPage />} />
        <Route path="/newPost" element={<NewPost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editPost" element={<EditPost />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );

  return {
    App: <App />,
  };
}

export default createApp().App;
