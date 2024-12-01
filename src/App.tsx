// import { useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './views/layout/Layout';
import Home from './views/public/Home';
import PreferenceManagement from './views/nurse/PreferenceManagement/PreferenceManagement';
import RequestManagement from './views/supervisor/RequestManagement/RequestManagement';
import UserManagement from './views/admin/UserManagement/UserManagement';
import Auth from './views/auth/Auth';
import RequireAuth from './views/auth/RequireAuth';
import PersistLogin from './views/auth/persistLogin';
import Missing from './views/components/Missing';
import NurseSchedule from './views/nurse/NurseSchedule/NurseSchedule';
import PrefTemplateManagement from './views/nurse/NurseTemplateManagement/PrefTemplateManagement';
import HospitalSchedule from './views/supervisor/HosipitalSchedule/HosipitalSchedule';
import HospitalTemplate from './views/supervisor/HospitalTemplate/HospitalTemplate';
import ScheduleManagement from './views/admin/ScheduleManagement/ScheduleManagement';
import { Snackbar, Alert } from '@mui/material';

import './App.css';
import Unauthorized from './views/components/Unauthorized';
import { useAppSelector, useAppDispatch } from './store/storeHooks';
import { closeAlert } from './store/alertSlice';

const routeRolesMap = {
  home: ['nurse', 'supervisor', 'admin'],
  'my-schedule': ['nurse'],
  'pref-management': ['nurse'],
  'indi-template': ['nurse'],
  'hospital-schedule': ['supervisor'],
  'req-management': ['supervisor'],
  'hospital-template': ['supervisor'],
  'user-management': ['admin'],
  'schedule-management': ['admin'],
};

function App() {
  let alertState = useAppSelector(state => state.alert);
  const dispatch = useAppDispatch();

  return (
    <>
      <Snackbar
        open={alertState.visible}
        autoHideDuration={2000}
        onClose={() => {
          dispatch(closeAlert());
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => {
            dispatch(closeAlert());
          }}
          severity={alertState.severity}
          sx={{
            width: '100%',
            maxWidth: 400, // Fixed width for the Snackbar
            '& .MuiAlert-message': {
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },
          }}
        >
          {alertState.msg}
        </Alert>
      </Snackbar>
      <Routes>
        {/* public routes */}
        <Route path="auth" element={<Auth />} />

        {/* protected routes. must be authorized user, if not authorized, to login page */}
        <Route path="/" element={<Layout />}>
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={routeRolesMap['home']} />}>
              <Route index element={<Home />} />
            </Route>

            {/* Routes for Nurses */}
            <Route element={<RequireAuth allowedRoles={routeRolesMap['my-schedule']} />}>
              <Route path="my-schedule" element={<NurseSchedule />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={routeRolesMap['pref-management']} />}>
              <Route path="pref-management" element={<PreferenceManagement />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={routeRolesMap['indi-template']} />}>
              <Route path="indi-template" element={<PrefTemplateManagement />} />
            </Route>

            {/* Routes for Supervisors */}
            <Route element={<RequireAuth allowedRoles={routeRolesMap['hospital-schedule']} />}>
              <Route path="hospital-schedule" element={<HospitalSchedule />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={routeRolesMap['req-management']} />}>
              <Route path="req-management" element={<RequestManagement />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={routeRolesMap['hospital-template']} />}>
              <Route path="hospital-template" element={<HospitalTemplate />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={routeRolesMap['user-management']} />}>
              <Route path="user-management" element={<UserManagement />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={routeRolesMap['schedule-management']} />}>
              <Route path="schedule-management" element={<ScheduleManagement />} />
            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<Missing />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
