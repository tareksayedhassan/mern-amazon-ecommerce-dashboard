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
import Writer from "../Dashboard/pages/Writer/Writer";
import RoleBasedRoute from "../pages/auth/RoleBasedRoute";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },

      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },

      {
        element: <RequiredAuth />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            children: [
              {
                element: <RoleBasedRoute allowedRoles={["writer", "admin"]} />,
                children: [
                  {
                    path: "writer",
                    element: <Writer />,
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
