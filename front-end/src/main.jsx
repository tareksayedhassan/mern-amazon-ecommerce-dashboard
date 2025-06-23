import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Router from "./Router/Router";
import "./css/media.css";
import MenuContext from "./context/menuContext";
import WindowContext from "./context/WindowContext";
import { PrimeReactProvider } from "primereact/api";
import { CartProvider } from "./context/CartContext";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import "./index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CartProvider>
      <PrimeReactProvider>
        <WindowContext>
          <MenuContext>
            <RouterProvider router={Router} />
          </MenuContext>
        </WindowContext>
      </PrimeReactProvider>
    </CartProvider>
  </React.StrictMode>
);
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
