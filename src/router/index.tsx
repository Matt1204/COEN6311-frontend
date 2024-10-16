import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../views/home/Home';
import Layout from '../views/layout/Layout';
import ProfileDemo from '../views/demo3/ProfileDemo';
import Auth from '../views/auth/Auth';

// Define your routes
const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'profile', element: <ProfileDemo /> },
    ],
  },
]);

export default router;
