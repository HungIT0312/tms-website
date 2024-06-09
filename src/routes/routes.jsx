import { createBrowserRouter } from "react-router-dom";
import Welcome from "../pages/Welcome/Welcome";
import MainLayout from "../layouts/Main/MainLayout";
import Login from "../pages/LoginPage/Login";
import Register from "../pages/RegisterPage/Register";
import AuthLayout from "../layouts/Auth/AuthLayout";
import Workspace from "../pages/WorkspacePage/Workspace";
import Board from "../pages/BoardPage/Board";
import VerifiedMail from "../pages/VerifiedPage/VerifiedMail";
import CardDetail from "../components/Modal/CardDetail/CardDetail";
import UserPage from "../pages/UserPage/UserPage";
import NotFoundPage from "../pages/ErrorPage/404Page";

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
        children: [
          {
            path: "c/:cardName",
            element: <CardDetail />,
          },
        ],
      },
      {
        path: "user/:userMail",
        children: [
          {
            path: "",
            element: <UserPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
export default routes;
