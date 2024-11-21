import { useDispatch } from 'react-redux';
import { apiSlice } from '../../store/apiSlices/apiSlice';
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
        u_id: uId,
      } = refreshResult;

      dispatch(
        setUser({
          email,
          firstName,
          lastName,
          role,
          accessToken: newAccessToken,
          uId,
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
