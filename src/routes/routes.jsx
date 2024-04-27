import { createBrowserRouter } from "react-router-dom";
import Welcome from "../pages/Welcome/Welcome";
import MainLayout from "../layouts/Main/MainLayout";
import Login from "../pages/LoginPage/Login";
import Register from "../pages/RegisterPage/Register";
import AuthLayout from "../layouts/Auth/AuthLayout";
import Workspace from "../pages/WorkspacePage/Workspace";
import Board from "../pages/BoardPage/Board";
import VerifiedMail from "../pages/VerifiedPage/VerifiedMail";

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
      {
        path: "verify-mail",
        element: <VerifiedMail />,
      },
    ],
  },

  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Workspace />,
      },

      {
        path: "board/:boardId/:boardTitle",
        element: <Board />,
      },
    ],
  },
]);
export default routes;
