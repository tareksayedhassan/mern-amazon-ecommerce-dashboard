import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./Router/Router";
import "./css/media.css";
import MenuContext from "./context/menuContext";
import WindowContext from "./context/WindowContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WindowContext>
      <MenuContext>
        <RouterProvider router={Router} />
      </MenuContext>
    </WindowContext>
  </React.StrictMode>
);
