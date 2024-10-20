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

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="auth" element={<Auth />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="preference-management"
          element={<PreferenceManagement />}
        />
        <Route path="request-management" element={<RequestManagement />} />
        <Route path="user-management" element={<UserManagement />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
