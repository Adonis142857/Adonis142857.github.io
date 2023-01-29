import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Outext from "./Outext";
import Store from "./store";

ReactDOM.render(
  <React.StrictMode>
    <Store>
      <Outext />
    </Store>
  </React.StrictMode>,
  document.getElementById("root")
);
