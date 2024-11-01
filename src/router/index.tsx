import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../views/public/Home';
import Layout from '../views/layout/Layout';
import PreferenceManagement from '../views/nurse/PreferenceManagement/PreferenceManagement';
import RequestManagement from '../views/supervisor/RequestManagement/RequestManagement';
import UserManagement from '../views/admin/UserManagement/UserManagement';
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
      { path: '', element: <Home /> }, // default child component
      { path: 'preference-management', element: <PreferenceManagement /> },
      { path: 'request-management', element: <RequestManagement /> },
      { path: 'user-management', element: <UserManagement /> },
    ],
  },
]);

export default router;
