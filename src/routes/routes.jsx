import { createBrowserRouter } from "react-router-dom";
import Welcome from "../pages/Welcome/Welcome";
import MainLayout from "../layouts/Main/MainLayout";
import Login from "../pages/LoginPage/Login";
import Register from "../pages/RegisterPage/Register";
import AuthLayout from "../layouts/Auth/AuthLayout";

const routes = createBrowserRouter([
  {
    path: "/home",
    element: <Welcome />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
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
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "workspace",
      },
      {
        path: "board/:boardId",
      },
    ],
  },
]);
export default routes;