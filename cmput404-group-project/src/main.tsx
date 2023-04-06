import React from "react";
import ReactDOM from "react-dom";
import { createApp } from "./App";
import "bootstrap/dist/css/bootstrap.css";

const { App} = createApp();

ReactDOM.render(
  <React.StrictMode>
    {App}
  </React.StrictMode>,
  document.getElementById("root")
);
