import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/auth/register";
import ErrorPage from "../pages/Error/Error";
import Login from "../pages/auth/login";
import Home from "../pages/Home";
import Users from "../Dashboard/pages/users/Users";
import Dashboard from "../Dashboard/dashboard/Dashboard";
import RequiredAuth from "../pages/auth/RequiredAuth";
import EditUser from "../Dashboard/pages/users/EditUser";
import AddUser from "../Dashboard/pages/users/AddUser";
import RoleBasedRoute from "../pages/auth/RoleBasedRoute";
import RequireBack from "../pages/auth/RequireBack";
import Categories from "../Dashboard/pages/Categorys/categories";
import AddCategory from "../Dashboard/pages/Categorys/AddCategory";
import EditCategory from "../Dashboard/pages/Categorys/EditCategory";
import Products from "../Dashboard/pages/Products/Products";
import AddProducts from "../Dashboard/pages/Products/AddProducts";
import EditProduct from "../Dashboard/pages/Products/EditProduct";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        element: <RequireBack />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },

      {
        element: <RequiredAuth />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            children: [
              {
                element: (
                  <RoleBasedRoute allowedRoles={["product manager", "admin"]} />
                ),
                children: [
                  {
                    path: "categories",
                    element: <Categories />,
                  },
                  {
                    path: "add-category",
                    element: <AddCategory />,
                  },
                  {
                    path: "edit-Category/:id",
                    element: <EditCategory />,
                  },
                  {
                    path: "products",
                    element: <Products />,
                  },
                  {
                    path: "add/products",
                    element: <AddProducts />,
                  },
                  {
                    path: "edit/products/:id",
                    element: <EditProduct />,
                  },
                ],
              },
              {
                element: <RoleBasedRoute allowedRoles={["admin"]} />,
                children: [
                  {
                    path: "users",
                    element: <Users />,
                  },
                  {
                    path: "users/edit/:id",
                    element: <EditUser />,
                  },
                  {
                    path: "users/add",
                    element: <AddUser />,
                  },
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
