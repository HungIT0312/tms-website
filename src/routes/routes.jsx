import { createBrowserRouter } from 'react-router-dom';
import Welcome from '../pages/Welcome/Welcome';
import MainLayout from '../layouts/Main/MainLayout';

const routes = createBrowserRouter([
  {
    path: '/home',
    element: <Welcome />,
  },
  {
    path: '/login',
    element: <Welcome />,
  },
  {
    path: '/register',
    element: <Welcome />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'workspace',
      },
      {
        path: 'board/:boardId',
      },
    ],
  },
]);
export default routes;
