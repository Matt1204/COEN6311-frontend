// import { useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './views/layout/Layout';
import Home from './views/home/Home';
import PreferenceManagement from './views/nurse/preference_management/PreferenceManagement';
import RequestManagement from './views/supervisor/request_management/RequestManagement';
import UserManagement from './views/admin/user_management/UserManagement';
import Auth from './views/auth/Auth';
import RequireAuth from './views/auth/RequireAuth';
import PersistLogin from './views/auth/persistLogin';
import Missing from './views/components/Missing';

import './App.css';

const routeRolesMap = {
  home: ['nurse', 'supervisor', 'admin'],
  'preference-management': ['nurse'],
  'request-management': ['supervisor'],
  'user-management': ['admin'],
};

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="auth" element={<Auth />} />

      {/* protected routes. must be authorized user, if not authorized, to login page */}
      <Route element={<PersistLogin />}>
        <Route path="/" element={<Layout />}>
          <Route element={<RequireAuth allowedRoles={routeRolesMap['home']} />}>
            <Route index element={<Home />} />
          </Route>

          <Route
            element={
              <RequireAuth
                allowedRoles={routeRolesMap['preference-management']}
              />
            }
          >
            <Route
              path="preference-management"
              element={<PreferenceManagement />}
            />
          </Route>

          <Route
            element={
              <RequireAuth allowedRoles={routeRolesMap['request-management']} />
            }
          >
            <Route path="request-management" element={<RequestManagement />} />
          </Route>

          <Route
            element={
              <RequireAuth allowedRoles={routeRolesMap['user-management']} />
            }
          >
            <Route path="user-management" element={<UserManagement />} />
          </Route>

          <Route path="*" element={<Missing />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
