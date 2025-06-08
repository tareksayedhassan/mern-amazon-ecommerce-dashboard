import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/auth/register";
import ErrorPage from "../pages/Error/Error";
import Login from "../pages/auth/login";
import Home from "../pages/Home";
import Users from "../Dashboard/users/Users";
import Dashboard from "../Dashboard/dashboard/Dashboard";
import RequiredAuth from "../pages/auth/RequiredAuth";
import EditUser from "../Dashboard/users/EditUser";

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
                path: "users",
                element: <Users />,
              },
              {
                path: "users/:id",
                element: <EditUser />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default Router;
