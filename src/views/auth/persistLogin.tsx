import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useRefreshToken } from './useRefreshToken';
import { useAppSelector } from '../../store/storeHooks';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);

  const refreshToken = useRefreshToken();
  let accessToken = useAppSelector(state => state.user.accessToken);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refreshToken();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !accessToken ? verifyRefreshToken() : setIsLoading(false);
    // return () => (isMounted = false);
  }, []);

  return <>{isLoading ? <p>Loading RT...</p> : <Outlet />}</>;
};

export default PersistLogin;
