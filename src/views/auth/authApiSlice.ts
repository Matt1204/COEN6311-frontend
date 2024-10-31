// src/features/api/authApiSlice.ts

import { apiSlice } from '../../store/apiSlice';

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
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice;
