import { useLocation, Navigate, Outlet } from 'react-router-dom';
// import { selectCurrentToken } from "./authSlice"
import { useAppSelector } from '../../store/storeHooks';
import { RootState } from '../../store/store';
import Unauthorized from '../components/Unauthorized';

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  let user = useAppSelector((state: RootState) => state.user);
  const location = useLocation();

  return !user.accessToken ? (
    <Navigate to="/auth" state={{ forcedLogOut: true, msg: 'from RequireAuth' }} replace />
  ) : allowedRoles.find((role: string) => role == user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  );
};
export default RequireAuth;
