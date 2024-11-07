import { apiSlice } from './apiSlice';

interface User {
  email: string;
  first_name: string;
  last_name: string;
  address: string | null;
  birthday: string | null;
  phone_number: string | null;
  hospital_id: number | null;
  seniority: number | null;
}

interface FetchUserResponse {
  data: User;
}

export interface UpdateUser {
  email: string;
  first_name: string;
  last_name: string;
  address: string | null;
  // birthday: string | null;
  phone_number: string | null;
  hospital_id?: number | null;
  seniority?: number | null;
}

interface UpdateUserResponse {
  data: {
    email: string;
  };
}

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchUser: builder.query<FetchUserResponse, string>({
      query: email => ({
        url: `get-user?email=${encodeURIComponent(email)}`,
        method: 'GET',
      }),
      providesTags: (result, error, email) => [{ type: 'User', id: email }],
      // keepUnusedDataFor: 0,
    }),
    updateUser: builder.mutation<UpdateUserResponse, UpdateUser>({
      query: ({ email, ...userData }) => ({
        url: `update-user?email=${encodeURIComponent(email)}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, args) => [{ type: 'User', id: args.email }],
    }),
  }),
});

export const { useFetchUserQuery, useLazyFetchUserQuery, useUpdateUserMutation } = userApiSlice;
