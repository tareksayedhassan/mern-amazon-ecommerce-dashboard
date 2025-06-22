import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "./Error/Error";
import RequiredAuth from "../auth/RequiredAuth";
import RoleBasedRoute from "../auth/RoleBasedRoute";

// Lazy Loaded Components
const Register = lazy(() => import("../auth/register"));
const Login = lazy(() => import("../auth/login"));
const Home = lazy(() => import("../Componens/pages/website/Home"));
const showCategories = lazy(() =>
  import("../Componens/pages/Categories/ShowCategories")
);
const ShowProducts = lazy(() =>
  import("../Componens/pages/Categories/showProductsByCategories/ShowProducts")
);

const Users = lazy(() => import("../Dashboard/pages/users/Users"));
const EditUser = lazy(() => import("../Dashboard/pages/users/EditUser"));
const AddUser = lazy(() => import("../Dashboard/pages/users/AddUser"));
// dashboard
const Dashboard = lazy(() => import("../Dashboard/dashboard/Dashboard"));
const Categories = lazy(() =>
  import("../Dashboard/pages/Categorys/categories")
);
const AddCategory = lazy(() =>
  import("../Dashboard/pages/Categorys/AddCategory")
);
const EditCategory = lazy(() =>
  import("../Dashboard/pages/Categorys/EditCategory")
);
const Products = lazy(() => import("../Dashboard/pages/Products/Products"));
const AddProducts = lazy(() =>
  import("../Dashboard/pages/Products/AddProducts")
);
const EditProduct = lazy(() =>
  import("../Dashboard/pages/Products/EditProduct")
);
const Brand = lazy(() => import("../Dashboard/pages/Brands/Brand"));
const AddBrand = lazy(() => import("../Dashboard/pages/Brands/AddBrand"));
const EditBrand = lazy(() => import("../Dashboard/pages/Brands/EditBrand"));

// Suspense wrapper
const withSuspense = (Component) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
);

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: withSuspense(Home) },
      {
        path: "login",
        element: withSuspense(Login),
      },
      {
        path: "register",
        element: withSuspense(Register),
      },
      {
        path: "show-categories",
        element: withSuspense(showCategories),
      },
      {
        path: "show-categories/:id",
        element: withSuspense(ShowProducts),
      },
      {
        element: <RequiredAuth />,
        children: [
          {
            path: "dashboard",
            element: withSuspense(Dashboard),
            children: [
              {
                element: (
                  <RoleBasedRoute allowedRoles={["product manager", "admin"]} />
                ),
                children: [
                  { path: "categories", element: withSuspense(Categories) },
                  { path: "add-category", element: withSuspense(AddCategory) },
                  {
                    path: "edit-Category/:id",
                    element: withSuspense(EditCategory),
                  },
                  { path: "products", element: withSuspense(Products) },
                  { path: "add/products", element: withSuspense(AddProducts) },
                  {
                    path: "edit/products/:id",
                    element: withSuspense(EditProduct),
                  },
                  { path: "brand", element: withSuspense(Brand) },
                  { path: "add/brand", element: withSuspense(AddBrand) },
                  { path: "edit/brand/:id", element: withSuspense(EditBrand) },
                ],
              },

              {
                element: <RoleBasedRoute allowedRoles={["admin"]} />,
                children: [
                  { path: "users", element: withSuspense(Users) },
                  { path: "users/edit/:id", element: withSuspense(EditUser) },
                  { path: "users/add", element: withSuspense(AddUser) },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default Router;
