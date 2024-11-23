import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { removeUser, setUser } from '../userSlice';

interface AuthResponse {
  access_token: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  u_id: number;
}
interface RefreshResponse {
  data: AuthResponse;
  meta: {
    request: {};
    response: {};
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://127.0.0.1:5000/',
  credentials: 'include', // Ensures cookies are sent along with requests if needed
  prepareHeaders: (headers, { getState }) => {
    // Access the accessToken from the user slice of the Redux state
    const token = (getState() as RootState).user.accessToken;
    // console.log(`Bearer ${token}`);

    // If a token is available, set it in the Authorization header
    if (token) {
      headers.set('Authorization', `Bearer ${token}`); // Use capital 'A' in 'Authorization' for consistency
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {} // Adjust as needed based on the metadata type
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  // console.log('! Original Req returns:');
  // console.log(result);

  // 401 => access token expiration
  if (result.error && result.error.status === 401) {
    console.log('! Original request failed with 401, trying to refresh token');
    // send req to /refresh to refresh access token
    const refreshResult = await api.dispatch(apiSlice.endpoints.refreshToken.initiate());

    // console.log('! refresh results: ');
    // console.log(refreshResult);

    // if refresh is successful (RT is valid)
    // refreshResult.data contains user info + new access token
    if ('data' in refreshResult) {
      const {
        access_token,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        u_id: uId,
      } = (refreshResult as RefreshResponse).data;
      api.dispatch(
        setUser({
          email,
          firstName,
          lastName,
          role,
          accessToken: access_token,
          uId,
        })
      );
      console.log('! refresh success, addUser()');

      // re-try original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // if token refresh failed(RT expired), return 403 error, force user re-login
      console.log('! removeUser()');
      api.dispatch(removeUser());
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Preference', 'Request'],
  endpoints: builder => ({
    demoRequest: builder.query({
      query: () => ({
        url: 'demo',
        method: 'GET',
      }),
    }),
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: 'refresh',
        method: 'GET',
      }),
    }),
  }),
});

export const { useDemoRequestQuery } = apiSlice;
