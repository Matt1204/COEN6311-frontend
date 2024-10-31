import { useDispatch } from 'react-redux';
import { apiSlice } from '../../store/apiSlice';
import { setUser, removeUser } from '../../store/userSlice';

export const useRefreshToken = () => {
  const [refreshTokenMutation] = apiSlice.useRefreshTokenMutation();
  const dispatch = useDispatch();

  const refreshToken = async () => {
    try {
      const refreshResult = await refreshTokenMutation().unwrap();

      const {
        access_token: newAccessToken,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
      } = refreshResult;

      dispatch(
        setUser({
          email,
          firstName,
          lastName,
          role,
          accessToken: newAccessToken,
        })
      );
      console.log('- Refresh: RT valid, setUser()');

      return newAccessToken;
    } catch (error) {
      // Refresh failed, remove user
      console.log('- Refresh: RT expire, removeUser()');

      dispatch(removeUser());
      throw error;
    }
  };

  return refreshToken;
};
