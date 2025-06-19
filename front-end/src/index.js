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
import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PrimeReactProvider>
      <WindowContext>
        <MenuContext>
          <RouterProvider router={Router} />
        </MenuContext>
      </WindowContext>
    </PrimeReactProvider>
  </React.StrictMode>
);
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
