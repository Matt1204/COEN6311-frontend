// src/features/api/authApiSlice.ts

import { apiSlice } from './apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: 'auth',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: userDetails => ({
        url: 'signup',
        method: 'POST',
        body: userDetails,
      }),
    }),
    logout: builder.query<void, void>({
      query: () => ({
        url: 'logout',
        method: 'GET',
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery } = authApiSlice;
